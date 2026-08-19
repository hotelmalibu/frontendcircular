import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from 'dompurify';
import { Quote, Users, Recycle, Globe, Zap, Handshake, Target, Factory, Calendar, AlertCircle } from "lucide-react";
import LogoVisionCircular from "../../../../../assets/fondosYlogos/Logo.png";
import aboutUsApi from "../../../../../api/aboutUsApi";
import { getIntegrationDashboard } from "../../../../../api/integrationApi";

export default function Index() {
  const [aboutUsData, setAboutUsData] = useState(null);
  const [leaderQuotes, setLeaderQuotes] = useState([]);
  const [integrationData, setIntegrationData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear() - 1);
  const [loadingIntegration, setLoadingIntegration] = useState(true);
  const [integrationError, setIntegrationError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutUsResponse, quotesResponse] = await Promise.all([
          aboutUsApi.getAboutUs(),
          aboutUsApi.getAllLeaderQuotes()
        ]);

        setAboutUsData(aboutUsResponse.data);
        setLeaderQuotes(quotesResponse.data);
      } catch (error) {
        console.error("Error fetching Quienes Somos data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchIntegrationData = async (year) => {
    setLoadingIntegration(true);
    setIntegrationError(null);
    try {
      const response = await getIntegrationDashboard(year);
      if (response && response.data) {
        setIntegrationData(response.data);
      }
    } catch (err) {
      console.error("Error fetching integration dashboard metrics:", err);
      const msg = err.response?.data?.message || "No se pudo cargar la información del Dashboard de Integración";
      setIntegrationError(msg);
    } finally {
      setLoadingIntegration(false);
    }
  };

  useEffect(() => {
    fetchIntegrationData(selectedYear);
  }, [selectedYear]);

  // Icon mapping for leaders
  const getIconForIndex = (index) => {
    const icons = [Handshake, Users, Target];
    return icons[index % icons.length];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00AB6D]"></div>
      </div>
    );
  }

  // Fallback if data is not available
  const data = aboutUsData || {
    texto_index: "Cargando información...",
    toneladas: 0,
    recicladores: 0,
    proyectos: 0,
    municipios: 0
  };

  // Metrics to show from Integration API or fallback
  const tonsTrazadas = integrationData?.totalToneladasTrazadasAnioAnterior ?? data.toneladas;
  const gestores = integrationData?.totalGestoresVinculados ?? data.recicladores;
  const transformadores = integrationData?.totalTransformadoresVinculados ?? 0;
  const municipios = integrationData?.totalMunicipiosCubiertos ?? data.municipios;
  const anioConsultado = integrationData?.anioConsultado ?? selectedYear;

  return (
    <section className="bg-gradient-to-b from-white via-[#E8F0F8] to-[#F0F7E8] py-0 px-6 md:px-12 lg:px-20 pb-20">
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
              Más de 5 años impulsando la circularidad
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

            <div className="text-base md:text-lg text-gray-700 leading-relaxed text-justify prose prose-emerald max-w-none">
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(data.texto_index || "").replace(/\u00A0|&nbsp;/g, ' ')) }} />
            </div>
          </motion.div>
        </div>

        {/* Citas de Líderes */}
        {leaderQuotes.length > 0 && (
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
              {leaderQuotes.map((quote, index) => {
                const Icon = getIconForIndex(index);
                return (
                  <div
                    key={quote.id || index}
                    className="bg-white p-4 rounded-lg shadow-md border border-[#00AB6D]/20 text-left hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-[#E8F5E9] p-2 rounded-full">
                        <Icon size={20} className="text-[#00AB6D]" />
                      </div>
                      <div>
                        <p className="font-bold text-[#1E305D] text-base">{quote.nombre}</p>
                        <p className="text-xs text-gray-600">{quote.cargo}</p>
                      </div>
                    </div>
                    <div className="text-gray-700 text-sm italic leading-relaxed prose prose-sm max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(String(quote.frase || "").replace(/\u00A0|&nbsp;/g, ' ')) }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Impacto y Métricas Integradas desde API */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="bg-gradient-to-r from-[#2C67B0] to-[#00AB6D] rounded-2xl p-6 md:p-10 text-white shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-[#B1D357]" />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold">Nuestro Impacto Acumulado</h3>
                <p className="text-xs text-white/80">Datos actualizados del sistema de integración Visión Circular</p>
              </div>
            </div>

            {/* Selector de Año */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/20 self-start md:self-auto">
              <Calendar className="w-4 h-4 text-[#B1D357]" />
              <label htmlFor="year-select" className="text-xs font-semibold uppercase tracking-wider">Año:</label>
              <select
                id="year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer border-none py-1 rounded"
              >
                {[2026, 2025, 2024, 2023, 2022].map((y) => (
                  <option key={y} value={y} className="text-gray-900 bg-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {integrationError ? (
            <div className="bg-red-500/20 border border-red-300/40 rounded-lg p-4 mb-6 flex items-center gap-3 text-white">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{integrationError}</span>
            </div>
          ) : null}

          <p className="text-base md:text-lg leading-relaxed text-white/90 mb-6 max-w-4xl text-left">
            Durante el año <span className="font-bold">{anioConsultado}</span>, hemos alcanzado un total de{" "}
            <span className="font-bold text-[#B1D357]">
              {loadingIntegration ? "..." : Number(tonsTrazadas).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} toneladas trazadas
            </span>
            , articulando a gestores, transformadores y municipios en todo el país.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center border border-white/10 relative overflow-hidden">
              <Recycle className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">
                {loadingIntegration ? "..." : Number(tonsTrazadas).toLocaleString('es-ES', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} t
              </p>
              <p className="text-xs opacity-80 uppercase tracking-wider">Toneladas Trazadas</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center border border-white/10">
              <Users className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">
                {loadingIntegration ? "..." : Number(gestores).toLocaleString('es-ES')}
              </p>
              <p className="text-xs opacity-80 uppercase tracking-wider">Gestores Vinculados</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center border border-white/10">
              <Factory className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">
                {loadingIntegration ? "..." : Number(transformadores).toLocaleString('es-ES')}
              </p>
              <p className="text-xs opacity-80 uppercase tracking-wider">Transformadores</p>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-4 text-center border border-white/10">
              <Globe className="w-8 h-8 mb-2 mx-auto text-[#B1D357]" />
              <p className="text-xl font-bold">
                {loadingIntegration ? "..." : Number(municipios).toLocaleString('es-ES')}
              </p>
              <p className="text-xs opacity-80 uppercase tracking-wider">Municipios Cubiertos</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20 flex flex-col sm:flex-row justify-between items-center gap-2">
            <span className="text-xs text-white/80">
              Año consultado: <span className="font-semibold text-white">{anioConsultado}</span>
            </span>
            <span className="inline-flex items-center gap-2 text-[#B1D357] font-medium text-sm">
              <span className="w-2.5 h-2.5 bg-[#B1D357] rounded-full animate-pulse"></span>
              Meta 30% aprovechamiento al 2030
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

