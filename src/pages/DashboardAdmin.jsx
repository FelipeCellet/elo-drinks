import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function DashboardAdmin() {
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    const buscarPacotes = async () => {
      const snap = await getDocs(collection(db, "pacotes"));
      const lista = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPacotes(lista);
    };

    buscarPacotes();
  }, []);

  const total = pacotes.length;
  const emAnalise = pacotes.filter((p) => p.status === "em análise").length;
  const aprovados = pacotes.filter((p) => p.status === "confirmado");
  const rejeitados = pacotes.filter((p) => p.status === "rejeitado").length;
  const receitaTotal = aprovados.reduce((soma, p) => soma + (p.preco || 0), 0);

  const dadosStatus = [
    { name: "Em Análise", value: emAnalise },
    { name: "Aprovado", value: aprovados.length },
    { name: "Rejeitado", value: rejeitados },
  ];

  const cores = ["#F4A300", "#22c55e", "#ef4444"];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-10 text-black">
      <h2 className="text-3xl font-bold text-[#F4A300] text-center">Dashboard Admin</h2>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ResumoCard titulo="Total de Pacotes" valor={total} cor="text-black" />
        <ResumoCard titulo="Em Análise" valor={emAnalise} cor="text-yellow-500" />
        <ResumoCard titulo="Aprovados" valor={aprovados.length} cor="text-green-600" />
        <ResumoCard titulo="Rejeitados" valor={rejeitados} cor="text-red-600" />
      </div>

      {/* Receita total */}
      <div className="bg-white rounded shadow p-6 text-center">
        <p className="text-gray-500 text-sm">Receita Estimada dos Aprovados</p>
        <p className="text-3xl font-bold text-green-700">R$ {receitaTotal}</p>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* Gráfico de barras */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Distribuição de Pacotes</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosStatus}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value">
                {dadosStatus.map((_, i) => (
                  <Cell key={i} fill={cores[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de pizza */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-4 text-center">Proporção por Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dadosStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {dadosStatus.map((_, i) => (
                  <Cell key={i} fill={cores[i]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ResumoCard({ titulo, valor, cor }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <p className="text-gray-500 text-sm">{titulo}</p>
      <p className={`text-2xl font-bold ${cor}`}>{valor}</p>
    </div>
  );
}

export default DashboardAdmin;
