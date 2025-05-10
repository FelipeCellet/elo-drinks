import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";

function Navbar({ usuario }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const linkClasses = ({ isActive }) =>
    `text-sm font-medium ${
      isActive ? "text-[#F4A300]" : "text-gray-300"
    } hover:text-[#F4A300] transition`;

  return (
    <header className="bg-black shadow p-4 border-b border-gray-800">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1
            className="text-xl font-bold text-[#F4A300] cursor-pointer"
            onClick={() => navigate("/")}
          >
            Elo Drinks
          </h1>
          <NavLink to="/" className={linkClasses}>
            Início
          </NavLink>
          <NavLink to="/packages" className={linkClasses}>
            Pacotes
          </NavLink>
          <NavLink to="/custom" className={linkClasses}>
            Personalizar
          </NavLink>
          {usuario && !usuario.isAnonymous && (
            <NavLink to="/admin" className={linkClasses}>
              Admin
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {usuario?.isAnonymous ? "Olá, Visitante" : `Olá, ${usuario?.email}`}
          </span>
          <button
            onClick={handleLogout}
            className="bg-[#F4A300] text-black px-3 py-1 rounded hover:bg-yellow-500 transition text-sm"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
