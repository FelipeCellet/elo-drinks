import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const portfolioData = [
  {
    id: 1,
    image: "/img/fundador.png",
    title: "A Jornada do Nosso Fundador",
    subtitle: "ROBERTO VITTA",
    description:
      "À frente da Elo Drinks, está Roberto Vitta, que começou sua trajetória como barman e tornou-se especialista na arte da coquetelaria e na gestão de equipes. Em 2016, fundou a empresa e, em 2020, decidiu apostar integralmente em seu sonho, consolidando a Elo Drinks como um dos nomes mais desejados do mercado de eventos em São Paulo. Roberto acredita que a verdadeira experiência de um evento vai além dos drinks – está na conexão humana, na hospitalidade genuína e no prazer de oferecer algo inesquecível."
  },
  {
    id: 2,
    image: "/img/elo_drinks_equipe.png",
    title: "Equipe Elo Drinks",
    subtitle: "EXPERIÊNCIA QUE TRANSBORDA PROFISSIONALISMO",
    description: "Por trás de cada drink perfeito está uma equipe dedicada à arte de bem servir. Nesta imagem, a equipe Elo Drinks se apresenta em um dos muitos eventos que traduzem nosso compromisso com excelência, estilo e hospitalidade.\n\nUniformizados com elegância e posicionados em um bar exuberante, cada membro carrega consigo não apenas técnica, mas também paixão por criar momentos memoráveis. Porque mais do que coquetéis, entregamos experiências completas – com simpatia, precisão e presença marcante."
  },
  {
    id: 3,
    image: "/img/evento.png",
    title: "Celebrando Conexões",
    subtitle: "ELO ENTRE BRINDES E PESSOAS",
    description:
      "A Elo Drinks é uma empresa de coquetelaria para eventos sociais e corporativos que tem a premissa de que celebrar é mais do que reunir pessoas – é criar momentos que ficam na memória.\n\nÉ o ELO entre a alta coquetelaria e o serviço impecável. Entre pessoas e brindes.\n\nSofisticação, criatividade e hospitalidade são os pilares que guiam a Elo Drinks. Cada coquetel é pensado para surpreender e conectar."
  },
  {
    id: 4,
    image: "/img/negroni.png",
    title: "Negroni: Clássico com Estilo",
    subtitle: "ELEGÂNCIA EM CADA DETALHE",
    description: "O Negroni é mais do que um coquetel – é uma declaração de sofisticação. Nesta composição visual, destacamos cada elemento que faz desse clássico um símbolo da alta coquetelaria: Campari, vermute rosso e gin se unem em perfeita harmonia, finalizados com um toque cítrico de laranja e servido com gelo cristalino.\n\nNa Elo Drinks, cada drink é pensado para marcar momentos únicos. Esta imagem representa nosso compromisso com estética, sabor e experiência – transformando cada brinde em uma conexão memorável."
  },
  {
    id: 5,
    image: "/img/vintagepink.png",
    title: "Vintage Pink",
    subtitle: "A BELEZA EM UM COQUETEL",
    description: "Uma criação autoral que combina delicadeza, frescor e sofisticação em um só gole. O Vintage Pink é um drink pensado para surpreender com sua espuma leve, textura cremosa e tonalidade vibrante, ideal para ocasiões especiais que pedem elegância com personalidade.\n\nServido em taça coupe e decorado com pequenos botões florais, esse coquetel reforça o propósito da Elo Drinks: transformar cada detalhe em uma experiência sensorial. É o elo entre estética, sabor e emoção — um verdadeiro brinde à beleza dos momentos inesquecíveis."
  },
  {
    id: 6,
    image: "/img/salarosa.png",
    title: "Ambientes que Encantam",
    subtitle: "CENÁRIOS PARA MOMENTOS INESQUECÍVEIS",
    description: "Muito além dos coquetéis, a Elo Drinks entrega experiências completas. Nesta imagem, um dos cenários mais marcantes em que atuamos: um salão sofisticado, vibrante e imersivo, com uma paleta rica de cores e elementos visuais que despertam os sentidos.\n\nCom decoração envolvente, iluminação estratégica e atenção a cada detalhe, esse evento é o reflexo da nossa missão: brindar em ambientes onde estética e emoção se encontram. Aqui, o bar se integra com o espaço para criar memórias que permanecem vivas muito depois do último gole."
  }

];

function Portfolio() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % portfolioData.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const evento = portfolioData[current];

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + portfolioData.length) % portfolioData.length);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % portfolioData.length);
  };

  return (
    <section className="relative w-screen h-[calc(100vh-64px)] pt-16 overflow-hidden text-white">
      {/* Imagem de fundo com ajuste especial para vertical */}
      <div className="absolute inset-0 w-full h-full z-0">
        {evento.id === 1 ? (
          <>
            <img
              src={evento.image}
              alt={evento.title}
              className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
            />
            <img
              src={evento.image}
              alt={evento.title}
              className="relative z-10 mx-auto h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/40 z-20" />
          </>
        ) : (
          <>
            <img
              src={evento.image}
              alt={evento.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 20%" }}
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </>
        )}
      </div>

      {/* Conteúdo centralizado verticalmente */}
      <div className="relative z-30 w-full h-full flex items-center px-6 md:px-16">
        <div className="max-w-2xl text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F4A300] mb-2">
            {evento.title}
          </h2>
          <h3 className="text-lg md:text-xl font-semibold mb-4">
            {evento.subtitle}
          </h3>
          <p className="text-sm md:text-base text-gray-200 leading-relaxed whitespace-pre-line">
            {evento.description}
          </p>

          <div className="flex gap-2 mt-4">
            {portfolioData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? "bg-[#F4A300]" : "bg-gray-500"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {/* Botões de navegação */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 p-2 rounded-full"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/60 hover:bg-black/80 p-2 rounded-full"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    </section>
  );
}

export default Portfolio;
