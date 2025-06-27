import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

function AdminAdicionarOpcional() {
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [opcionais, setOpcionais] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const carregarOpcionais = async () => {
    const snap = await getDocs(collection(db, "opcionais_extras"));
    setOpcionais(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    carregarOpcionais();
  }, []);

  const salvarOpcional = async () => {
    if (!nome || !valor) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      if (editandoId) {
        await updateDoc(doc(db, "opcionais_extras", editandoId), {
          nome,
          valor: Number(valor)
        });
        setMensagem("Opcional atualizado!");
      } else {
        await addDoc(collection(db, "opcionais_extras"), {
          nome,
          valor: Number(valor),
          criadoEm: new Date()
        });
        setMensagem("Opcional salvo com sucesso!");
      }
      setNome("");
      setValor("");
      setEditandoId(null);
      carregarOpcionais();
    } catch (err) {
      console.error("Erro:", err);
      setMensagem("Erro ao salvar.");
    }
  };

  const editar = (op) => {
    setEditandoId(op.id);
    setNome(op.nome);
    setValor(op.valor);
  };

  const excluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      await deleteDoc(doc(db, "opcionais_extras", id));
      carregarOpcionais();
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white text-black p-6 rounded shadow space-y-4">
      <h2 className="text-xl font-bold text-[#F4A300]">Gerenciar Itens Opcionais</h2>

      <input
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded"
        placeholder="Valor (R$)"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />

      <button
        onClick={salvarOpcional}
        className="w-full bg-[#F4A300] py-2 rounded text-black font-semibold"
      >
        {editandoId ? "Atualizar" : "Salvar"}
      </button>

      {mensagem && <p className="text-green-700 text-sm text-center">{mensagem}</p>}

      <div className="pt-4">
        <h3 className="font-semibold mb-2">Itens Cadastrados:</h3>
        {opcionais.map((op) => (
          <div
            key={op.id}
            className="border p-3 rounded flex justify-between items-center mb-2"
          >
            <div>
              <p className="font-medium">{op.nome}</p>
              <p className="text-sm text-gray-600">R$ {op.valor}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => editar(op)}
                className="text-blue-600 hover:underline text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => excluir(op.id)}
                className="text-red-600 hover:underline text-sm"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminAdicionarOpcional;
