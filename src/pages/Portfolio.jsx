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
    }, 6000);
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
    <div className="text-white py-10 max-w-5xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-[#F4A300] text-center mb-10">
        Portfólio de Eventos
      </h2>

      <div className="bg-black border border-gray-800 rounded-2xl shadow-xl overflow-hidden relative">
        <img
          src={evento.image}
          alt={evento.title}
          className="w-full h-[650px] object-cover"
        />
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/60 p-2 rounded-full hover:bg-gray-800"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/60 p-2 rounded-full hover:bg-gray-800"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
        <div className="p-8 text-center">
          <h3 className="text-2xl font-bold text-[#F4A300] mb-2">{evento.title}</h3>
          <h4 className="text-lg font-semibold mb-4">{evento.subtitle}</h4>
          <p className="text-gray-300 whitespace-pre-line leading-relaxed">
            {evento.description}
          </p>
          <div className="flex gap-2 mt-6 justify-center">
            {portfolioData.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  current === index ? "bg-[#F4A300] scale-110" : "bg-gray-700"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
