import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Pencil, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Seo } from "@/components/Seo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SocialTab } from "./SocialTab";
import { PostsPanel } from "./PostsPanel";

const inputCls = "font-ui";
const labelCls = "block font-ui text-sm font-bold mb-1.5";

function Field({ label, children }) {
  return <div><label className={labelCls}>{label}</label>{children}</div>;
}

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------
const emptyProject = { title: "", category: "", description: "", objective: "", solution: "", cover_image: "", imagesText: "", is_demo: false, featured: false };

function ProjectsTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProject);

  const load = useCallback(() => api.get("/admin/projects").then((r) => setItems(r.data)).catch(() => toast.error("Erro ao carregar projetos")), []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyProject); setOpen(true); };
  const openEdit = (p) => { setEditing(p); setForm({ ...p, imagesText: (p.images || []).join("\n") }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, images: form.imagesText.split("\n").map((s) => s.trim()).filter(Boolean) };
    delete payload.imagesText; delete payload.id; delete payload.created_at;
    try {
      if (editing) await api.put(`/admin/projects/${editing.id}`, payload);
      else await api.post("/admin/projects", payload);
      toast.success(editing ? "Projeto atualizado" : "Projeto criado");
      setOpen(false); load();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const remove = async (p) => {
    if (!window.confirm(`Remover "${p.title}"?`)) return;
    try { await api.delete(`/admin/projects/${p.id}`); toast.success("Projeto removido"); load(); }
    catch { toast.error("Erro ao remover"); }
  };

  return (
    <div data-testid="admin-projects-tab">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sub text-lg font-semibold">Projetos ({items.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full" data-testid="admin-project-new-button"><Plus size={16} /> Novo projeto</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="admin-project-dialog">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Editar projeto" : "Novo projeto"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <Field label="Título *"><Input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="project-form-title" /></Field>
              <Field label="Categoria *"><Input required className={inputCls} placeholder="Branding, Social Media, Supermercados, Impressos…" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="project-form-category" /></Field>
              <Field label="Descrição"><Textarea className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="project-form-description" /></Field>
              <Field label="Objetivo"><Textarea className={inputCls} rows={2} value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} data-testid="project-form-objective" /></Field>
              <Field label="Solução"><Textarea className={inputCls} rows={2} value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} data-testid="project-form-solution" /></Field>
              <Field label="URL da imagem de capa *"><Input required className={inputCls} value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} data-testid="project-form-cover" /></Field>
              <Field label="URLs de imagens extras (uma por linha)"><Textarea className={inputCls} rows={3} value={form.imagesText} onChange={(e) => setForm({ ...form, imagesText: e.target.value })} data-testid="project-form-images" /></Field>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 font-ui text-sm font-bold"><input type="checkbox" checked={form.is_demo} onChange={(e) => setForm({ ...form, is_demo: e.target.checked })} data-testid="project-form-demo" /> Demonstrativo</label>
                <label className="flex items-center gap-2 font-ui text-sm font-bold"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} data-testid="project-form-featured" /> Destaque na home</label>
              </div>
              <Button type="submit" className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full w-full" data-testid="project-form-submit">Salvar projeto</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b"><tr className="text-left font-ui">
            <th className="p-4">Título</th><th className="p-4 hidden md:table-cell">Categoria</th><th className="p-4 hidden sm:table-cell">Status</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b last:border-0" data-testid={`admin-project-row-${p.id}`}>
                <td className="p-4 font-ui font-bold">{p.title}</td>
                <td className="p-4 hidden md:table-cell text-neutral-500">{p.category}</td>
                <td className="p-4 hidden sm:table-cell space-x-2">
                  {p.is_demo && <Badge variant="secondary" className="font-ui">Demonstrativo</Badge>}
                  {p.featured && <Badge className="font-ui bg-[#0A0A0A]">Destaque</Badge>}
                </td>
                <td className="p-4 text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(p)} aria-label={`Editar ${p.title}`} data-testid={`admin-project-edit-${p.id}`}><Pencil size={16} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(p)} aria-label={`Remover ${p.title}`} data-testid={`admin-project-delete-${p.id}`}><Trash2 size={16} className="text-red-500" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-neutral-500">Nenhum projeto cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Serviços
// ---------------------------------------------------------------------------
const emptyService = { title: "", description: "", icon: "Sparkles", order: 10, highlight: false, itemsText: "" };

function ServicesTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyService);

  const load = useCallback(() => api.get("/admin/services").then((r) => setItems(r.data)).catch(() => toast.error("Erro ao carregar serviços")), []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyService); setOpen(true); };
  const openEdit = (s) => { setEditing(s); setForm({ ...s, itemsText: (s.items || []).join("\n") }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, order: Number(form.order) || 0, items: form.itemsText.split("\n").map((s) => s.trim()).filter(Boolean) };
    delete payload.itemsText; delete payload.id; delete payload.created_at;
    try {
      if (editing) await api.put(`/admin/services/${editing.id}`, payload);
      else await api.post("/admin/services", payload);
      toast.success("Serviço salvo"); setOpen(false); load();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const remove = async (s) => {
    if (!window.confirm(`Remover "${s.title}"?`)) return;
    try { await api.delete(`/admin/services/${s.id}`); toast.success("Serviço removido"); load(); }
    catch { toast.error("Erro ao remover"); }
  };

  return (
    <div data-testid="admin-services-tab">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sub text-lg font-semibold">Serviços ({items.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full" data-testid="admin-service-new-button"><Plus size={16} /> Novo serviço</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto" data-testid="admin-service-dialog">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Editar serviço" : "Novo serviço"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <Field label="Título *"><Input required className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} data-testid="service-form-title" /></Field>
              <Field label="Descrição *"><Textarea required className={inputCls} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} data-testid="service-form-description" /></Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Ícone (Share2, Target, PenTool, Fingerprint, Printer, Mic, Store, Megaphone, ShoppingCart, Sparkles)">
                  <Input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} data-testid="service-form-icon" />
                </Field>
                <Field label="Ordem"><Input type="number" className={inputCls} value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} data-testid="service-form-order" /></Field>
              </div>
              <Field label="Itens de destaque (um por linha)"><Textarea className={inputCls} rows={3} value={form.itemsText} onChange={(e) => setForm({ ...form, itemsText: e.target.value })} data-testid="service-form-items" /></Field>
              <label className="flex items-center gap-2 font-ui text-sm font-bold"><input type="checkbox" checked={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.checked })} data-testid="service-form-highlight" /> Destaque especial (ex.: supermercados)</label>
              <Button type="submit" className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full w-full" data-testid="service-form-submit">Salvar serviço</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b"><tr className="text-left font-ui">
            <th className="p-4">Título</th><th className="p-4 hidden sm:table-cell">Ordem</th><th className="p-4 hidden sm:table-cell">Destaque</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b last:border-0" data-testid={`admin-service-row-${s.id}`}>
                <td className="p-4 font-ui font-bold">{s.title}</td>
                <td className="p-4 hidden sm:table-cell text-neutral-500">{s.order}</td>
                <td className="p-4 hidden sm:table-cell">{s.highlight && <Badge className="font-ui bg-[#0A0A0A]">Especial</Badge>}</td>
                <td className="p-4 text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)} aria-label={`Editar ${s.title}`} data-testid={`admin-service-edit-${s.id}`}><Pencil size={16} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s)} aria-label={`Remover ${s.title}`} data-testid={`admin-service-delete-${s.id}`}><Trash2 size={16} className="text-red-500" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Depoimentos
// ---------------------------------------------------------------------------
const emptyTestimonial = { name: "", company: "", text: "", authorized: false, rating: 5, verified: false };

function TestimonialsTab() {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyTestimonial);

  const load = useCallback(() => api.get("/admin/testimonials").then((r) => setItems(r.data)).catch(() => toast.error("Erro ao carregar depoimentos")), []);
  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm(emptyTestimonial); setOpen(true); };
  const openEdit = (t) => { setEditing(t); setForm({ name: t.name, company: t.company, text: t.text, authorized: t.authorized, rating: t.rating || 5, verified: !!t.verified }); setOpen(true); };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/admin/testimonials/${editing.id}`, form);
      else await api.post("/admin/testimonials", form);
      toast.success("Depoimento salvo"); setOpen(false); load();
    } catch (err) { toast.error(formatApiError(err)); }
  };

  const remove = async (t) => {
    if (!window.confirm(`Remover depoimento de "${t.name}"?`)) return;
    try { await api.delete(`/admin/testimonials/${t.id}`); toast.success("Depoimento removido"); load(); }
    catch { toast.error("Erro ao remover"); }
  };

  return (
    <div data-testid="admin-testimonials-tab">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-sub text-lg font-semibold">Depoimentos ({items.length})</h2>
          <p className="text-xs text-neutral-500 mt-1">Somente depoimentos com autorização marcada aparecem no site.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full" data-testid="admin-testimonial-new-button"><Plus size={16} /> Novo depoimento</Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl" data-testid="admin-testimonial-dialog">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Editar depoimento" : "Novo depoimento"}</DialogTitle></DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <Field label="Nome do cliente *"><Input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="testimonial-form-name" /></Field>
              <Field label="Empresa"><Input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} data-testid="testimonial-form-company" /></Field>
              <Field label="Depoimento *"><Textarea required className={inputCls} rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} data-testid="testimonial-form-text" /></Field>
              <Field label="Nota (1 a 5 estrelas)">
                <select className="w-full font-ui text-sm rounded-lg border border-black/15 px-4 py-3" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })} data-testid="testimonial-form-rating">
                  {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} estrela{n > 1 ? "s" : ""}</option>)}
                </select>
              </Field>
              <label className="flex items-center gap-2 font-ui text-sm font-bold"><input type="checkbox" checked={form.verified} onChange={(e) => setForm({ ...form, verified: e.target.checked })} data-testid="testimonial-form-verified" /> Avaliação verificada (identidade comprovada)</label>
              <label className="flex items-center gap-2 font-ui text-sm font-bold"><input type="checkbox" checked={form.authorized} onChange={(e) => setForm({ ...form, authorized: e.target.checked })} data-testid="testimonial-form-authorized" /> Cliente autorizou a publicação</label>
              <Button type="submit" className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full w-full" data-testid="testimonial-form-submit">Salvar depoimento</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b"><tr className="text-left font-ui">
            <th className="p-4">Cliente</th><th className="p-4 hidden md:table-cell">Publicado</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-b last:border-0" data-testid={`admin-testimonial-row-${t.id}`}>
                <td className="p-4"><span className="font-ui font-bold">{t.name}</span>{t.company && <span className="text-neutral-500"> — {t.company}</span>}{t.rating ? <span className="text-neutral-500 text-xs"> · {t.rating}★</span> : null}</td>
                <td className="p-4 hidden md:table-cell">{t.authorized ? <Badge className="font-ui bg-green-600">Autorizado</Badge> : <Badge variant="secondary" className="font-ui">Oculto</Badge>}</td>
                <td className="p-4 text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(t)} aria-label={`Editar depoimento de ${t.name}`} data-testid={`admin-testimonial-edit-${t.id}`}><Pencil size={16} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(t)} aria-label={`Remover depoimento de ${t.name}`} data-testid={`admin-testimonial-delete-${t.id}`}><Trash2 size={16} className="text-red-500" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-neutral-500">Nenhum depoimento cadastrado.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Contatos (leads)
// ---------------------------------------------------------------------------
function LeadsTab() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  const load = useCallback(() => api.get("/admin/leads").then((r) => setItems(r.data)).catch(() => toast.error("Erro ao carregar contatos")), []);
  useEffect(() => { load(); }, [load]);

  const markRead = async (lead) => {
    try { await api.put(`/admin/leads/${lead.id}/read`); load(); }
    catch { toast.error("Erro ao atualizar"); }
  };

  const openDetail = (lead) => {
    setSelected(lead);
    if (!lead.read) markRead(lead);
  };

  const remove = async (lead) => {
    if (!window.confirm(`Remover contato de "${lead.name}"?`)) return;
    try { await api.delete(`/admin/leads/${lead.id}`); setSelected(null); toast.success("Contato removido"); load(); }
    catch { toast.error("Erro ao remover"); }
  };

  return (
    <div data-testid="admin-leads-tab">
      <h2 className="font-sub text-lg font-semibold mb-6">Contatos recebidos ({items.filter((l) => !l.read).length} não lidos de {items.length})</h2>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 border-b"><tr className="text-left font-ui">
            <th className="p-4">Nome</th><th className="p-4 hidden md:table-cell">Empresa</th><th className="p-4 hidden lg:table-cell">Data</th><th className="p-4 hidden sm:table-cell">Status</th><th className="p-4 text-right">Ações</th>
          </tr></thead>
          <tbody>
            {items.map((l) => (
              <tr key={l.id} className={`border-b last:border-0 ${!l.read ? "bg-[#0A0A0A]/5" : ""}`} data-testid={`admin-lead-row-${l.id}`}>
                <td className="p-4 font-ui font-bold">{l.name}</td>
                <td className="p-4 hidden md:table-cell text-neutral-500">{l.company || "—"}</td>
                <td className="p-4 hidden lg:table-cell text-neutral-500">{new Date(l.created_at).toLocaleString("pt-BR")}</td>
                <td className="p-4 hidden sm:table-cell">{l.read ? <Badge variant="secondary" className="font-ui">Lido</Badge> : <Badge className="font-ui bg-[#0A0A0A]">Novo</Badge>}</td>
                <td className="p-4 text-right space-x-1">
                  <Button size="icon" variant="ghost" onClick={() => openDetail(l)} aria-label={`Ver contato de ${l.name}`} data-testid={`admin-lead-view-${l.id}`}><Eye size={16} /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(l)} aria-label={`Remover contato de ${l.name}`} data-testid={`admin-lead-delete-${l.id}`}><Trash2 size={16} className="text-red-500" /></Button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Nenhum contato recebido ainda.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-xl" data-testid="admin-lead-dialog">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="font-display">Contato de {selected.name}</DialogTitle></DialogHeader>
              <dl className="space-y-3 text-sm font-ui">
                <div><dt className="font-extrabold">Empresa</dt><dd>{selected.company || "—"}</dd></div>
                <div><dt className="font-extrabold">E-mail</dt><dd><a className="text-[#0A0A0A] underline" href={`mailto:${selected.email}`}>{selected.email}</a></dd></div>
                <div><dt className="font-extrabold">WhatsApp</dt><dd>{selected.whatsapp}</dd></div>
                <div><dt className="font-extrabold">Serviços desejados</dt><dd>{selected.services?.length ? selected.services.join(", ") : "—"}</dd></div>
                <div><dt className="font-extrabold">Orçamento</dt><dd>{selected.budget || "—"}</dd></div>
                <div><dt className="font-extrabold">Descrição do projeto</dt><dd className="whitespace-pre-wrap">{selected.description}</dd></div>
              </dl>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Configurações
// ---------------------------------------------------------------------------
function SettingsTab() {
  const [form, setForm] = useState(null);

  useEffect(() => { api.get("/settings").then((r) => setForm(r.data)).catch(() => toast.error("Erro ao carregar configurações")); }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form };
    delete payload.key;
    try { await api.put("/admin/settings", payload); toast.success("Configurações salvas"); }
    catch (err) { toast.error(formatApiError(err)); }
  };

  if (!form) return <p className="text-neutral-500">Carregando…</p>;

  return (
    <form onSubmit={save} className="bg-white border rounded-lg p-6 sm:p-8 max-w-2xl space-y-5" data-testid="admin-settings-tab">
      <h2 className="font-sub text-lg font-semibold">Configurações do site</h2>
      <Field label="WhatsApp — número com DDI (apenas dígitos, ex.: 5551998893041)"><Input className={inputCls} value={form.whatsapp_number} onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })} data-testid="settings-whatsapp-number" /></Field>
      <Field label="WhatsApp — exibição (ex.: (51) 99889-3041)"><Input className={inputCls} value={form.whatsapp_display} onChange={(e) => setForm({ ...form, whatsapp_display: e.target.value })} data-testid="settings-whatsapp-display" /></Field>
      <Field label="E-mail de contato"><Input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} data-testid="settings-email" /></Field>
      <p className="text-xs text-neutral-500">Redes sociais agora são gerenciadas na aba <strong>Redes sociais</strong>.</p>
      <Button type="submit" className="font-ui font-bold bg-[#0A0A0A] hover:bg-[#262626] rounded-full" data-testid="settings-submit">Salvar configurações</Button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (!loading && !user) navigate("/admin"); }, [user, loading, navigate]);

  if (loading || !user) {
    return <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center"><p className="font-ui text-neutral-500">Carregando…</p></main>;
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA]" data-testid="admin-dashboard">
      <Seo title="Painel Administrativo" />
      <header className="bg-[#0A0A0A] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/logo-v-branca.png" alt="Borcioni Design" className="h-8 w-auto" />
            <span className="font-ui text-xs font-extrabold tracking-[0.2em] uppercase text-white/60 hidden sm:inline">Painel administrativo</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-ui text-xs text-white/60 hidden md:inline">{user.email}</span>
            <a href="/" className="font-ui text-xs font-bold text-white/70 hover:text-white transition-colors" data-testid="admin-view-site">Ver site</a>
            <button onClick={() => { logout(); navigate("/admin"); }} className="font-ui text-xs font-bold text-white/70 hover:text-white flex items-center gap-1.5 transition-colors" data-testid="admin-logout-button">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <Tabs defaultValue="projects">
          <TabsList className="font-ui mb-8 flex-wrap h-auto gap-1" data-testid="admin-tabs">
            <TabsTrigger value="projects" data-testid="admin-tab-projects">Projetos</TabsTrigger>
            <TabsTrigger value="services" data-testid="admin-tab-services">Serviços</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="admin-tab-testimonials">Depoimentos</TabsTrigger>
            <TabsTrigger value="leads" data-testid="admin-tab-leads">Contatos</TabsTrigger>
            <TabsTrigger value="social" data-testid="admin-tab-social">Redes sociais</TabsTrigger>
            <TabsTrigger value="posts" data-testid="admin-tab-posts">Painel do Posts</TabsTrigger>
            <TabsTrigger value="settings" data-testid="admin-tab-settings">Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="projects"><ProjectsTab /></TabsContent>
          <TabsContent value="services"><ServicesTab /></TabsContent>
          <TabsContent value="testimonials"><TestimonialsTab /></TabsContent>
          <TabsContent value="leads"><LeadsTab /></TabsContent>
          <TabsContent value="social"><SocialTab /></TabsContent>
          <TabsContent value="posts"><PostsPanel /></TabsContent>
          <TabsContent value="settings"><SettingsTab /></TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
