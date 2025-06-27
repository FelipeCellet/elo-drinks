import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pacote, setPacote] = useState(null);
  const [metodo, setMetodo] = useState("");
  const [cartao, setCartao] = useState({ nome: "", numero: "", validade: "", cvv: "" });
  const [usuario, loading] = useAuthState(auth);

  useEffect(() => {
    if (!loading && !usuario) {
      navigate("/login");
    }
  }, [usuario, loading, navigate]);

  useEffect(() => {
    const buscarPacote = async () => {
      const ref = doc(db, "pacotes", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPacote({ id: snap.id, ...snap.data() });
      }
    };
    buscarPacote();
  }, [id]);

  const finalizar = async () => {
    try {
      await updateDoc(doc(db, "pacotes", id), { status: "pago", statusPagamento: "pago" });
      navigate(`/confirmacao/${id}`);
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao confirmar pagamento.");
    }
  };

const gerarPDF = () => {
  const doc = new jsPDF();

  // Faixa laranja no topo
  doc.setFillColor(245, 164, 0); // #F4A300
  doc.rect(0, 0, 210, 25, "F");

  // Título em branco centralizado
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("RESUMO DO PEDIDO - ELO DRINKS", 105, 16, { align: "center" });

  // Dados do pacote
  let y = 35;
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);

  const linha = (label, valor) => {
    doc.text(`${label}:`, 10, y);
    doc.text(String(valor), 60, y);
    y += 7;
  };

  linha("Cliente", usuario?.email || "Não logado");
  linha("Status", pacote.status);
  linha("Qtd. Pessoas", pacote.pessoas);
  linha("Endereço", pacote.endereco || "-");

  if (pacote.dataEvento?.toDate) {
    linha("Data do Evento", pacote.dataEvento.toDate().toLocaleDateString());
  }

  // Bebidas
  if (pacote.bebidas?.length) {
    doc.setTextColor(244, 163, 0); // laranja
    doc.text("Bebidas:", 10, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
    pacote.bebidas.forEach((b) => {
      doc.text(`- ${b}`, 12, y);
      y += 6;
    });
  }

  // Insumos
  if (pacote.insumos?.length) {
    y += 4;
    doc.setTextColor(244, 163, 0);
    doc.text("Insumos:", 10, y);
    y += 6;
    doc.setTextColor(0, 0, 0);
    pacote.insumos.forEach((i) => {
      doc.text(`- ${i}`, 12, y);
      y += 6;
    });
  }

  // Valor total
  y += 10;
  doc.setFontSize(14);
  doc.setTextColor(244, 163, 0);
  doc.text(`Valor Total: R$ ${pacote.preco?.toFixed(2).replace(".", ",")}`, 10, y);

  // Salvar
  doc.save(`pedido_${pacote.nome || "personalizado"}.pdf`);
};


  if (loading || !usuario || !pacote) {
    return <p className="text-center text-gray-500 mt-10">Carregando...</p>;
  }

  const enderecoFormatado = pacote.endereco || "-";
  const precoTotal = pacote.preco?.toFixed(2).replace(".", ",");
  const payloadPix = `Pagamento Elo Drinks - Pedido ${id} - R$ ${pacote.preco}`;

  return (
    <div className="min-h-screen bg-white text-black p-6">
      <div className="max-w-xl mx-auto">
        <h2 className="text-3xl font-bold text-[#F4A300] mb-6 text-center">Resumo do Pacote</h2>

        <div className="bg-white border border-[#F4A300] p-4 rounded-xl space-y-2">
          <p><strong>Quantidade de Pessoas:</strong> {pacote.pessoas}</p>
          <p><strong>Barmen:</strong> {pacote.barmen}</p>
          <p><strong>Bebidas:</strong> {pacote.bebidas?.join(", ") || "-"}</p>
          <p><strong>Insumos:</strong> {pacote.insumos?.join(", ") || "-"}</p>
          <p><strong>Local:</strong> {enderecoFormatado}</p>
          <p><strong className="text-lg">Preço Total:</strong> <span className="text-[#F4A300] font-bold">R$ {precoTotal}</span></p>
          <p><strong>Status:</strong> {pacote.status}</p>
        </div>

        <button
          onClick={gerarPDF}
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-black py-2 rounded transition text-sm font-medium"
        >
          Baixar PDF do Resumo
        </button>

        {/* Opções de pagamento somente se o pacote foi confirmado */}
        {pacote.status === "confirmado" ? (
          <>
            <h3 className="mt-10 mb-2 text-xl font-semibold text-[#F4A300]">Escolha a forma de pagamento</h3>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setMetodo("pix")}
                className={`flex-1 py-2 rounded ${metodo === "pix" ? "bg-[#F4A300] text-black" : "bg-gray-200 text-black"}`}
              >
                Pix
              </button>
              <button
                onClick={() => setMetodo("cartao")}
                className={`flex-1 py-2 rounded ${metodo === "cartao" ? "bg-[#F4A300] text-black" : "bg-gray-200 text-black"}`}
              >
                Cartão de Crédito
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            {pacote.status === "pago"
              ? "Pagamento já realizado. Obrigado!"
              : "Aguardando aprovação para liberar o pagamento."}
          </p>
        )}

        {metodo === "pix" && pacote.status === "confirmado" && (
          <div className="bg-white border border-[#F4A300] p-4 rounded-lg flex flex-col items-center text-center">
            <p className="mb-4">Escaneie o QR Code para pagar via Pix:</p>
            <QRCodeCanvas
              value={payloadPix}
              size={180}
              bgColor="#ffffff"
              fgColor="#000000"
              level="H"
            />
            <button
              onClick={finalizar}
              className="w-full max-w-xs mt-4 bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
            >
              Confirmar Pagamento
            </button>
          </div>
        )}

        {metodo === "cartao" && pacote.status === "confirmado" && (
          <div className="bg-white border border-[#F4A300] p-4 rounded-lg space-y-3">
            <input
              type="text"
              placeholder="Nome no Cartão"
              value={cartao.nome}
              onChange={(e) => setCartao({ ...cartao, nome: e.target.value })}
              className="w-full p-2 bg-white border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Número do Cartão"
              value={cartao.numero}
              onChange={(e) => setCartao({ ...cartao, numero: e.target.value })}
              className="w-full p-2 bg-white border border-gray-300 rounded"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Validade (MM/AA)"
                value={cartao.validade}
                onChange={(e) => setCartao({ ...cartao, validade: e.target.value })}
                className="w-1/2 p-2 bg-white border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="CVV"
                value={cartao.cvv}
                onChange={(e) => setCartao({ ...cartao, cvv: e.target.value })}
                className="w-1/2 p-2 bg-white border border-gray-300 rounded"
              />
            </div>
            <button
              onClick={finalizar}
              className="w-full bg-[#F4A300] text-black py-2 rounded hover:bg-yellow-500 transition"
            >
              Finalizar Pagamento
            </button>
          </div>
        )}

        {!metodo && pacote.status === "confirmado" && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Escolha um método de pagamento para continuar.
          </p>
        )}
      </div>
    </div>
  );
}

export default Payment;
