import { motion } from "framer-motion";
import noticia1 from "../../assets/home/NoticiasYRecursos/A.jpg";
import noticia2 from "../../assets/home/NoticiasYRecursos/B.jpg";
import noticia3 from "../../assets/home/NoticiasYRecursos/C.jpg";
import noticia4 from "../../assets/home/NoticiasYRecursos/D.png";
import fondoPortal from "../../assets/home/NoticiasYRecursos/fondo_portal.jpg";

const cards = [
  {
    img: noticia1,
    title: "Nueva estrategia de reciclaje alcanza el 75% de aprovechamiento",
    text: "El programa logra cifras récord en la recuperación de envases y empaques en Colombia.",
    tag: "Reciclaje",
    color: "#00AB6D",
  },
  {
    img: noticia2,
    title: "Alianza con 50 empresas transformadoras para cerrar el ciclo",
    text: "Visión Circular fortalece su red de aliados estratégicos en economía circular.",
    tag: "Colaboración",
    color: "#00AB6D",
  },
  {
    img: noticia3,
    title: "Programa de pedagogía alcanza 2 millones de consumidores",
    text: "Capacitación ciudadana en separación y disposición correcta de residuos.",
    tag: "Educación",
    color: "#00AB6D",
  },
  {
    img: noticia4,
    title: "Nuevas tecnologías reducen los desechos industriales en un 40%",
    text: "Innovaciones en procesos productivos permiten optimizar recursos y minimizar impacto ambiental.",
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
    <section
      className="relative py-20 px-6 md:px-12 text-center overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${fondoPortal})` }}
    >
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center mb-12">
          {cards.map((c, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              custom={idx * 0.2}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden shadow-lg"
            >
              {/* Imagen grande cuadrada */}
              <img
                src={c.img}
                alt={c.title}
                className="w-full h-full object-cover"
              />

              {/* Overlay con título y texto */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                <span
                  className="self-start text-white text-xs font-semibold px-3 py-1 rounded-full mb-2"
                  style={{ backgroundColor: c.color }}
                >
                  {c.tag}
                </span>

                <h3 className="text-white font-bold text-xl leading-tight mb-2">
                  {c.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Botón final se mantiene igual */}
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
