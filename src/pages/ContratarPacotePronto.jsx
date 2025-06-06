import React from 'react';
import { useState } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const pacotes = [
  {
    id: "1",
    nome: "Pacote Festa Clássica",
    bebidas: ["Caipirinha", "Gin Tônica", "Cuba Libre"],
    precoBase: 1200,
  },
  {
    id: "2",
    nome: "Pacote Premium",
    bebidas: ["Espumante", "Drinks Autorais", "Whisky"],
    precoBase: 2200,
  },
];

function ContratarPacotePronto() {
  const { id } = useParams();
  const [usuario] = useAuthState(auth);
  const pacoteSelecionado = pacotes.find((p) => p.id === id);

  const [dataEvento, setDataEvento] = useState(null);
  const [pessoas, setPessoas] = useState("");
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [mensagem, setMensagem] = useState("");

  const buscarEndereco = async () => {
    if (cep.length < 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCidade(data.localidade);
        setEstado(data.uf);
        setBairro(data.bairro);
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    }
  };

  const usarLocalizacaoAtual = async () => {
    if (!navigator.geolocation) {
      alert("Geolocalização não é suportada pelo navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          const addr = data.address;
          setCidade(addr.city || addr.town || addr.village || "");
          setEstado(addr.state || "");
          setBairro(addr.suburb || addr.neighbourhood || "");
          setCep(addr.postcode || "");
        } catch (err) {
          alert("Erro ao obter localização.");
        }
      },
      () => alert("Permissão negada ou erro ao acessar localização.")
    );
  };

  const calcularValorTotal = () => {
    if (!pacoteSelecionado || pessoas <= 0) return 0;
    const valorBase = pacoteSelecionado.precoBase;
    const adicional = pessoas > 50 ? (pessoas - 50) * 25 : 0;
    return valorBase + adicional;
  };

  const contratar = async () => {
    if (
      !pessoas ||
      !dataEvento ||
      !cep ||
      !cidade ||
      !estado ||
      !bairro ||
      !numero
    ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const endereco = `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`;
    const precoFinal = calcularValorTotal();

    try {
      await addDoc(collection(db, "pacotes"), {
        uid: usuario?.uid || null,
        email: usuario?.email || "visitante",
        nome: pacoteSelecionado.nome,
        bebidas: pacoteSelecionado.bebidas,
        preco: precoFinal,
        pessoas,
        dataEvento,
        endereco,
        criadoEm: new Date(),
        status: "em análise",
        statusPagamento: "pendente",
        pacotePronto: true,
      });

      setMensagem("Pedido enviado com sucesso! Aguarde a confirmação do administrador para realizar o pagamento.");
    } catch (error) {
      console.error("Erro ao contratar pacote:", error);
    }
  };

  if (!pacoteSelecionado) return <p className="text-center text-gray-500 mt-10">Pacote não encontrado.</p>;

  return (
    <div className="max-w-xl mx-auto bg-white text-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-[#F4A300] mb-4">{pacoteSelecionado.nome}</h2>
      <p><strong>Bebidas:</strong> {pacoteSelecionado.bebidas.join(", ")}</p>

      {pessoas > 0 && (
        <div className="my-4 p-4 bg-gray-100 rounded text-sm space-y-1">
          <p><strong>Resumo:</strong></p>
          <p>👥 {pessoas} pessoa(s)</p>
          <p>💰 Valor estimado: <strong>R$ {calcularValorTotal()}</strong></p>
        </div>
      )}

      {mensagem ? (
        <div className="bg-green-100 border border-green-400 text-green-800 p-4 rounded text-center font-medium">
          {mensagem}
        </div>
      ) : (
        <div className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número de pessoas</label>
            <input
              type="number"
              min="1"
              placeholder="Ex: 50"
              className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm"
              value={pessoas}
              onChange={(e) => setPessoas(Math.max(1, parseInt(e.target.value) || 0))}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Data do evento</label>
            <DatePicker
              selected={dataEvento}
              onChange={(date) => setDataEvento(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecione a data"
              className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm"
            />
          </div>

          <button
            onClick={usarLocalizacaoAtual}
            className="w-full bg-gray-200 text-sm text-black py-2 rounded hover:bg-gray-300 transition"
          >
            📍 Usar minha localização atual
          </button>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">CEP</label>
            <input type="text" placeholder="CEP" className="w-full p-3 bg-white border border-gray-300 rounded" value={cep} onChange={(e) => setCep(e.target.value)} onBlur={buscarEndereco} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
            <input type="text" className="w-full p-3 bg-gray-100 border border-gray-300 rounded" value={cidade} readOnly />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
            <input type="text" className="w-full p-3 bg-gray-100 border border-gray-300 rounded" value={estado} readOnly />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bairro</label>
            <input type="text" className="w-full p-3 bg-white border border-gray-300 rounded" value={bairro} onChange={(e) => setBairro(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
            <input type="text" className="w-full p-3 bg-white border border-gray-300 rounded" value={numero} onChange={(e) => setNumero(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Complemento</label>
            <input type="text" className="w-full p-3 bg-white border border-gray-300 rounded" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
          </div>

          <button
            onClick={contratar}
            disabled={
              !pessoas || !dataEvento || !cep || !cidade || !estado || !bairro || !numero
            }
            className={`w-full py-3 rounded font-semibold transition ${
              !pessoas || !dataEvento || !cep || !cidade || !estado || !bairro || !numero
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F4A300] hover:bg-yellow-500 text-black"
            }`}
          >
            Confirmar Contratação
          </button>
        </div>
      )}
    </div>
  );
}

export default ContratarPacotePronto;
