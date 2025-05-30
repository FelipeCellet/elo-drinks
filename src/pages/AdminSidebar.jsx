import { NavLink, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function AdminSidebar() {
  const navigate = useNavigate();

  const sair = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkBase = "block px-4 py-2 rounded text-sm font-medium hover:bg-[#F4A300]/10";
  const activeClass = "text-[#F4A300] font-semibold";

  return (
    <aside className="w-full sm:w-64 bg-white border-r border-gray-200 h-full p-4 space-y-6">
      <div className="text-[#F4A300] font-bold text-xl text-center">Admin Elo Drinks</div>

      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700"}`}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/admin/aprovacoes"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700"}`}
        >
          ✅ Aprovações
        </NavLink>
        <NavLink
          to="/admin/pagamentos"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700"}`}
        >
          💰 Pagamentos
        </NavLink>
        <NavLink
          to="/admin/pedidos"
          className={({ isActive }) => `${linkBase} ${isActive ? activeClass : "text-gray-700"}`}
        >
          📦 Pedidos
        </NavLink>
      </nav>

      <div className="border-t pt-4">
        <button
          onClick={sair}
          className="w-full text-sm text-red-500 hover:text-red-600 transition"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}

export default AdminSidebar;
