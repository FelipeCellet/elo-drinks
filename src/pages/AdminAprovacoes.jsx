import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function AdminAprovacoes() {
  const [pacotes, setPacotes] = useState([]);
  const [usuario] = useAuthState(auth);

  useEffect(() => {
    const buscarPacotes = async () => {
      const snap = await getDocs(collection(db, "pacotes"));
      const lista = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.criadoEm?.seconds - a.criadoEm?.seconds);
      setPacotes(lista);
    };
    buscarPacotes();
  }, []);

  const atualizarStatus = async (id, novoStatus) => {
    const ref = doc(db, "pacotes", id);
    await updateDoc(ref, {
      status: novoStatus,
      dataAtualizacao: serverTimestamp(),
      aprovadoPor: usuario?.email || "admin",
    });
    setPacotes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: novoStatus } : p))
    );
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 space-y-6 p-4 text-black">
      <h2 className="text-3xl font-bold text-[#F4A300] text-center">
        Aprovação de Pacotes
      </h2>

      {pacotes.filter((p) => p.status === "em análise").length === 0 ? (
        <p className="text-center text-gray-500">Nenhum pacote pendente.</p>
      ) : (
        pacotes
          .filter((p) => p.status === "em análise")
          .map((p) => (
            <div
              key={p.id}
              className="bg-white border border-gray-300 rounded-lg p-4 space-y-2 shadow"
            >
              <p><strong>Pessoas:</strong> {p.pessoas}</p>
              <p><strong>Barmen:</strong> {p.barmen}</p>
              <p><strong>Valor:</strong> R$ {p.preco}</p>
              <p><strong>Endereço:</strong> {p.endereco}</p>
              <p><strong>Bebidas:</strong> {p.bebidas?.join(", ") || "Nenhuma"}</p>
              <p><strong>Insumos:</strong> {p.insumos?.join(", ") || "Nenhum"}</p>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => atualizarStatus(p.id, "confirmado")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition"
                >
                  Aprovar
                </button>
                <button
                  onClick={() => atualizarStatus(p.id, "rejeitado")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition"
                >
                  Rejeitar
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default AdminAprovacoes;
