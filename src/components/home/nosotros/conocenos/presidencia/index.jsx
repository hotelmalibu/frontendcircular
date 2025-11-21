import React, { useState } from "react";
import { GraduationCap, HeartHandshake, Building2, Globe, Briefcase, BookOpen } from "lucide-react";
import Presidencia from "../../../../../assets/presidente/presidente.jpg";

export default function BruceMacMaster() {
  const [language, setLanguage] = useState("es");

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Diseño minimalista y elegante */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white overflow-hidden">
        {/* Patrón de fondo sutil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Texto Hero */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="px-4 py-2 bg-emerald-700/50 backdrop-blur-sm rounded-full text-sm font-semibold tracking-wide border border-emerald-500/30">
                  Presidente ANDI
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-black leading-tight">
                Bruce<br />
                <span className="text-yellow-400">Mac Master</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-emerald-100 leading-relaxed max-w-xl">
                Líder empresarial y social comprometido con el desarrollo económico y la inclusión en Colombia
              </p>

              {/* Botones de idioma */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    language === "es"
                      ? "bg-white text-emerald-900 shadow-xl"
                      : "bg-emerald-700/30 text-white hover:bg-emerald-700/50 border border-emerald-500/30"
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                    language === "en"
                      ? "bg-white text-emerald-900 shadow-xl"
                      : "bg-emerald-700/30 text-white hover:bg-emerald-700/50 border border-emerald-500/30"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Imagen Hero */}
            <div className="relative">
              <div className="relative z-10">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 backdrop-blur">
                  <img
                    src={Presidencia}
                    alt="Bruce Mac Master"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Decoración */}
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>

        {/* Ola decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Contenido en Español */}
      {language === "es" && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          {/* Bio Principal */}
          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <Building2 className="w-10 h-10 text-emerald-600" />
              <h2 className="text-4xl font-bold text-gray-900">Sobre Bruce Mac Master</h2>
            </div>
            
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed text-left">
              <p className="text-left">
                Bruce Mac Master es economista de la <strong>Universidad de los Andes</strong> con estudios de maestría en desarrollo económico. Actualmente, se desempeña como <strong>Presidente de la Asociación Nacional de Empresarios de Colombia (ANDI)</strong>.
              </p>
              <p className="text-left">
                Dirigió el <strong>Departamento para la Prosperidad Social (DPS)</strong> del Gobierno Nacional, donde lideró la formulación de políticas sociales y la ejecución de programas dirigidos a los más pobres y vulnerables. También presidió el Comité Ejecutivo del Sistema Nacional de Atención y Reparación Integral a Víctimas, la Mesa de Pobreza y el Consejo Directivo del Instituto Colombiano de Bienestar Familiar.
              </p>
              <p className="text-left">
                Fue <strong>Viceministro de Hacienda entre 2010 y 2011</strong>, y Ministro de Hacienda encargado en diversas oportunidades. Además, fue cofundador de <strong>Compartamos con Colombia</strong> y la <strong>Fundación Granitos de Paz</strong>, participando activamente en múltiples fundaciones sociales.
              </p>
            </div>
          </div>

          {/* Tarjetas de áreas */}
          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Labor Social */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <HeartHandshake className="w-12 h-12 mb-4 text-rose-500" />
              <h3 className="text-3xl font-bold mb-4 text-gray-900 text-left">Labor social y fundaciones</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Su trayectoria en el sector social incluye la presidencia de la Junta Directiva de la <strong>Fundación Pies Descalzos</strong> y su participación en las juntas de las fundaciones <strong>Batuta</strong>, <strong>Semana</strong>, <strong>Corporación Conexión Colombia</strong>, <strong>Víctor Salvi</strong> y <strong>Casa de la Madre y el Niño</strong>. También fue cofundador de <strong>Compartamos con Colombia</strong> y de la <strong>Fundación Granitos de Paz</strong>, que promueven programas sociales en zonas vulnerables de Cartagena.
              </p>
            </div>

            {/* Formación y Docencia */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
              <GraduationCap className="w-12 h-12 mb-4 text-orange-500" />
              <h3 className="text-3xl font-bold mb-4 text-gray-900 text-left">Formación y docencia</h3>
              <p className="text-gray-700 leading-relaxed text-left">
                Se ha desempeñado como docente de pregrado y posgrado en temas de <strong>Responsabilidad Social Empresarial</strong>, <strong>Finanzas Corporativas</strong>, <strong>Banca de Inversión</strong>, <strong>Estructuración de Proyectos de Infraestructura</strong> y <strong>Empresa y Sociedad</strong>. Fue uno de los creadores de la <strong>especialización en Responsabilidad Social Empresarial de la Universidad de los Andes</strong>.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Contenido en Inglés */}
      {language === "en" && (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <Globe className="w-10 h-10 text-blue-600" />
              <h2 className="text-5xl font-black text-gray-900">Bruce Mac Master</h2>
            </div>
            <p className="text-2xl text-gray-600">President of the National Business Association of Colombia</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-3xl p-10 border border-blue-100 shadow-xl">
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Bruce Mac Master is an Economist from <strong>Los Andes University</strong> with over <strong>20 years of experience</strong> in investment banking and social responsibility. He is currently President of the National Business Association of Colombia (ANDI).
              </p>
              <p>
                Bruce was one of the founding partners of <strong>Inverlink</strong>, the first investment bank created in Colombia in the mid-eighties. Well-known in the investment banking field, he has led some of Colombia's most important transactions in infrastructure, transport and telecommunications.
              </p>
              <p>
                He has been professor of Economics at Los Andes University, and CFO of <strong>Propilco</strong>, <strong>Aceitales</strong>, and the <strong>Siderúrgica del Caribe</strong>. Over the last decade, Bruce has been a prominent philanthropist, co-founding the <strong>Compartamos Colombia Foundation</strong> and <strong>Granitos de Paz in 2004</strong>, which develops social programs for families in vulnerable areas of Cartagena.
              </p>
              <p>
                He is also a board member of <strong>Fulbright Colombia</strong>, <strong>Batuta</strong>, <strong>Conexión Colombia</strong> (Semana magazine), and president of the board of the <strong>International Music Festival</strong>. Additionally, he serves on the boards of <strong>ISA</strong>, <strong>ISAGEN</strong>, <strong>Colombia Telecomunicaciones</strong>, <strong>Bancóldex</strong>, and <strong>Previsora Fiduciary</strong>.
              </p>
              <p>
                In <strong>2010</strong>, he was appointed <strong>Vice Minister of Finance</strong> by the Santos administration, and later became Director of the <strong>Administrative Department for Social Prosperity</strong>, overseeing the definition and execution of Colombia's social policies.
              </p>
            </div>
          </div>

          {/* Key Achievements en inglés */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <BookOpen className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg text-gray-900 mb-2">Academic Leadership</h4>
              <p className="text-gray-600 text-sm">Professor and creator of CSR specialization</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <Briefcase className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg text-gray-900 mb-2">Business Experience</h4>
              <p className="text-gray-600 text-sm">Investment banking and infrastructure</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center">
              <HeartHandshake className="w-10 h-10 text-rose-600 mx-auto mb-3" />
              <h4 className="font-bold text-lg text-gray-900 mb-2">Social Impact</h4>
              <p className="text-gray-600 text-sm">Founder of multiple social foundations</p>
            </div>
          </div>
        </section>
      )}

      
    </div>
  );
}