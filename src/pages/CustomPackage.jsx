import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";

function EditablePackageWizard() {
  const [usuario] = useAuthState(auth);
  const [step, setStep] = useState(1);
  const [pessoas, setPessoas] = useState(0);
  const [barmen, setBarmen] = useState(1);
  const [bebidas, setBebidas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  const navigate = useNavigate();

  const tiposBebida = ["Vodka", "Gin", "Whisky", "Cerveja", "Espumante", "Drinks Autorais"];
  const tiposInsumos = ["Gelo", "Copos", "Guardanapos", "Canudos", "Limão", "Açúcar"];

  const toggleItem = (item, list, setList) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const calcularBarmenRecomendado = (p) => {
    if (p <= 50) return 1;
    if (p <= 100) return 2;
    return Math.ceil(p / 50);
  };

  const buscarEndereco = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCidade(data.localidade);
        setEstado(data.uf);
        setBairro(data.bairro);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  const usarLocalizacaoAtual = async () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const addr = data.address;
          setCidade(addr.city || addr.town || addr.village || "");
          setEstado(addr.state || "");
          setBairro(addr.suburb || addr.neighbourhood || "");
          setCep(addr.postcode || "");
        } catch (err) {
          console.error("Erro ao obter endereço:", err);
          alert("Não foi possível obter a localização.");
        }
      },
      () => {
        alert("Permissão negada ou erro ao acessar a localização.");
      }
    );
  };

  const finalizar = async () => {
    const endereco = `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`;
    try {
      await addDoc(collection(db, "pacotes"), {
        uid: usuario?.uid || null,
        pessoas,
        barmen,
        bebidas,
        insumos,
        endereco,
        preco: 500 + barmen * 600 + bebidas.length * 100 + insumos.length * 30,
        status: "em análise",
        statusPagamento: "pendente", // ✅ novo campo adicionado
        criadoEm: new Date(),
        pacotePronto: false
      });

      setPedidoEnviado(true);
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      alert("Erro ao finalizar pacote");
    }
  };

  const etapas = [
    {
      id: 1,
      titulo: "Número de Pessoas",
      conteudo: (
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Quantidade de pessoas</label>
          <input
            type="number"
            placeholder="Ex: 50"
            className="w-full p-3 border border-gray-300 rounded"
            value={pessoas}
            onChange={(e) => {
              const valor = Number(e.target.value);
              setPessoas(valor);
              if (valor > 0) setBarmen(calcularBarmenRecomendado(valor));
            }}
          />
        </div>
      )
    },
    {
      id: 2,
      titulo: "Escolha as Bebidas",
      conteudo: (
        <div className="flex flex-wrap gap-4 justify-center">
          {tiposBebida.map((bebida) => (
            <button
              key={bebida}
              onClick={() => toggleItem(bebida, bebidas, setBebidas)}
              className={`w-32 h-24 rounded-lg shadow flex items-center justify-center text-sm font-semibold transition ${
                bebidas.includes(bebida) ? "bg-[#F4A300] text-black" : "bg-gray-100 text-black"
              }`}
            >
              🍸 {bebida}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 3,
      titulo: "Escolha os Insumos",
      conteudo: (
        <div className="flex flex-wrap gap-4 justify-center">
          {tiposInsumos.map((insumo) => (
            <button
              key={insumo}
              onClick={() => toggleItem(insumo, insumos, setInsumos)}
              className={`w-32 h-24 rounded-lg shadow flex items-center justify-center text-sm font-semibold transition ${
                insumos.includes(insumo) ? "bg-[#F4A300] text-black" : "bg-gray-100 text-black"
              }`}
            >
              🧃 {insumo}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 4,
      titulo: "Local do Evento",
      conteudo: (
        <div className="space-y-4">
          <button
            onClick={usarLocalizacaoAtual}
            className="w-full bg-gray-200 text-sm text-black py-2 rounded hover:bg-gray-300 transition"
          >
            📍 Usar minha localização atual
          </button>
          <input
            type="text"
            placeholder="CEP"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            onBlur={buscarEndereco}
          />
          <input
            type="text"
            placeholder="Cidade"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
            value={cidade}
            readOnly
          />
          <input
            type="text"
            placeholder="Estado"
            className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
            value={estado}
            readOnly
          />
          <input
            type="text"
            placeholder="Bairro"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
          />
          <input
            type="text"
            placeholder="Número"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
          />
          <input
            type="text"
            placeholder="Complemento"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={complemento}
            onChange={(e) => setComplemento(e.target.value)}
          />
        </div>
      )
    },
    {
      id: 5,
      titulo: "Resumo do Pedido",
      conteudo: (
        <div className="bg-gray-100 p-4 rounded space-y-2">
          <p><strong>Pessoas:</strong> {pessoas}</p>
          <p><strong>Barmen:</strong> {barmen}</p>
          <p><strong>Bebidas:</strong> {bebidas.join(", ") || "Nenhuma"}</p>
          <p><strong>Insumos:</strong> {insumos.join(", ") || "Nenhum"}</p>
          <p><strong>Endereço:</strong> {bairro}, {numero} - {cidade}/{estado}</p>
        </div>
      )
    }
  ];

  const etapaAtual = etapas.find((e) => e.id === step);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white text-black space-y-6">
      <div className="w-full bg-gray-200 h-2 rounded">
        <div className="bg-[#F4A300] h-2 rounded transition-all duration-300" style={{ width: `${(step / etapas.length) * 100}%` }}></div>
      </div>

      <h2 className="text-2xl font-bold text-[#F4A300] text-center">{etapaAtual.titulo}</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {etapaAtual.conteudo}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Voltar
          </button>
        )}

        {step < etapas.length ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500"
          >
            Próximo
          </button>
        ) : (
          <button
            onClick={finalizar}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Finalizar Pedido
          </button>
        )}
      </div>

      {pedidoEnviado && (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded text-center font-medium mt-4">
          Pedido enviado com sucesso! Aguardando confirmação.
        </div>
      )}
    </div>
  );
}

export default EditablePackageWizard;
