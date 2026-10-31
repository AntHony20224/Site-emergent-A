import os
import logging
import asyncio
from html import escape
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr

from database import (
    db, client, now_iso, new_id, hash_password, verify_password,
    create_token, get_current_admin,
)
from mailer import send_email, EMAIL_FROM_NAME, EMAIL_REPLY_TO

app = FastAPI(title="Borcioni Design API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Anti-spam simples em memória (por chave, janela em segundos)
_hits: dict = {}

def rate_limit(key: str, max_hits: int, window: int) -> None:
    import time
    now = time.time()
    lst = [t for t in _hits.get(key, []) if now - t < window]
    if len(lst) >= max_hits:
        raise HTTPException(status_code=429, detail="Muitas tentativas. Aguarde um pouco.")
    lst.append(now)
    _hits[key] = lst


def build_lead_email_html(lead: dict) -> str:
    services = ", ".join(lead.get("services") or []) or "—"
    rows = [
        ("Nome", lead.get("name", "")),
        ("Empresa", lead.get("company") or "—"),
        ("E-mail", lead.get("email", "")),
        ("WhatsApp", lead.get("whatsapp", "")),
        ("Serviços desejados", services),
        ("Orçamento estimado", lead.get("budget") or "—"),
        ("Descrição do projeto", lead.get("description", "")),
    ]
    rows_html = "".join(
        f'<tr><td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;'
        f'color:#171717;border-bottom:1px solid #eee;vertical-align:top;white-space:nowrap">{escape(k)}</td>'
        f'<td style="padding:10px 14px;font-family:Arial,sans-serif;font-size:13px;color:#444;'
        f'border-bottom:1px solid #eee">{escape(str(v))}</td></tr>'
        for k, v in rows
    )
    return (
        '<table role="presentation" width="100%" style="background:#fafafa;padding:24px 0"><tr><td align="center">'
        '<table role="presentation" width="600" style="background:#ffffff;border:1px solid #eee;border-radius:8px;overflow:hidden">'
        '<tr><td style="background:#0a0a0a;padding:20px 24px;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;color:#ffffff">'
        f'Novo pedido de orçamento — {escape(EMAIL_FROM_NAME)}</td></tr>'
        f'<tr><td style="padding:16px 24px 0;font-family:Arial,sans-serif;font-size:14px;color:#444">'
        'Um visitante acabou de enviar o formulário de contato do site. Detalhes abaixo:</td></tr>'
        f'<tr><td style="padding:16px 24px"><table role="presentation" width="100%" style="border-collapse:collapse">{rows_html}</table></td></tr>'
        '<tr><td style="padding:16px 24px;font-family:Arial,sans-serif;font-size:12px;color:#888;border-top:1px solid #eee">'
        f'Enviado automaticamente pelo site da {escape(EMAIL_FROM_NAME)}. Responda diretamente para o remetente entrar em contato com o cliente.</td></tr>'
        '</table></td></tr></table>'
    )


# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class LoginInput(BaseModel):
    email: EmailStr
    password: str


class ServiceIn(BaseModel):
    title: str
    description: str
    icon: str = "Sparkles"
    order: int = 0
    highlight: bool = False
    items: List[str] = []


class ProjectIn(BaseModel):
    title: str
    category: str
    description: str = ""
    objective: str = ""
    solution: str = ""
    cover_image: str = ""
    images: List[str] = []
    is_demo: bool = False
    featured: bool = False


class TestimonialIn(BaseModel):
    name: str
    company: str = ""
    text: str
    authorized: bool = False
    rating: Optional[int] = None
    verified: bool = False
    email: str = ""


class PublicTestimonialIn(BaseModel):
    name: str
    email: EmailStr
    rating: int
    text: str


class LeadIn(BaseModel):
    name: str
    company: str = ""
    email: EmailStr
    whatsapp: str
    services: List[str] = []
    budget: str = ""
    description: str


class SettingsIn(BaseModel):
    whatsapp_number: str = ""
    whatsapp_display: str = ""
    email: str = ""
    instagram: str = ""
    facebook: str = ""
    linkedin: str = ""
    behance: str = ""


DEFAULT_SETTINGS = {
    "key": "site",
    "whatsapp_number": "5551998893041",
    "whatsapp_display": "(51) 99889-3041",
    "email": "borcionidesign@gmail.com",
    "instagram": "",
    "facebook": "",
    "linkedin": "",
    "behance": "",
}

SEED_SERVICES = [
    {"title": "Marketing para Redes Sociais", "icon": "Share2", "order": 1,
     "description": "Gestão estratégica das suas redes: planejamento de conteúdo, calendário editorial e presença digital consistente para aproximar sua marca do público."},
    {"title": "Planejamento Estratégico", "icon": "Target", "order": 2,
     "description": "Diagnóstico da marca, definição de público, posicionamento e metas claras para que cada ação de comunicação tenha propósito e resultado."},
    {"title": "Criação de Posts e Campanhas", "icon": "PenTool", "order": 3,
     "description": "Peças criativas e campanhas completas, do conceito à arte final, com linguagem alinhada à identidade da sua marca."},
    {"title": "Logotipos e Identidades Visuais", "icon": "Fingerprint", "order": 4,
     "description": "Criação de logotipos e sistemas visuais completos: cores, tipografia, aplicações e manual de marca para uso consistente."},
    {"title": "Materiais Gráficos para Impressão", "icon": "Printer", "order": 5,
     "description": "Cartões, folders, banners, cardápios e papelaria com arte final pronta para a gráfica. Não realizamos a impressão."},
    {"title": "Comunicação em Voz", "icon": "Mic", "order": 6,
     "description": "Roteiros e direção criativa para chamadas promocionais, spots e anúncios falados que reforçam a presença da sua marca."},
    {"title": "Publicidade de Rua", "icon": "Store", "order": 7,
     "description": "Comunicação para o ponto de venda e para a rua: fachadas, cartazes, placas e materiais promocionais que chamam atenção."},
    {"title": "Anúncios Digitais Impulsionados", "icon": "Megaphone", "order": 8,
     "description": "Criação e gestão de anúncios patrocinados para redes sociais e Google, com segmentação e acompanhamento de desempenho."},
    {"title": "Publicidade para Supermercados", "icon": "ShoppingCart", "order": 0, "highlight": True,
     "description": "Comunicação completa e recorrente para supermercados, do encarte às redes sociais, mantendo suas ofertas sempre visíveis.",
     "items": ["Ofertas semanais", "Encartes digitais", "Campanhas para redes sociais", "Chamadas promocionais", "Divulgação multicanal"]},
]

SEED_PROJECTS = [
    {"title": "Identidade Visual — Conceito Aurora", "category": "Branding", "is_demo": True, "featured": True,
     "description": "Projeto demonstrativo de identidade visual completa para uma marca fictícia de cafés especiais.",
     "objective": "Criar uma identidade visual marcante que transmita acolhimento e qualidade artesanal.",
     "solution": "Sistema visual com logotipo, paleta de cores quentes, tipografia própria e aplicações em embalagens e papelaria.",
     "cover_image": "https://images.pexels.com/photos/7598009/pexels-photo-7598009.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
     "images": []},
    {"title": "Campanha de Redes Sociais — Conceito Viva", "category": "Social Media", "is_demo": True, "featured": True,
     "description": "Projeto demonstrativo de campanha mensal para redes sociais de uma clínica fictícia de estética.",
     "objective": "Aumentar o engajamento e atrair novos clientes com conteúdo relevante e visualmente consistente.",
     "solution": "Calendário editorial com posts estáticos, carrosséis e stories, mantendo unidade visual em todas as peças.",
     "cover_image": "https://images.unsplash.com/photo-1759215524472-1b0686fdbd87?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxzb2NpYWwlMjBtZWRpYSUyMG1hcmtldGluZ3xlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=85",
     "images": []},
    {"title": "Encarte Digital Semanal — Conceito Mercado Bairro", "category": "Supermercados", "is_demo": True, "featured": True,
     "description": "Projeto demonstrativo de encarte digital semanal com ofertas para um supermercado fictício.",
     "objective": "Divulgar as ofertas da semana de forma clara, atrativa e fácil de compartilhar no WhatsApp e redes sociais.",
     "solution": "Encarte digital em formato otimizado para celular, com hierarquia de preços e identidade forte da loja.",
     "cover_image": "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxzdXBlcm1hcmtldCUyMGZyZXNoJTIwcHJvZHVjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=85",
     "images": []},
    {"title": "Material Impresso — Conceito Serra", "category": "Impressos", "is_demo": True, "featured": False,
     "description": "Projeto demonstrativo de papelaria e materiais impressos para uma pousada fictícia.",
     "objective": "Padronizar a comunicação impressa da pousada, do cartão de visita ao cardápio.",
     "solution": "Kit de papelaria com cartões, folder institucional e cardápio, com arte final pronta para gráfica.",
     "cover_image": "https://images.unsplash.com/photo-1738676524296-364cf18900a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxjcmVhdGl2ZSUyMGRlc2lnbiUyMHN0dWRpbyUyMHdvcmtzcGFjZXxlbnwwfHx8fDE3OTI3MjYxNTB8MA&ixlib=rb-4.1.0&q=85",
     "images": []},
]


# ---------------------------------------------------------------------------
# Auth routes
# ---------------------------------------------------------------------------

@api_router.post("/auth/login")
async def login(input: LoginInput):
    email = input.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")
    token = create_token(user["_id"], email)
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": "admin"}}


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# ---------------------------------------------------------------------------
# Public routes
# ---------------------------------------------------------------------------

@api_router.get("/")
async def root():
    return {"message": "Borcioni Design API"}


@api_router.get("/settings")
async def get_settings():
    settings = await db.settings.find_one({"key": "site"}, {"_id": 0})
    return settings or DEFAULT_SETTINGS


@api_router.get("/services")
async def list_services():
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(100)


@api_router.get("/projects")
async def list_projects(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category and category != "Todos":
        query["category"] = category
    if featured:
        query["featured"] = True
    return await db.projects.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)


@api_router.get("/projects/{project_id}")
async def get_project(project_id: str):
    project = await db.projects.find_one({"id": project_id}, {"_id": 0})
    if not project:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return project


@api_router.get("/testimonials")
async def list_testimonials():
    return await db.testimonials.find({"authorized": True}, {"_id": 0, "email": 0}).sort("created_at", -1).to_list(100)


@api_router.post("/testimonials/public", status_code=201)
async def submit_testimonial(input: PublicTestimonialIn, request: Request):
    """Envio público de avaliação: fica pendente até autorização do admin."""
    rate_limit(f"feedback:{request.client.host}", 3, 3600)
    if not (1 <= input.rating <= 5):
        raise HTTPException(status_code=422, detail="Avaliação deve ser de 1 a 5 estrelas")
    name = input.name.strip()
    text = input.text.strip()
    if not (2 <= len(name) <= 60):
        raise HTTPException(status_code=422, detail="Nome inválido")
    if not (10 <= len(text) <= 600):
        raise HTTPException(status_code=422, detail="Comentário deve ter entre 10 e 600 caracteres")
    email = input.email.lower().strip()
    if await db.testimonials.count_documents({"email": email, "text": text}):
        raise HTTPException(status_code=409, detail="Esta avaliação já foi enviada")
    await db.testimonials.insert_one({
        "id": new_id(), "name": name, "company": "", "text": text, "email": email,
        "rating": input.rating, "verified": False, "authorized": False,
        "created_at": now_iso(),
    })
    return {"message": "Avaliação enviada! Ela será publicada após análise e autorização."}


@api_router.post("/leads", status_code=201)
async def create_lead(input: LeadIn):
    doc = input.model_dump()
    doc.update({"id": new_id(), "read": False, "created_at": now_iso()})
    await db.leads.insert_one(doc)
    asyncio.create_task(notify_lead_email(doc))
    return {"message": "Recebemos seu contato. Retornaremos em breve!", "id": doc["id"]}


async def notify_lead_email(lead: dict) -> None:
    """Envia aviso ao dono do site sobre novo lead. Falhas de e-mail nunca quebram o lead."""
    try:
        settings = await db.settings.find_one({"key": "site"}, {"_id": 0}) or DEFAULT_SETTINGS
        recipient = settings.get("email") or EMAIL_REPLY_TO
        if not recipient:
            logger.warning("E-mail de notificação sem destinatário configurado")
            return
        subject = f"Novo contato pelo site: {lead.get('name', '')}"
        email_id = await send_email(
            to=recipient,
            subject=subject,
            html=build_lead_email_html(lead),
        )
        logger.info("Notificação de lead enviada para %s (id=%s)", recipient, email_id)
    except Exception as e:
        logger.error("Falha ao enviar notificação de lead: %s", e)


# ---------------------------------------------------------------------------
# Admin routes
# ---------------------------------------------------------------------------

admin_router = APIRouter(prefix="/admin", dependencies=[Depends(get_current_admin)])


@admin_router.get("/services")
async def admin_list_services():
    return await db.services.find({}, {"_id": 0}).sort("order", 1).to_list(200)


@admin_router.post("/services", status_code=201)
async def admin_create_service(input: ServiceIn):
    doc = input.model_dump()
    doc.update({"id": new_id(), "created_at": now_iso()})
    await db.services.insert_one(doc)
    doc.pop("_id", None)
    return doc


@admin_router.put("/services/{item_id}")
async def admin_update_service(item_id: str, input: ServiceIn):
    result = await db.services.update_one({"id": item_id}, {"$set": input.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Serviço não encontrado")
    return await db.services.find_one({"id": item_id}, {"_id": 0})


@admin_router.delete("/services/{item_id}", status_code=204)
async def admin_delete_service(item_id: str):
    await db.services.delete_one({"id": item_id})


@admin_router.get("/projects")
async def admin_list_projects():
    return await db.projects.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@admin_router.post("/projects", status_code=201)
async def admin_create_project(input: ProjectIn):
    doc = input.model_dump()
    doc.update({"id": new_id(), "created_at": now_iso()})
    await db.projects.insert_one(doc)
    doc.pop("_id", None)
    return doc


@admin_router.put("/projects/{item_id}")
async def admin_update_project(item_id: str, input: ProjectIn):
    result = await db.projects.update_one({"id": item_id}, {"$set": input.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Projeto não encontrado")
    return await db.projects.find_one({"id": item_id}, {"_id": 0})


@admin_router.delete("/projects/{item_id}", status_code=204)
async def admin_delete_project(item_id: str):
    await db.projects.delete_one({"id": item_id})


@admin_router.get("/testimonials")
async def admin_list_testimonials():
    return await db.testimonials.find({}, {"_id": 0}).sort("created_at", -1).to_list(200)


@admin_router.post("/testimonials", status_code=201)
async def admin_create_testimonial(input: TestimonialIn):
    doc = input.model_dump()
    doc.update({"id": new_id(), "created_at": now_iso()})
    await db.testimonials.insert_one(doc)
    doc.pop("_id", None)
    return doc


@admin_router.put("/testimonials/{item_id}")
async def admin_update_testimonial(item_id: str, input: TestimonialIn):
    result = await db.testimonials.update_one({"id": item_id}, {"$set": input.model_dump()})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Depoimento não encontrado")
    return await db.testimonials.find_one({"id": item_id}, {"_id": 0})


@admin_router.delete("/testimonials/{item_id}", status_code=204)
async def admin_delete_testimonial(item_id: str):
    await db.testimonials.delete_one({"id": item_id})


@admin_router.get("/leads")
async def admin_list_leads():
    return await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)


@admin_router.put("/leads/{item_id}/read")
async def admin_mark_lead_read(item_id: str):
    await db.leads.update_one({"id": item_id}, {"$set": {"read": True}})
    return {"ok": True}


@admin_router.delete("/leads/{item_id}", status_code=204)
async def admin_delete_lead(item_id: str):
    await db.leads.delete_one({"id": item_id})


@admin_router.put("/settings")
async def admin_update_settings(input: SettingsIn):
    doc = input.model_dump()
    doc["key"] = "site"
    await db.settings.update_one({"key": "site"}, {"$set": doc}, upsert=True)
    return doc


api_router.include_router(admin_router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Startup: seed admin, settings, services, demo projects
# ---------------------------------------------------------------------------

@app.on_event("startup")
async def seed_database():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower().strip()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "_id": new_id(),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Administrador",
            "role": "admin",
            "created_at": now_iso(),
        })
        logger.info("Admin user seeded: %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info("Admin password updated from env")

    if await db.settings.count_documents({"key": "site"}) == 0:
        await db.settings.insert_one(dict(DEFAULT_SETTINGS))

    if await db.services.count_documents({}) == 0:
        for svc in SEED_SERVICES:
            doc = dict(svc)
            doc.setdefault("items", [])
            doc.setdefault("highlight", False)
            doc.update({"id": new_id(), "created_at": now_iso()})
            await db.services.insert_one(doc)
        logger.info("Seeded %d services", len(SEED_SERVICES))

    if await db.projects.count_documents({}) == 0:
        for proj in SEED_PROJECTS:
            doc = dict(proj)
            doc.update({"id": new_id(), "created_at": now_iso()})
            await db.projects.insert_one(doc)
        logger.info("Seeded %d demo projects", len(SEED_PROJECTS))

    await db.users.create_index("email", unique=True)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
