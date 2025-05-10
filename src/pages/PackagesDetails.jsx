import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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

function PackagesDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pacote = samplePackages.find((p) => p.id === id);

  const [dataEvento, setDataEvento] = useState(null);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pessoas, setPessoas] = useState(50);

  const buscarEndereco = async () => {
    if (cep.length < 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return alert("CEP inválido");
      setCidade(data.localidade);
      setEstado(data.uf);
      setBairro(data.bairro);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const contratar = async () => {
    const endereco = `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`;
    try {
      await addDoc(collection(db, "pacotes"), {
        pacotePronto: true,
        nome: pacote.nome,
        bebidas: pacote.bebidas,
        preco: pacote.preco,
        pessoas,
        dataEvento,
        endereco,
        criadoEm: new Date(),
      });
      navigate(`/payment/${id}`);
    } catch (e) {
      console.error("Erro ao contratar:", e);
    }
  };

  if (!pacote) return <p className="text-center text-white">Pacote não encontrado.</p>;

  return (
    <div className="max-w-xl mx-auto bg-black text-white p-6 rounded-xl border border-gray-800 mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-[#F4A300]">{pacote.nome}</h2>
      <p>Bebidas: {pacote.bebidas.join(", ")}</p>
      <p className="text-xl font-bold text-green-400">R$ {pacote.preco}</p>

      <label className="block mt-4">Data do Evento</label>
      <DatePicker
        selected={dataEvento}
        onChange={(date) => setDataEvento(date)}
        dateFormat="dd/MM/yyyy"
        className="w-full p-2 bg-gray-900 text-white rounded"
      />

      <label className="block mt-4">Quantidade de Pessoas</label>
      <input
        type="number"
        min="1"
        value={pessoas}
        onChange={(e) => setPessoas(e.target.value)}
        className="w-full p-2 bg-gray-900 text-white rounded"
      />

      <label className="block mt-4">Endereço</label>
      <input
        type="text"
        value={cep}
        onChange={(e) => setCep(e.target.value)}
        onBlur={buscarEndereco}
        placeholder="CEP"
        className="w-full p-2 bg-gray-900 text-white rounded"
      />
      <input
        type="text"
        value={cidade}
        readOnly
        placeholder="Cidade"
        className="w-full p-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        value={estado}
        readOnly
        placeholder="Estado"
        className="w-full p-2 bg-gray-800 text-white rounded"
      />
      <input
        type="text"
        value={bairro}
        onChange={(e) => setBairro(e.target.value)}
        placeholder="Bairro"
        className="w-full p-2 bg-gray-900 text-white rounded"
      />
      <input
        type="text"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        placeholder="Número"
        className="w-full p-2 bg-gray-900 text-white rounded"
      />
      <input
        type="text"
        value={complemento}
        onChange={(e) => setComplemento(e.target.value)}
        placeholder="Complemento"
        className="w-full p-2 bg-gray-900 text-white rounded"
      />

      <button
        onClick={contratar}
        className="w-full bg-[#F4A300] text-black py-2 mt-4 rounded hover:bg-yellow-500"
      >
        Finalizar Contratação
      </button>
    </div>
  );
}

export default PackagesDetails;
