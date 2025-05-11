import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import Home from './pages/Home';
import Packages from './pages/Packages';
import CustomPackage from './pages/CustomPackage';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import PackagesDetails from "./pages/PackagesDetails";
import Payment from "./pages/Payment";
import Register from "./pages/Register";
import MyPackages from './pages/MyPackages';
import Portfolio from "./pages/Portfolio";



function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });

    return () => unsubscribe();
  }, []);

  if (carregando) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <p className="text-pink-600 text-xl font-bold">Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-black text-white">
        {/* Navbar aparece somente se o usuário estiver logado */}
        {usuario && <Navbar usuario={usuario} />}

        <main className="flex-1 p-4 max-w-4xl mx-auto w-full">
          <Routes>
            <Route
              path="/"
              element={usuario ? <Home /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/packages"
              element={usuario ? <Packages /> : <Navigate to="/login" replace />}
            />
            <Route path="/packages/details/:id" element={<PackagesDetails />} />
            <Route
              path="/custom"
              element={usuario ? <CustomPackage /> : <Navigate to="/login" replace />}
            />
            <Route path="/portfolio" element={<Portfolio />} />

            <Route path="/payment/:id" element={<Payment />} />
            <Route
              path="/login"
              element={usuario ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/register"
              element={usuario ? <Navigate to="/" replace /> : <Register />}
            />
            <Route
              path="/meus-pacotes"
              element={usuario ? <MyPackages /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/admin"
              element={
                usuario && !usuario.isAnonymous ? (
                  <Admin />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
