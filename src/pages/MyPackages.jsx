import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

function MeusPacotes() {
  const [pacotes, setPacotes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const pacotesRef = collection(db, "pacotes");
        const q = query(pacotesRef, where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        const dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPacotes(dados);
        setCarregando(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (carregando) return <p className="text-white text-center mt-10">Carregando pacotes...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold text-[#F4A300] mb-6 text-center">Meus Pacotes</h2>
      {pacotes.length === 0 ? (
        <p className="text-center">Você ainda não contratou nenhum pacote.</p>
      ) : (
        <div className="space-y-4">
          {pacotes.map(p => (
            <div key={p.id} className="border border-gray-700 bg-black rounded-xl p-4">
              <p><strong>Evento para:</strong> {p.pessoas} pessoas</p>
              <p><strong>Barmen:</strong> {p.barmen}</p>
              <p><strong>Bebidas:</strong> {p.bebidas?.join(", ") || "-"}</p>
              <p><strong>Insumos:</strong> {p.insumos?.join(", ") || "-"}</p>
              <p><strong>Local:</strong> {p.endereco || "-"}</p>
              <p><strong>Preço:</strong> <span className="text-[#F4A300] font-bold">R$ {p.preco?.toFixed(2).replace(".", ",")}</span></p>
              <p className="text-sm text-gray-400">Reservado em: {new Date(p.criadoEm?.seconds * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MeusPacotes;
