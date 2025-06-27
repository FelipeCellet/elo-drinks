import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const portfolioData = [
  {
    id: 1,
    image: "/img/roberto-vitta.png",
    title: "A Jornada do Nosso Fundador",
    subtitle: "ROBERTO VITTA",
    description:
      "À frente da Elo Drinks, está Roberto Vitta, que começou sua trajetória como barman e tornou-se especialista na arte da coquetelaria e na gestão de equipes. Em 2016, fundou a empresa e, em 2020, decidiu apostar integralmente em seu sonho, consolidando a Elo Drinks como um dos nomes mais desejados do mercado de eventos em São Paulo. Roberto acredita que a verdadeira experiência de um evento vai além dos drinks – está na conexão humana, na hospitalidade genuína e no prazer de oferecer algo inesquecível."
  },
  {
    id: 2,
    image: "/img/evento-balcao.png",
    title: "Celebrando Conexões",
    subtitle: "ELO ENTRE BRINDES E PESSOAS",
    description:
      "A Elo Drinks é uma empresa de coquetelaria para eventos sociais e corporativos que tem a premissa de que celebrar é mais do que reunir pessoas – é criar momentos que ficam na memória.\n\nÉ o ELO entre a alta coquetelaria e o serviço impecável. Entre pessoas e brindes.\n\nSofisticação, criatividade e hospitalidade são os pilares que guiam a Elo Drinks. Cada coquetel é pensado para surpreender e conectar."
  }
];

function Portfolio() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % portfolioData.length);
    }, 8000);
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
      {/* Imagem de fundo */}
      <div className="absolute inset-0 w-full h-full z-0">
      <img
        src={evento.image}
        alt={evento.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: "center 20%" }}
      />

        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* Conteúdo centralizado verticalmente */}
      <div className="relative z-20 w-full h-full flex items-center px-6 md:px-16">
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
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-black/80 p-2 rounded-full"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    </section>
  );
}

export default Portfolio;
