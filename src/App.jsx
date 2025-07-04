import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

import Home from './pages/Home';
import Packages from './pages/Packages';
import CustomPackage from './pages/CustomPackage';
import Login from './pages/Login';
import Navbar from './components/navbar';
import PackagesDetails from "./pages/PackagesDetails";
import ContratarPacotePronto from "./pages/ContratarPacotePronto";
import Payment from "./pages/Payment";
import Register from "./pages/Register";
import MyPackages from './pages/MyPackages';
import Portfolio from "./pages/Portfolio";
import ConfirmacaoPedido from "./pages/ConfirmacaoPedido";
import DashboardAdmin from "./pages/DashboardAdmin";
import AdminAprovacoes from "./pages/AdminAprovacoes";
import AdminLayout from "./pages/AdminLayout"; 
import AdminPagamentos from "./pages/AdminPagamentos";
import AdminPedidos from "./pages/AdminPedidos";
import AdminAdicionarPacote from "./pages/AdminAdicionarPacote"; 
import AdminAdicionarOpcional from "./pages/AdminAdicionarOpcional";
import PortfolioPage from "./pages/PortfolioPage";



function AppWrapper() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let isAdmin = false;

        try {
          const ref = doc(db, "usuarios", user.uid);
          const snap = await getDoc(ref);
          if (snap.exists()) {
            isAdmin = snap.data().isAdmin === true;
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }

        setUsuario({ ...user, isAdmin });
      } else {
        setUsuario(null);
      }
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <p className="text-[#F4A300] text-xl font-bold">Carregando...</p>
      </div>
    );
  }

  const esconderNavbar = ["/login", "/register"].includes(location.pathname);

  return (
    <div className="min-h-screen bg-white text-black">
      {!esconderNavbar && <Navbar usuario={usuario} />}

        <main className={`flex-1 ${location.pathname === "/portfolio" ? "p-0 max-w-full" : "p-4 max-w-6xl mx-auto"} w-full`}>

        <Routes>
          <Route path="/" element={usuario ? <Home /> : <Navigate to="/login" replace />} />
          <Route path="/packages" element={usuario ? <Packages /> : <Navigate to="/login" replace />} />
          <Route path="/packages/details/:id" element={<PackagesDetails />} />
          <Route path="/packages/contratar/:id" element={usuario ? <ContratarPacotePronto /> : <Navigate to="/login" replace />} />
          <Route path="/custom" element={usuario ? <CustomPackage /> : <Navigate to="/login" replace />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/confirmacao/:id" element={<ConfirmacaoPedido />} />
          <Route path="/login" element={usuario ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={usuario ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/meus-pacotes" element={usuario ? <MyPackages /> : <Navigate to="/login" replace />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          

          {/* 🔒 Rotas protegidas para administradores */}
          <Route path="/admin" element={usuario?.isAdmin ? <AdminLayout /> : <Navigate to="/login" replace />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
            <Route path="aprovacoes" element={<AdminAprovacoes />} />
            <Route path="pagamentos" element={<AdminPagamentos />} />
            <Route path="pedidos" element={<AdminPedidos />} />
            <Route path="/admin/adicionar-pacote" element={<AdminAdicionarPacote />} />
            <Route path="/admin/opcionais" element={<AdminAdicionarOpcional />} />

          </Route>
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
