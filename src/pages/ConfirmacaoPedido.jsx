import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

function ConfirmacaoPedido() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pacote, setPacote] = useState(null);

  useEffect(() => {
    const fetchPacote = async () => {
      const ref = doc(db, "pacotes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPacote(snap.data());
      } else {
        setPacote(null);
      }
    };
    fetchPacote();
  }, [id]);

  if (!pacote) {
    return (
      <div className="text-center text-gray-600 mt-20">
        <p>Carregando dados do pedido...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white text-black p-6 text-center">
      <h2 className="text-3xl font-bold text-[#F4A300] mb-6">
        Pedido Confirmado!
      </h2>
      <p className="text-lg mb-4">
        Obrigado por contratar a <span className="font-semibold text-[#F4A300]">Elo Drinks</span>!
      </p>

      <div className="bg-white border border-[#F4A300] rounded-xl p-4 text-left space-y-2">
        <p><strong>Pacote:</strong> {pacote.nome || "Personalizado"}</p>
        <p><strong>Data:</strong> {pacote.dataEvento?.toDate?.().toLocaleDateString() || "-"}</p>
        <p><strong>Pessoas:</strong> {pacote.pessoas || "-"}</p>
        <p><strong>Barmen:</strong> {pacote.barmen || "-"}</p>
        <p><strong>Bebidas:</strong> {pacote.bebidas?.join(", ") || "-"}</p>
        <p><strong>Insumos:</strong> {pacote.insumos?.join(", ") || "-"}</p>
        <p><strong>Endereço:</strong> {pacote.endereco || "-"}</p>
        <p><strong>Preço:</strong> R$ {pacote.preco?.toFixed(2).replace(".", ",") || "0,00"}</p>
      </div>

      <button
        onClick={() => navigate("/meus-pacotes")}
        className="mt-6 bg-[#F4A300] text-black py-2 px-6 rounded hover:bg-yellow-500 transition"
      >
        Ver Meus Pacotes
      </button>
    </div>
  );
}

export default ConfirmacaoPedido;
