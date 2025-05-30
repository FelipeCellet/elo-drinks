import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const snapshot = await getDocs(collection(db, "pacotes"));
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPedidos(dados);
    };
    fetchPedidos();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-[#F4A300] mb-6">Todos os Pedidos</h2>
      {pedidos.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map(p => (
            <div key={p.id} className="border border-gray-300 rounded-lg p-4 bg-white">
              <p><strong>Cliente:</strong> {p.email || "Desconhecido"}</p>
              <p><strong>Pacote:</strong> {p.nome || (p.pacotePronto ? "Pronto" : "Personalizado")}</p>
              <p><strong>Status:</strong> {p.status}</p>
              <p><strong>Status Pagamento:</strong> {p.statusPagamento}</p>
              <p><strong>Data do Evento:</strong> {p.dataEvento?.toDate?.().toLocaleDateString() || "-"}</p>
              <p><strong>Pessoas:</strong> {p.pessoas}</p>
              <p><strong>Barmen:</strong> {p.barmen || "-"}</p>
              <p><strong>Bebidas:</strong> {p.bebidas?.join(", ") || "-"}</p>
              <p><strong>Insumos:</strong> {p.insumos?.join(", ") || "-"}</p>
              <p><strong>Endereço:</strong> {p.endereco}</p>
              <p><strong>Preço:</strong> R$ {p.preco}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPedidos;
