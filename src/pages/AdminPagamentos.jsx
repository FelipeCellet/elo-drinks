import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

function AdminPagamentos() {
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const fetchPacotes = async () => {
      const snapshot = await getDocs(collection(db, "pacotes"));
      const dados = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // filtra pacotes que já foram aprovados
      const aprovados = dados.filter(p => p.status !== "em análise");
      setPacotes(aprovados);
    };
    fetchPacotes();
  }, []);

  const marcarComoPago = async (id) => {
    try {
      const ref = doc(db, "pacotes", id);
      await updateDoc(ref, {
        statusPagamento: "pago"
      });
      setPacotes(prev =>
        prev.map(p => p.id === id ? { ...p, statusPagamento: "pago" } : p)
      );
    } catch (error) {
      console.error("Erro ao marcar como pago:", error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-black">
      <h2 className="text-2xl font-bold text-[#F4A300] mb-6">Status de Pagamentos</h2>
      {pacotes.length === 0 ? (
        <p className="text-gray-500">Nenhum pedido aprovado ainda.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">E-mail do Cliente</th>
              <th className="border p-2 text-left">Valor</th>
              <th className="border p-2 text-left">Tipo</th>
              <th className="border p-2 text-left">Pagamento</th>
              <th className="border p-2 text-left">Ação</th>
            </tr>
          </thead>
          <tbody>
            {pacotes.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border p-2">{p.email || "Desconhecido"}</td>
                <td className="border p-2">R$ {p.preco}</td>
                <td className="border p-2">{p.pacotePronto ? "Pronto" : "Custom"}</td>
                <td className="border p-2">
                  <span className={p.statusPagamento === "pago" ? "text-green-600 font-medium" : "text-red-500"}>
                    {p.statusPagamento}
                  </span>
                </td>
                <td className="border p-2">
                  {p.statusPagamento !== "pago" && (
                    <button
                      onClick={() => marcarComoPago(p.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      Marcar como pago
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPagamentos;
