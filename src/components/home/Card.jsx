import { motion } from "framer-motion";

export default function Card({ img, date, title, text, link }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="w-80 bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Imagen superior */}
      <div className="h-44 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Contenido */}
      <div className="p-5 text-left">
        <p className="text-green-600 text-sm font-medium mb-2">{date}</p>
        <h3 className="text-blue-800 text-lg font-bold leading-snug mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">{text}</p>

        <a
          href={link}
          className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:underline"
        >
          Leer más <span className="text-base">→</span>
        </a>
      </div>
    </motion.div>
  );
}
