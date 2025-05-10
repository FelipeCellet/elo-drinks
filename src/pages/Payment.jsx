import { useParams, useNavigate } from "react-router-dom";

const samplePackages = [
  {
    id: "1",
    nome: "Pacote Festa Clássica",
    bebidas: ["Caipirinha", "Gin Tônica", "Cuba Libre"],
    preco: 1200,
  },
  {
    id: "2",
    nome: "Pacote Premium",
    bebidas: ["Espumante", "Drinks Autorais", "Whisky"],
    preco: 2200,
  },
];

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pacote = samplePackages.find((p) => p.id === id);

  const finalizar = () => {
    alert("Pagamento confirmado! Obrigado pela contratação ✨");
    navigate("/");
  };

  if (!pacote) return <p className="text-center text-white">Pacote não encontrado.</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-black text-white rounded-xl shadow space-y-6 border border-gray-800">
      <h2 className="text-2xl font-bold text-[#F4A300] text-center">Pagamento</h2>
      <div className="space-y-2">
        <p><strong>Pacote:</strong> {pacote.nome}</p>
        <p><strong>Bebidas:</strong> {pacote.bebidas.join(", ")}</p>
        <p className="text-xl font-bold text-green-400">Total: R$ {pacote.preco}</p>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={finalizar}
          className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
        >
          Confirmar Pagamento
        </button>
      </div>
    </div>
  );
}

export default Payment;
