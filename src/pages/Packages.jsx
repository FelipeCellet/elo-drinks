import { useNavigate } from "react-router-dom";

const samplePackages = [
  {
    id: 1,
    nome: "Pacote Festa Clássica",
    bebidas: ["Caipirinha", "Gin Tônica", "Cuba Libre"],
    preco: 1200,
  },
  {
    id: 2,
    nome: "Pacote Premium",
    bebidas: ["Espumante", "Drinks Autorais", "Whisky"],
    preco: 2200,
  },
];

function Packages() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-white">
      <h2 className="text-2xl font-semibold text-[#F4A300] text-center">Pacotes Prontos</h2>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6">
        {samplePackages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-black border border-gray-800 p-6 rounded-2xl shadow-md space-y-4"
          >
            <h3 className="text-lg font-bold text-white">{pkg.nome}</h3>
            <p className="text-sm text-gray-300">
              Bebidas incluídas: {pkg.bebidas.join(", ")}
            </p>
            <p className="text-xl font-bold text-[#F4A300]">R$ {pkg.preco}</p>

            <button
              onClick={() => navigate(`/packages/details/${pkg.id}`)}
              className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
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
