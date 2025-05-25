import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-elo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="flex flex-col items-center justify-center text-center px-4 pt-10 space-y-10">
        <img src={logo} alt="Elo Drinks Logo" className="w-40" />

        <h1 className="text-3xl font-bold text-[#F4A300]">Bem-vindo à Elo Drinks Eventos!</h1>
        <p className="text-gray-700 max-w-xl">
          Monte seu pacote personalizado ou escolha um pronto para seu evento.
        </p>

        <div className="flex flex-col sm:flex-row gap-6">
          <button
            onClick={() => navigate("/packages")}
            className="bg-[#F4A300] text-black px-6 py-3 rounded-lg text-lg font-medium hover:bg-yellow-500 transition"
          >
            Ver Pacotes Prontos
          </button>
          <button
            onClick={() => navigate("/custom")}
            className="bg-black text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-gray-900 transition"
          >
            Montar Meu Pacote
          </button>
        </div>
      </div>

      {/* Seção institucional */}
      <section className="w-full mt-16 px-4 py-16">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-[#F4A300]">Sobre Nós</h2>
            <p className="text-gray-700">
              Com 16 anos de experiência, atuamos em mais de 6.000 eventos dos mais diferentes gêneros e concluímos que cada evento é único, com particularidades e a necessidade de diferenciação.
              Alcançamos o perfil que cada celebração exige com a <span className="font-semibold">CUSTOMIZAÇÃO</span> dos nossos serviços e drinks — da coquetelaria clássica à contemporânea, tornando seu evento memorável!
            </p>
            <p className="text-gray-700">
              Com uma carta de drinks atualizada com as novidades da coquetelaria moderna, estamos sempre inovando e aprimorando nossos serviços com qualidade e total satisfação!
            </p>
            <p className="text-gray-700">
              Nossos barmen e bargirls são treinados para cada etapa do processo com excelência — da seleção à criação dos coquetéis e suporte 24h.
            </p>
            <p className="text-[#F4A300] font-medium">
              RESPONSABILIDADE, EXPERIÊNCIA, VERSATILIDADE E SIMPATIA é o que oferecemos para tornar seu evento inesquecível!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <img src="/icons/martini.png" alt="Drink ícone" className="w-14 mx-auto" />
              <h3 className="font-bold text-[#F4A300] uppercase">Recriando Sabores</h3>
              <p className="text-sm text-gray-600">
                Drinks PERSONALIZADOS ASSINADOS POR VOCÊ! Combinações inusitadas e releituras criativas de clássicos internacionais!
              </p>
            </div>

            <div className="space-y-3">
              <img src="/icons/juice.png" alt="Coquetel ícone" className="w-14 mx-auto" />
              <h3 className="font-bold text-[#F4A300] uppercase">Misturando Tendências</h3>
              <p className="text-sm text-gray-600">
                Bar CUSTOMIZADO na sua medida! EXPERIÊNCIA aliada ao estilo do evento. Um bar EXCLUSIVO PARA SUA FESTA!
              </p>
            </div>

            <div className="space-y-3">
              <img src="/icons/cocktail.png" alt="Sensações ícone" className="w-14 mx-auto" />
              <h3 className="font-bold text-[#F4A300] uppercase">Servindo Sensações</h3>
              <p className="text-sm text-gray-600">
                Drinks elaborados ao gosto de cada convidado. INDIVIDUALIDADE PARA SUPERAR EXPECTATIVAS. Seu evento ÚNICO!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
