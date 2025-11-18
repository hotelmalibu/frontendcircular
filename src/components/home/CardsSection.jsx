import { motion } from "framer-motion";
import Card from "./Card";
import noticia1 from "../../assets/home/NoticiasYRecursos/A.jpg";
import noticia2 from "../../assets/home/NoticiasYRecursos/B.jpg";
import noticia3 from "../../assets/home/NoticiasYRecursos/C.jpg";
import noticia4 from "../../assets/home/NoticiasYRecursos/D.png";
import fondoPortal from "../../assets/home/NoticiasYRecursos/fondo_portal.jpg";

const cards = [
  {
    img: noticia1,
    date: "15 de Octubre, 2025",
    title: "Nueva estrategia de reciclaje alcanza el 75% de aprovechamiento",
    text: "El programa logra cifras récord en la recuperación de envases y empaques en Colombia.",
    link: "#",
    tag: "Reciclaje",
    color: "#00AB6D",
  },
  {
    img: noticia2,
    date: "15 de Octubre, 2025",
    title: "Alianza con 50 empresas transformadoras para cerrar el ciclo",
    text: "Visión Circular fortalece su red de aliados estratégicos en economía circular.",
    link: "#",
    tag: "Colaboración",
    color: "#00AB6D",
  },
  {
    img: noticia3,
    date: "15 de Octubre, 2025",
    title: "Programa de pedagogía alcanza 2 millones de consumidores",
    text: "Capacitación ciudadana en separación y disposición correcta de residuos.",
    link: "#",
    tag: "Educación",
    color: "#00AB6D",
  },
  {
    img: noticia4,
    date: "16 de Octubre, 2025",
    title: "Nuevas tecnologías reducen los desechos industriales en un 40%",
    text: "Innovaciones en procesos productivos permiten optimizar recursos y minimizar impacto ambiental.",
    link: "#",
    tag: "Innovación",
    color: "#00AB6D",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function CardsSection() {
  return (
    <section className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${fondoPortal})` }}>


      {/* === CONTENIDO PRINCIPAL === */}
      <motion.div
        className="relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-[#1E305D] text-4xl font-bold mb-4 drop-shadow-sm"
          variants={fadeUp}
        >
          Noticias recientes
        </motion.h2>

        <motion.p
          className="text-gray-700 max-w-2xl mx-auto mb-12"
          variants={fadeUp}
          custom={0.2}
        >
          Explora las últimas novedades sobre economía circular en Colombia y el mundo.
        </motion.p>

        {/* === TARJETAS === */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center mb-12">
          {cards.map((c, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx * 0.2}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="relative w-full max-w-[290px] flex flex-col items-center rounded-xl overflow-hidden shadow-md bg-white"
            >
              {/* Imagen con etiqueta */}
              <div className="relative w-full h-48 overflow-hidden">
                <img src={c.img} alt={c.title} className="w-full h-full object-cover" />
                <div
                  className="absolute top-3 left-3 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md"
                  style={{ backgroundColor: c.color }}
                >
                  {c.tag}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-4 text-left">
                <p className="text-sm text-gray-500 mb-1">{c.date}</p>
                <h3 className="font-semibold text-gray-800 mb-2 text-[15px] leading-tight">
                  {c.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{c.text}</p>
                <a
                  href={c.link}
                  className="text-[#2C67B0] text-sm font-semibold hover:underline"
                >
                  Leer más →
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* === BOTÓN FINAL === */}
        <motion.a
          href="#"
          className="inline-block border-2 text-white font-semibold px-6 py-3 rounded-lg bg-[#B1D357] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
          variants={fadeUp}
          custom={0.5}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Ver todas las noticias
        </motion.a>
      </motion.div>
    </section>
  );
}
