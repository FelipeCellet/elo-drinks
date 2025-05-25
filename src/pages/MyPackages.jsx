import { useEffect, useState } from "react";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function MyPackages() {
  const [usuario] = useAuthState(auth);
  const [pacotes, setPacotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const buscarPacotes = async () => {
      if (!usuario) return;
      const q = query(collection(db, "pacotes"), where("uid", "==", usuario.uid));
      const snap = await getDocs(q);
      const lista = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPacotes(lista);
    };
    buscarPacotes();
  }, [usuario]);

  const corStatus = {
    "em análise": "bg-yellow-200 text-yellow-800",
    "confirmado": "bg-green-200 text-green-800",
    "rejeitado": "bg-red-200 text-red-800",
    "cancelado": "bg-gray-200 text-gray-800",
    "pago": "bg-blue-200 text-blue-800"
  };

  const cancelarPacote = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja cancelar este pacote?");
    if (!confirmar) return;
    await updateDoc(doc(db, "pacotes", id), { status: "cancelado" });
    setPacotes(prev => prev.map(p => p.id === id ? { ...p, status: "cancelado" } : p));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-6 space-y-6 min-h-screen">
      <h2 className="text-3xl font-bold text-[#F4A300] text-center mb-6">Meus Pacotes</h2>

      {pacotes.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum pacote contratado ainda.</p>
      ) : (
        pacotes.map(p => (
          <div
            key={p.id}
            className="bg-white border border-[#F4A300] rounded-xl p-5 shadow-sm space-y-2"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Pacote {p.nome || "Personalizado"}</h3>
              <span className={`px-2 py-1 text-xs rounded font-medium ${corStatus[p.status] || "bg-gray-200 text-gray-800"}`}>
                {p.status || "em análise"}
              </span>
            </div>
            <p><strong>Pessoas:</strong> {p.pessoas}</p>
            <p><strong>Barmen:</strong> {p.barmen}</p>
            <p><strong>Valor:</strong> R$ {p.preco?.toFixed(2).replace(".", ",")}</p>
            <p><strong>Endereço:</strong> {p.endereco}</p>
            <p><strong>Bebidas:</strong> {p.bebidas?.join(", ") || "-"}</p>
            <p><strong>Insumos:</strong> {p.insumos?.join(", ") || "-"}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => navigate(`/payment/${p.id}`)}
                className="px-4 py-2 bg-[#F4A300] text-black rounded hover:bg-yellow-500 transition text-sm font-semibold"
              >
                Ver mais
              </button>
              {p.status === "em análise" && (
                <button
                  onClick={() => cancelarPacote(p.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm font-semibold"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default MyPackages;
