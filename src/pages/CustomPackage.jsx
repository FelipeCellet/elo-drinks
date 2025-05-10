// Versão com animações e navegação por etapas usando framer-motion e vinculação ao usuário
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";

function CustomPackage() {
  const [step, setStep] = useState(0);
  const [userId, setUserId] = useState(null);
  const [barmen, setBarmen] = useState(1);
  const [pessoas, setPessoas] = useState(50);
  const [bebidas, setBebidas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [frutas, setFrutas] = useState([]);
  const [energeticos, setEnergeticos] = useState([]);
  const [dataEvento, setDataEvento] = useState(null);
  const [msg, setMsg] = useState("");

  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserId(user.uid);
    });
    return () => unsubscribe();
  }, []);

  const tiposBebida = ["Whisky", "Vodka", "Gin", "Rum", "Cerveja", "Espumante"];
  const tiposInsumo = ["Gelo", "Limão", "Açúcar", "Copos", "Guardanapos"];
  const tiposFrutas = ["Limão", "Morango", "Kiwi", "Abacaxi"];
  const tiposEnergetico = ["Red Bull", "Monster", "Fusion"];

  const toggleSelection = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const calcularPreco = () => {
    let preco = 500;
    preco += Number(barmen) * 600;
    preco += bebidas.length * 100;
    preco += insumos.length * 30;
    preco += frutas.length * 20;
    preco += energeticos.length * 50;
    return preco;
  };

  const buscarEndereco = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data.erro) return alert("CEP não encontrado.");
      setCidade(data.localidade);
      setEstado(data.uf);
      setBairro(data.bairro);
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const salvarPacote = async () => {
    const endereco = `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`;
    try {
      await addDoc(collection(db, "pacotes"), {
        userId, // Vincula ao usuário
        barmen: Number(barmen),
        pessoas: Number(pessoas),
        bebidas,
        insumos,
        frutas,
        energeticos,
        preco: calcularPreco(),
        dataEvento,
        endereco,
        criadoEm: new Date()
      });
      setMsg("Pacote salvo com sucesso! 🎉");
      setStep(0);
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      setMsg("Erro ao salvar o pacote.");
    }
  };

    const steps = [
    {
      label: "Quantos barmen você deseja?",
      content: (
        <input type="number" min="1" className="w-full p-2 bg-gray-900 border rounded-lg text-white" value={barmen} onChange={(e) => setBarmen(e.target.value)} />
      )
    },
    {
      label: "Quantas pessoas estarão na festa?",
      content: (
        <input type="number" min="1" className="w-full p-2 bg-gray-900 border rounded-lg text-white" value={pessoas} onChange={(e) => setPessoas(e.target.value)} />
      )
    },
    {
      label: "Escolha as bebidas",
      content: (
        <div className="flex flex-wrap gap-2">
          {tiposBebida.map((bebida) => (
            <button key={bebida} onClick={() => toggleSelection(bebida, bebidas, setBebidas)} className={`px-3 py-1 rounded-full text-sm border ${bebidas.includes(bebida) ? "bg-[#F4A300] text-black" : "bg-gray-800 text-white"}`}>{bebida}</button>
          ))}
        </div>
      )
    },
    {
      label: "Escolha os insumos",
      content: (
        <div className="flex flex-wrap gap-2">
          {tiposInsumo.map((insumo) => (
            <button key={insumo} onClick={() => toggleSelection(insumo, insumos, setInsumos)} className={`px-3 py-1 rounded-full text-sm border ${insumos.includes(insumo) ? "bg-[#F4A300] text-black" : "bg-gray-800 text-white"}`}>{insumo}</button>
          ))}
        </div>
      )
    },
    {
      label: "Escolha as frutas",
      content: (
        <div className="flex flex-wrap gap-2">
          {tiposFrutas.map((fruta) => (
            <button key={fruta} onClick={() => toggleSelection(fruta, frutas, setFrutas)} className={`px-3 py-1 rounded-full text-sm border ${frutas.includes(fruta) ? "bg-[#F4A300] text-black" : "bg-gray-800 text-white"}`}>{fruta}</button>
          ))}
        </div>
      )
    },
    {
      label: "Escolha os energéticos",
      content: (
        <div className="flex flex-wrap gap-2">
          {tiposEnergetico.map((e) => (
            <button key={e} onClick={() => toggleSelection(e, energeticos, setEnergeticos)} className={`px-3 py-1 rounded-full text-sm border ${energeticos.includes(e) ? "bg-[#F4A300] text-black" : "bg-gray-800 text-white"}`}>{e}</button>
          ))}
        </div>
      )
    },
    {
      label: "Escolha a data do evento",
      content: (
        <DatePicker selected={dataEvento} onChange={(date) => setDataEvento(date)} dateFormat="dd/MM/yyyy" className="w-full p-2 bg-gray-900 border rounded-lg text-white" placeholderText="Selecione a data do evento" />
      )
    },
    {
      label: "Informe o endereço",
      content: (
        <div className="space-y-2">
          <input type="text" className="w-full p-2 bg-gray-900 border rounded-lg text-white" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={buscarEndereco} />
          <input type="text" className="w-full p-2 bg-gray-800 border rounded-lg text-white" placeholder="Cidade" value={cidade} readOnly />
          <input type="text" className="w-full p-2 bg-gray-800 border rounded-lg text-white" placeholder="Estado" value={estado} readOnly />
          <input type="text" className="w-full p-2 bg-gray-900 border rounded-lg text-white" placeholder="Bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          <input type="text" className="w-full p-2 bg-gray-900 border rounded-lg text-white" placeholder="Número" value={numero} onChange={(e) => setNumero(e.target.value)} />
          <input type="text" className="w-full p-2 bg-gray-900 border rounded-lg text-white" placeholder="Complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
        </div>
      )
    }
  ];

  return (
    <div className="max-w-xl mx-auto bg-black p-6 rounded-2xl shadow-md border border-gray-800 text-white">
      <h2 className="text-2xl font-semibold text-[#F4A300] mb-4">Monte seu Pacote</h2>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <label className="block text-lg">{steps[step].label}</label>
          {steps[step].content}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-6">
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="text-sm text-gray-400 hover:underline">
            Voltar
          </button>
        )}
        {step < steps.length - 1 ? (
          <button onClick={() => setStep(step + 1)} className="bg-[#F4A300] text-black px-4 py-2 rounded">
            Próximo
          </button>
        ) : (
          <button onClick={salvarPacote} className="bg-[#F4A300] text-black px-4 py-2 rounded">
            Finalizar Pedido
          </button>
        )}
      </div>

      {msg && <p className="text-center text-sm mt-4 text-green-400">{msg}</p>}
    </div>
  );
}

export default CustomPackage;
