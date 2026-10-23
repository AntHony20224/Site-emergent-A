import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Seo } from "@/components/Seo";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      navigate("/admin/painel");
    } else {
      setError(result.error);
    }
  };

  const inputCls = "w-full font-ui text-sm rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#9333EA] focus:border-transparent transition-shadow";

  return (
    <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-5" data-testid="admin-login-page">
      <Seo title="Área Administrativa" />
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <img src="/assets/logo-h-branca.png" alt="Borcioni Design" className="h-12 w-auto mx-auto mb-4" />
          <p className="font-ui text-xs font-bold tracking-[0.2em] uppercase text-white/50">Painel administrativo</p>
        </div>

        <form onSubmit={submit} className="bg-[#171717] border border-white/10 rounded-lg p-8 space-y-5" data-testid="admin-login-form">
          <div>
            <label htmlFor="admin-email" className="block font-ui text-sm font-bold text-white mb-2">E-mail</label>
            <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" className={inputCls} data-testid="admin-login-email" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block font-ui text-sm font-bold text-white mb-2">Senha</label>
            <input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} data-testid="admin-login-password" autoComplete="current-password" />
          </div>

          {error && <p className="font-ui text-sm font-bold text-red-400" role="alert" data-testid="admin-login-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="w-full font-ui font-extrabold text-sm bg-[#9333EA] text-white rounded-full px-6 py-3.5 hover:bg-[#A855F7] transition-colors duration-200 active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <LogIn size={16} /> {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <a href="/" className="block text-center font-ui text-xs font-bold text-white/50 hover:text-white mt-6 transition-colors" data-testid="admin-login-back">
          Voltar ao site
        </a>
      </div>
    </main>
  );
}
