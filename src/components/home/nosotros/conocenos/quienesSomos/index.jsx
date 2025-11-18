import React from "react";
import { motion } from "framer-motion";
import { Target, Globe, Handshake } from "lucide-react";
import Logo from "../../../../../assets/Logo.png";

export default function Index() {
  return (
    <section className="bg-gradient-to-b from-white via-green-50 to-emerald-50 py-20 px-6 md:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Imagen con efecto hover */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <img
                src={Logo}
                alt="Asociación Nacional de Empresarios de Colombia - ANDI"
                className="w-full h-[420px] object-contain bg-white p-8 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-800/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-green-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-lg">
              Desde 1944
            </div>
          </motion.div>

          {/* Contenido ORIGINAL de la empresa */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-green-900 leading-tight">
                ¿Quiénes Somos?
              </h2>
              <div className="h-1 w-24 bg-green-600 mt-3 rounded-full"></div>
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              La <span className="font-semibold text-green-700">Asociación Nacional de Empresarios de Colombia (ANDI)</span> es una agremiación sin ánimo de lucro que tiene como objetivo difundir y propiciar los principios políticos, económicos y sociales de un sano sistema de libre empresa.
            </p>

            <p className="text-gray-600 leading-relaxed mb-4">
              Fundada el <span className="font-semibold text-green-800">11 de septiembre de 1944</span> en Medellín, la ANDI es hoy el gremio empresarial más importante de Colombia. Está integrada por un porcentaje significativo de empresas pertenecientes a sectores como el industrial, financiero, agroindustrial, de alimentos, comercial y de servicios.
            </p>

            <p className="text-gray-600 leading-relaxed">
              Su sede principal se encuentra en <span className="font-semibold text-green-800">Medellín</span> y cuenta con sedes en varias ciudades del país, incluyendo <span className="text-green-700">Barranquilla, Bogotá, Bucaramanga, Cali, Cartagena, Cúcuta, Ibagué, Manizales, Pereira, Santander de Quilichao y Villavicencio</span>.
            </p>

            {/* Badges de ciudades (resumidos para no alargar) */}
            <div className="flex flex-wrap gap-2 mt-6">
              {["Bogotá", "Cali", "Medellín", "Barranquilla"].map((city) => (
                <span
                  key={city}
                  className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-medium rounded-full border border-green-200"
                >
                  {city}
                </span>
              ))}
              <span className="px-3 py-1.5 bg-green-100 text-green-600 text-xs font-medium rounded-full border border-green-200">
                +9 ciudades más
              </span>
            </div>
          </motion.div>
        </div>

        {/* Apuesta Mega 2025 - TEXTO EXACTO de la empresa */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 bg-gradient-to-r from-green-700 to-emerald-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mt-12 -mr-12 opacity-10">
            <Target className="w-48 h-48" />
          </div>

          <div className="relative z-10 max-w-4xl">
            <div className="flex items-center gap-3 mb-4">
              <Handshake className="w-8 h-8" />
              <h3 className="text-3xl md:text-4xl font-bold">Apuesta Mega 2025</h3>
            </div>

            {/* TEXTO EXACTO proporcionado por la empresa */}
            <p className="text-lg md:text-xl leading-relaxed text-green-50 mb-8">
              La ANDI liderará activamente, desde el sector empresarial, la reactivación económica del país con propuestas que generen empleo de calidad y aceleren el crecimiento en el corto plazo. 
              Su objetivo es que para el <span className="font-semibold text-white">año 2025</span>, Colombia sea uno de los tres países más competitivos de América Latina, promoviendo el posicionamiento de las empresas como generadoras de progreso regional y protagonistas en la búsqueda de los 
              <span className="text-yellow-300 font-semibold">Objetivos de Desarrollo Sostenible</span>, los principios del 
              <span className="text-yellow-300 font-semibold">Capitalismo Consciente</span>, la libre empresa y la democracia.
            </p>

            {/* Tarjetas de pilares (mantengo visual, pero texto original arriba) */}
            <div className="grid md:grid-cols-3 gap-6 text-center opacity-80">
              <div className="bg-white/5 rounded-2xl p-4">
                <Globe className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm">Top 3 LATAM</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <Target className="w-8 h-8 mx-auto mb-2 text-yellow-300" />
                <p className="text-sm">ODS</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4">
                <div className="w-8 h-8 mx-auto mb-2 bg-yellow-300 rounded-full flex items-center justify-center text-xs font-bold text-green-800">
                  CC
                </div>
                <p className="text-sm">Capitalismo Consciente</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/20 flex justify-end">
            <span className="inline-flex items-center gap-2 text-yellow-300 font-medium text-sm">
              <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></span>
              Meta activa 2025
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}