import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useEffect, useState } from "react";

function DetalhesPacote() {
  const { id } = useParams();
  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarPacote = async () => {
      const docRef = doc(db, "pacotes", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        setPacote({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    };

    buscarPacote();
  }, [id]);

  if (loading) return <p className="text-white p-4">Carregando...</p>;
  if (!pacote) return <p className="text-white p-4">Pacote não encontrado.</p>;

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-[#F4A300] mb-4">Detalhes do Pacote</h1>
      <p><strong>Pessoas:</strong> {pacote.pessoas}</p>
      <p><strong>Barmen:</strong> {pacote.barmen}</p>
      <p><strong>Bebidas:</strong> {pacote.bebidas.join(", ")}</p>
      <p><strong>Insumos:</strong> {pacote.insumos.join(", ")}</p>
      <p><strong>Endereço:</strong> {pacote.endereco}</p>
      <p><strong>Status:</strong> {pacote.status}</p>
      <p><strong>Preço:</strong> R$ {pacote.preco?.toFixed(2)}</p>

      {/* ✅ Verifica o status antes de mostrar botão ou mensagem */}
      <div className="mt-6">
        {pacote.status === "pago" || pacote.status === "confirmado" ? (
          <div className="bg-green-900 border border-green-600 rounded p-4 text-center">
            <p className="text-green-200 font-medium">
              Pagamento já confirmado. Nos vemos no evento! 🎉
            </p>
          </div>
        ) : (
          <button
            onClick={() => {/* lógica para pagar aqui */}}
            className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Realizar Pagamento
          </button>
        )}
      </div>
    </div>
  );
}

export default DetalhesPacote;
