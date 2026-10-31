import "@/App.css";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/context/SiteContext";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { ScrollToTop } from "@/components/ScrollToTop";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppFab />
    </>
  );
}

function App() {
  return (
    <SiteProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio/:id" element={<ProjectDetail />} />
              <Route path="/privacidade" element={<Privacy />} />
              <Route path="/termos" element={<Terms />} />
            </Route>
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/painel" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </AuthProvider>
    </SiteProvider>
  );
}

export default App;
