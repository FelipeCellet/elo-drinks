import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Packages() {
  const navigate = useNavigate();
  const [usuario] = useAuthState(auth);
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const buscarPacotes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pacotes_prontos"));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPacotes(lista);
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error);
      }
    };

    buscarPacotes();
  }, []);

  const contratarPacote = (pkg) => {
    if (!usuario) return;
    navigate(`/packages/contratar/${pkg.id}`);
  };

  return (
    <div className="min-h-screen bg-white text-black py-12 px-4">
      <h2 className="text-3xl font-bold text-[#F4A300] text-center mb-10 uppercase tracking-wide">
        Pacotes Prontos
      </h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {pacotes.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white border border-[#F4A300] p-6 rounded-2xl shadow-lg space-y-4 transition hover:scale-[1.01]"
          >
            <h3 className="text-lg font-bold">{pkg.nome}</h3>
            <p className="text-sm text-gray-700">
              Bebidas incluídas: {pkg.bebidas.join(", ")}
            </p>
            <p className="text-xl font-bold text-[#F4A300]">R$ {pkg.precoBase}</p>

            <button
              onClick={() => contratarPacote(pkg)}
              className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition font-medium"
            >
              Contratar Pacote
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;
