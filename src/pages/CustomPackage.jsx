import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

function EditablePackageWizard() {
  const [usuario] = useAuthState(auth);
  const [step, setStep] = useState(1);
  const [pessoas, setPessoas] = useState(0);
  const [barmen, setBarmen] = useState(1);
  const [bebidas, setBebidas] = useState([]);
  const [insumos, setInsumos] = useState([]);
  const [cep, setCep] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  const navigate = useNavigate();

  const tiposBebida = ["Vodka", "Gin", "Whisky", "Cerveja", "Espumante", "Drinks Autorais"];
  const tiposInsumos = ["Gelo", "Copos", "Guardanapos", "Canudos", "Limão", "Açúcar"];

  const toggleBebida = (item) => {
    setBebidas((prev) =>
      prev.includes(item) ? prev.filter((b) => b !== item) : [...prev, item]
    );
  };

  const toggleInsumo = (item) => {
    setInsumos((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const buscarEndereco = async () => {
    if (cep.length < 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setCidade(data.localidade);
        setEstado(data.uf);
        setBairro(data.bairro);
      }
    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
    }
  };

  const proximo = () => setStep((prev) => prev + 1);
  const voltar = () => setStep((prev) => prev - 1);

  const calcularBarmenRecomendado = (p) => {
    if (p <= 50) return 1;
    if (p <= 100) return 2;
    return Math.ceil(p / 50);
  };

  const finalizar = async () => {
    const endereco = `${bairro}, ${numero} - ${cidade}/${estado}${complemento ? " - " + complemento : ""}`;

    try {
      await addDoc(collection(db, "pacotes"), {
        uid: usuario?.uid || null,
        pessoas,
        barmen,
        bebidas,
        insumos,
        endereco,
        dataEvento: new Date(),
        preco: 500 + barmen * 600 + bebidas.length * 100 + insumos.length * 30,
        status: "em análise",
        criadoEm: new Date(),
      });

      setPedidoEnviado(true);
    } catch (error) {
      console.error("Erro ao salvar pacote:", error);
      alert("Erro ao finalizar pacote");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white text-black">
      {pedidoEnviado && (
        <div className="bg-green-100 border border-green-400 text-green-800 rounded p-4 mb-6 text-center">
          <h2 className="text-xl font-bold mb-2">Pedido enviado com sucesso!</h2>
          <p>Aguardando confirmação para realizar o pagamento.</p>
        </div>
      )}

      {!pedidoEnviado && (
        <>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F4A300] text-center">Etapa 1: Número de Pessoas</h2>

              <input
                type="number"
                className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm"
                min={1}
                value={pessoas}
                onChange={(e) => {
                  const valor = Number(e.target.value);
                  setPessoas(valor);
                  if (valor > 0) {
                    setBarmen(calcularBarmenRecomendado(valor));
                  }
                }}
              />

              {pessoas > 0 && (
                <>
                  <label className="block">
                    Recomendamos {calcularBarmenRecomendado(pessoas)} barmen. Quantos deseja contratar?
                  </label>
                  <input
                    type="number"
                    min={1}
                    className="w-full p-3 bg-white border border-gray-300 rounded shadow-sm"
                    value={barmen}
                    onChange={(e) => setBarmen(Number(e.target.value))}
                  />
                </>
              )}

              <div className="flex justify-end mt-6">
                <button
                  onClick={proximo}
                  className="bg-[#F4A300] text-black px-6 py-2 rounded hover:bg-yellow-500 transition font-semibold"
                  disabled={pessoas <= 0}
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F4A300] text-center">Etapa 2: Bebidas</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {tiposBebida.map((bebida) => (
                  <button
                    key={bebida}
                    onClick={() => toggleBebida(bebida)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      bebidas.includes(bebida)
                        ? "bg-[#F4A300] text-black font-semibold"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {bebida}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={voltar}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Voltar
                </button>
                <button
                  onClick={proximo}
                  className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F4A300] text-center">Etapa 3: Insumos</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {tiposInsumos.map((insumo) => (
                  <button
                    key={insumo}
                    onClick={() => toggleInsumo(insumo)}
                    className={`px-4 py-2 rounded-full text-sm border transition ${
                      insumos.includes(insumo)
                        ? "bg-[#F4A300] text-black font-semibold"
                        : "bg-gray-100 text-black"
                    }`}
                  >
                    {insumo}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  onClick={voltar}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Voltar
                </button>
                <button
                  onClick={proximo}
                  className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Próximo
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#F4A300] text-center">Etapa 4: Local do Evento</h2>

              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                placeholder="CEP"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                onBlur={buscarEndereco}
              />
              <input
                type="text"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                placeholder="Cidade"
                value={cidade}
                readOnly
              />
              <input
                type="text"
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded"
                placeholder="Estado"
                value={estado}
                readOnly
              />
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                placeholder="Bairro"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                placeholder="Número"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
              />
              <input
                type="text"
                className="w-full p-3 bg-white border border-gray-300 rounded"
                placeholder="Complemento"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
              />

              <div className="flex justify-between mt-6">
                <button
                  onClick={voltar}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  Voltar
                </button>
                <button
                  onClick={finalizar}
                  className="bg-[#F4A300] text-black px-4 py-2 rounded hover:bg-yellow-500"
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EditablePackageWizard;
