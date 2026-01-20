import React from "react";
import { motion } from "framer-motion";
import { Quote, Users, Recycle, Globe, Zap, Leaf, TrendingUp, Handshake, Target } from "lucide-react";
import LogoVisionCircular from "../../../../../assets/fondosYlogos/Logo.png";




export default function Index() {
  const quotes = [
    {
      author: "Bruce Mac Master",
      role: "Presidente ANDI",
      text: "La economía circular no solo es una solución frente a los retos ambientales y sociales globales, sino también una oportunidad para las empresas colombianas de innovar, generar valor y fortalecer sus cadenas productivas.",
      icon: Handshake
    },
    {
      author: "Luz Elena Aristizábal",
      role: "Presidente Junta Visión Circular ANDI",
      text: "Este modelo colaborativo, que involucra a más de 380 empresas de 27 sectores productivos, fomenta la innovación y la implementación de procesos de reciclaje, reúso y reducción, consolidándose como un referente en Latinoamérica.",
      icon: Users
    },
    {
      author: "Carlos Herrera",
      role: "Vicepresidente de Desarrollo Sostenible ANDI",
      text: "Hacer de la economía circular uno de los motores del desarrollo sostenible más allá del 2030, cuando los ODS cierren su primer ciclo, es más que una oportunidad, es un imperativo.",
      icon: Target
    },
    {
      author: "Mónica Villegas Carrasquilla",
      role: "Directora Visión Circular ANDI",
      text: "Generamos así oportunidades de desarrollo social y económico alrededor del aprovechamiento de materiales.",
      icon: TrendingUp
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#E8F0F8] to-[#F0F7E8] py-12 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section - Más compacta */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-8">
          {/* Logo Visión Circular */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative group"
          >
            <div className="overflow-hidden rounded-2xl shadow-xl bg-white">
              <img
                src={LogoVisionCircular}
                alt="Visión Circular ANDI"
                className="w-full h-[340px] object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#00AB6D] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
              Casi 5 años impulsando la circularidad
            </div>
          </motion.div>

          {/* Contenido - Alineado a la izquierda */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4 text-left"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1E305D]">
                ¿Qué es Visión Circular ANDI?
              </h2>
              <p className="text-xl md:text-2xl font-bold text-[#00AB6D] mt-1">
                Impulsando al país hacia la economía circular
              </p>
              <div className="h-1 w-28 bg-[#00AB6D] mt-2 rounded-full"></div>
            </div>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Visión Circular ANDI es el colectivo empresarial líder en economía circular en Colombia, impulsado por la ANDI, que articula empresas, gestores, recicladores, transformadores, Estado, academia y ciudadanía para liderar la transición del país hacia una economía circular en envases y empaques, de manera innovadora, inclusiva y sostenible.
            </p>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Nacimos como Visión 30/30 con la meta del 30% de aprovechamiento al 2030. Tras casi cinco años de implementación, nos consolidamos como el colectivo más importante del país y un referente en Latinoamérica.
            </p>

            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              Actualmente acompañamos a <span className="font-bold text-[#00AB6D]">más de 380 empresas de 27 sectores</span>, articuladas con <span className="font-bold text-[#00AB6D]">148 gestores (incluyendo 57 organizaciones de recicladores)</span>, <span className="font-bold text-[#00AB6D]">más de 52 transformadoras</span> y beneficiando a <span className="font-bold text-[#00AB6D]">7.600 recicladores de oficio</span>, con presencia en <span className="font-bold text-[#00AB6D]">228 municipios de 30 departamentos</span>.
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-[#B1D357]/20 text-[#2C67B0] text-xs font-medium rounded-full border border-[#B1D357]/50">
                +380 Empresas
              </span>
              <span className="px-3 py-1.5 bg-[#7FB8D9]/20 text-[#2C67B0] text-xs font-medium rounded-full border border-[#7FB8D9]/50">
                7.600 Recicladores
              </span>
              <span className="px-3 py-1.5 bg-[#00AB6D]/20 text-[#006F63] text-xs font-medium rounded-full border border-[#00AB6D]/50">
                228 Municipios
              </span>
              <span className="px-3 py-1.5 bg-[#B1D357]/20 text-[#2C67B0] text-xs font-medium rounded-full border border-[#B1D357]/50">
                30 Departamentos
              </span>
            </div>
          </motion.div>
        </div>

        {/* Citas de Líderes - Más compacta y alineada izquierda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-[#1E305D] mb-4 flex items-center gap-2">
            <Quote size={24} className="text-[#00AB6D]" />
            Voces de Nuestros Líderes
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {quotes.map((quote, index) => {
              const Icon = quote.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-md border border-[#00AB6D]/20 text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon size={20} className="text-[#00AB6D]" />
                    <div>
                      <p className="font-bold text-[#1E305D] text-base">{quote.author}</p>
                      <p className="text-xs text-gray-600">{quote.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm italic">"{quote.text}"</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Impacto y Métricas - Más compacta y alineada izquierda */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-r from-[#2C67B0] to-[#00AB6D] rounded-2xl p-6 md:p-10 text-white shadow-xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8" />
            <h3 className="text-2xl md:text-3xl font-bold">Nuestro Impacto Acumulado</h3>
          </div>

          <p className="text-base md:text-lg leading-relaxed text-white/90 mb-6 max-w-4xl text-left">
            Hemos reincorporado <span className="font-bold">más de 214.000 toneladas</span> de envases y empaques al ciclo productivo en los últimos años, ejecutado <span className="font-bold">15 proyectos de innovación</span> durante 2023-2024 con inversiones superiores a <span className="font-bold">$2.000 millones</span>, y fortalecido la cadena de valor para un futuro más circular.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <Recycle className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">+214.000 t</p>
              <p className="text-xs opacity-80">Reincorporadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <Users className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">7.600</p>
              <p className="text-xs opacity-80">Recicladores de oficio</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <Zap className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">15</p>
              <p className="text-xs opacity-80">Proyectos innovación</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center">
              <Globe className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">228</p>
              <p className="text-xs opacity-80">Municipios con presencia</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 text-right">
            <span className="inline-flex items-center gap-2 text-[#B1D357] font-medium text-base">
              <span className="w-2.5 h-2.5 bg-[#B1D357] rounded-full animate-pulse"></span>
              Meta 30% aprovechamiento al 2030
            </span>
          </div>
        </motion.div>



      </div>
    </section>
  );
}