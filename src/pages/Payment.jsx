import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { QRCodeCanvas } from "qrcode.react";

function Payment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pacote, setPacote] = useState(null);
  const [metodo, setMetodo] = useState("");
  const [cartao, setCartao] = useState({ nome: "", numero: "", validade: "", cvv: "" });

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

  if (!pacote) {
    return <p className="text-center text-gray-500 mt-10">Carregando pacote...</p>;
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
        </div>

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

        {metodo === "pix" && (
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

        {metodo === "cartao" && (
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

        {!metodo && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Escolha um método de pagamento para continuar.
          </p>
        )}
      </div>
    </div>
  );
}

export default Payment;
