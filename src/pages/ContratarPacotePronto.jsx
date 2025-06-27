import React, { useState, useEffect, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth } from "../firebase";
import DatePicker from "react-datepicker";
import jsPDF from "jspdf";
import "react-datepicker/dist/react-datepicker.css";


const InputComTestId = forwardRef(({ value, onClick, onChange }, ref) => (
  <input
    onClick={onClick}
    onChange={onChange}
    ref={ref}
    value={value}
    placeholder="Selecione a data"
    className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm"
  />
));
function ContratarPacotePronto() {
  const { id } = useParams();
  const [usuario] = useAuthState(auth);

  const [todosPacotes, setTodosPacotes] = useState([]);
  const [pacoteSelecionado, setPacoteSelecionado] = useState(null);
  const [opcionais, setOpcionais] = useState([]);


  useEffect(() => {
    const buscarPacotes = async () => {
      try {
        const snapshot = await getDocs(collection(db, "pacotes_prontos"));
        const pacotes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTodosPacotes(pacotes);
        const encontrado = pacotes.find(p => p.id === id);
        setPacoteSelecionado(encontrado);
      } catch (error) {
        console.error("Erro ao buscar pacotes:", error);
      }
    };
    buscarPacotes();
  }, [id]);
  useEffect(() => {
  const buscarOpcionais = async () => {
    try {
      const snapshot = await getDocs(collection(db, "opcionais_extras"));
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOpcionais(lista);
    } catch (err) {
      console.error("Erro ao carregar opcionais:", err);
    }
  };
  buscarOpcionais();
}, []);


  const [dataEvento, setDataEvento] = useState(null);
  const [pessoas, setPessoas] = useState(1);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");
  const [localFesta, setLocalFesta] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [opcionaisSelecionados, setOpcionaisSelecionados] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const calcularValorTotal = () => {
    if (!pacoteSelecionado || pessoas <= 0) return 0;
    const valorBase = pacoteSelecionado.precoBase || 0;
    const adicional = pessoas > 50 ? (pessoas - 50) * 25 : 0;
    const extras = opcionais
      .filter((op) => opcionaisSelecionados.includes(op.id))
      .reduce((total, op) => {
        if (op.id === "seguro_quebra") return total + op.valor * pessoas;
        return total + op.valor;
      }, 0);
    return valorBase + adicional + extras;
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(245, 164, 9); // laranja personalizado
    doc.rect(0, 0, 210, 25, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ORÇAMENTO ELO DRINKS", 10, 16);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Tipo de Evento: ${tipoEvento}`, 10, 35);
    doc.text(`Data do Evento: ${dataEvento?.toLocaleDateString()}`, 10, 42);
    doc.text(`Horário: ${horaInicio} às ${horaFim}`, 10, 49);
    doc.text(`Local: ${localFesta}`, 10, 56);
    doc.text(`Endereço: ${bairro}, ${numero} - ${cidade}/${estado}`, 10, 63);
    doc.text(`Convidados: ${pessoas}`, 10, 70);

    doc.setFontSize(13);
    doc.setTextColor(244, 163, 0);
    doc.text("Bebidas Incluídas:", 10, 82);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    pacoteSelecionado.bebidas?.forEach((b, i) => {
      doc.text(`- ${b}`, 12, 90 + i * 7);
    });

    let y = 90 + (pacoteSelecionado.bebidas?.length || 0) * 7 + 10;
    doc.setFontSize(13);
    doc.setTextColor(244, 163, 0);
    doc.text("Itens Opcionais:", 10, y);
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    opcionaisSelecionados.forEach((id) => {
      const op = opcionais.find((o) => o.id === id);
      if (op) {
        doc.text(`- ${op.nome} (R$ ${op.id === "seguro_quebra" ? `${op.valor} x ${pessoas}` : op.valor})`, 12, y);
        y += 7;
      }
    });

    y += 10;
    doc.setFontSize(14);
    doc.setTextColor(244, 163, 0);
    doc.text(`Valor total estimado: R$ ${calcularValorTotal()}`, 10, y);
    doc.save("orcamento-elo-drinks.pdf");
  };
  const contratar = async () => {
    if (!pessoas || !dataEvento || !cep || !cidade || !estado || !bairro || !numero || !tipoEvento || !horaInicio || !horaFim || !localFesta) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await addDoc(collection(db, "pacotes"), {
        uid: usuario?.uid || null,
        email: usuario?.email || "visitante",
        nome: pacoteSelecionado.nome,
        bebidas: pacoteSelecionado.bebidas,
        preco: calcularValorTotal(),
        pessoas,
        dataEvento,
        horaInicio,
        horaFim,
        tipoEvento,
        localFesta,
        endereco: `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`,
        observacoes,
        opcionaisSelecionados,
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

  if (!pacoteSelecionado) {
    return <p className="text-center text-gray-500 mt-10">Carregando pacote...</p>;
  }

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
      {!mensagem && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número de pessoas</label>
            <input
              type="number"
              min="1"
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
              customInput={<InputComTestId />}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo de Evento</label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded"
              placeholder="Ex: Casamento, Aniversário"
              value={tipoEvento}
              onChange={(e) => setTipoEvento(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hora de Início</label>
              <input
                type="time"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Hora de Término</label>
              <input
                type="time"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                value={horaFim}
                onChange={(e) => setHoraFim(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Local da Festa</label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded"
              value={localFesta}
              onChange={(e) => setLocalFesta(e.target.value)}
            />
          </div>
          <button
            onClick={() => {
              if (!navigator.geolocation) {
                alert("Geolocalização não é suportada.");
                return;
              }
              navigator.geolocation.getCurrentPosition(async ({ coords }) => {
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
                } catch {
                  alert("Erro ao obter localização.");
                }
              });
            }}
            className="w-full bg-gray-200 text-sm text-black py-2 rounded hover:bg-gray-300 transition"
          >
            📍 Usar minha localização atual
          </button>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">CEP</label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={async () => {
                if (cep.length < 8) return;
                try {
                  const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                  const data = await res.json();
                  if (!data.erro) {
                    setCidade(data.localidade);
                    setEstado(data.uf);
                    setBairro(data.bairro);
                  }
                } catch {
                  alert("Erro ao buscar o CEP.");
                }
              }}
              className="w-full p-3 bg-white border border-gray-300 rounded"
              placeholder="CEP"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Cidade</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
              value={cidade}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
            <input
              type="text"
              className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
              value={estado}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Bairro</label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Número</label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Complemento</label>
            <input
              type="text"
              className="w-full p-3 bg-white border border-gray-300 rounded"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Observações (opcional)</label>
            <textarea
              rows={3}
              className="w-full p-3 bg-white border border-gray-300 rounded"
              placeholder="Ex: drinks sem álcool, decoração temática etc."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Itens Opcionais</label>
            <div className="space-y-2">
              {opcionais.map((item) => (
                <label key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={opcionaisSelecionados.includes(item.id)}
                    onChange={() =>
                      setOpcionaisSelecionados((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((op) => op !== item.id)
                          : [...prev, item.id]
                      )
                    }
                  />
                  <span>{item.nome} — R$ {item.id === "seguro_quebra" ? `${item.valor} x ${pessoas}` : item.valor}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={contratar}
            disabled={
              !pessoas || !dataEvento || !cep || !cidade || !estado ||
              !bairro || !numero || !tipoEvento || !horaInicio || !horaFim || !localFesta
            }
            className={`w-full py-3 rounded font-semibold transition ${
              !pessoas || !dataEvento || !cep || !cidade || !estado ||
              !bairro || !numero || !tipoEvento || !horaInicio || !horaFim || !localFesta
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#F4A300] hover:bg-yellow-500 text-black"
            }`}
          >
            Confirmar Contratação
          </button>
        </div>
      )}

      {mensagem && (
        <div className="mt-6">
          <button
            onClick={gerarPDF}
            className="w-full bg-white border border-[#F4A300] text-[#F4A300] py-2 rounded hover:bg-[#F4A300] hover:text-black transition"
          >
            📄 Baixar orçamento em PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default ContratarPacotePronto;
