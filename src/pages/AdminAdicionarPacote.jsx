import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

function AdminAdicionarPacote() {
  const [nome, setNome] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  const [bebidasTexto, setBebidasTexto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [pacotes, setPacotes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    const buscarPacotes = async () => {
      const snapshot = await getDocs(collection(db, "pacotes_prontos"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacotes(lista);
    };
    buscarPacotes();
  }, [mensagem]);

  const salvarPacote = async () => {
    if (!nome || !precoBase || !bebidasTexto) {
      alert("Preencha todos os campos.");
      return;
    }

    const bebidas = bebidasTexto.split(",").map((b) => b.trim());

    try {
      if (editandoId) {
        await updateDoc(doc(db, "pacotes_prontos", editandoId), {
          nome,
          precoBase: Number(precoBase),
          bebidas,
        });
        setMensagem("Pacote atualizado com sucesso!");
      } else {
        await addDoc(collection(db, "pacotes_prontos"), {
          nome,
          precoBase: Number(precoBase),
          bebidas,
          criadoEm: new Date(),
        });
        setMensagem("Pacote salvo com sucesso!");
      }

      setNome("");
      setPrecoBase("");
      setBebidasTexto("");
      setEditandoId(null);
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      setMensagem("Erro ao salvar. Veja o console.");
    }
  };

  const excluirPacote = async (id) => {
    if (window.confirm("Deseja realmente excluir este pacote?")) {
      await deleteDoc(doc(db, "pacotes_prontos", id));
      setMensagem("Pacote excluído.");
    }
  };

  const editarPacote = (pacote) => {
    setEditandoId(pacote.id);
    setNome(pacote.nome);
    setPrecoBase(pacote.precoBase);
    setBebidasTexto(pacote.bebidas.join(", "));
  };

  return (
    <div className="max-w-xl mx-auto bg-white text-black p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#F4A300]">
        {editandoId ? "Editar Pacote" : "Adicionar Pacote Pronto"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Nome do Pacote
          </label>
          <input
            type="text"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Preço Base (R$)
          </label>
          <input
            type="number"
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={precoBase}
            onChange={(e) => setPrecoBase(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Bebidas (separadas por vírgula)
          </label>
          <textarea
            className="w-full p-3 bg-white border border-gray-300 rounded"
            value={bebidasTexto}
            onChange={(e) => setBebidasTexto(e.target.value)}
          />
        </div>

        <button
          onClick={salvarPacote}
          className="w-full py-3 bg-[#F4A300] hover:bg-yellow-500 text-black font-semibold rounded"
        >
          {editandoId ? "Atualizar Pacote" : "Salvar Pacote"}
        </button>

        {mensagem && (
          <div className="mt-4 p-3 text-center rounded bg-green-100 text-green-800 border border-green-300">
            {mensagem}
          </div>
        )}
      </div>

      <h3 className="text-xl font-bold mt-8 text-gray-800">Pacotes Cadastrados</h3>
      <ul className="divide-y mt-3">
        {pacotes.map((pacote) => (
          <li
            key={pacote.id}
            className="py-3 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">
                {pacote.nome} — R$ {pacote.precoBase}
              </p>
              <p className="text-sm text-gray-600">
                Bebidas: {pacote.bebidas.join(", ")}
              </p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editarPacote(pacote)}
                className="text-sm text-blue-600 hover:underline"
              >
                Editar
              </button>
              <button
                onClick={() => excluirPacote(pacote.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminAdicionarPacote;
