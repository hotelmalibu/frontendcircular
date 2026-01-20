import React from "react";
import {
    Leaf,
    User,
    BookOpen,
    ClipboardCheck,
    HelpCircle,
    Info,
    Layout,
    Search,
    ChevronRight,
    Globe
} from "lucide-react";
import { Link } from "react-router-dom";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    lightBlue: "#7FB8D9",
    green: "#B1D357",
    gray: "#6B7280",
};

export default function UndexAfiliado() {
    const infoCards = [
        {
            title: "Mi Perfil",
            description: "Actualiza tu información personal y de contacto para que el equipo de Visión Circular esté siempre conectado contigo.",
            icon: <User size={20} />,
            color: BRAND.blue,
            link: "/profile"
        },
        {
            title: "Biblioteca Digital",
            description: "Accede a guías técnicas, normatividades y documentos clave sobre economía circular disponibles de forma libre.",
            icon: <BookOpen size={20} />,
            color: BRAND.green,
            link: "/explorar"
        },
        {
            title: "Conoce Proyectos",
            description: "Explora las iniciativas de éxito y los proyectos activos que están impulsando la sostenibilidad en Colombia.",
            icon: <Layout size={20} />,
            color: "#FBBF24",
            link: "/lineas-estrategicas"
        },
        {
            title: "Participa",
            description: "Participa en encuestas y convocatorias vigentes para influir en las futuras estrategias de economía circular.",
            icon: <ClipboardCheck size={20} />,
            color: BRAND.lightBlue,
            link: "/encuestas"
        },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">

            {/* Saludo y Hero Refinado */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005380] to-[#2C67B0] p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">¡Bienvenido a Visión Circular!</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Esta es tu plataforma para explorar el impacto de la economía circular. Como afiliado, tienes acceso a información clave y recursos para entender y promover la sostenibilidad.
                    </p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                    <Leaf size={200} />
                </div>
            </div>

            {/* Pilares de Información */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {infoCards.map((card, idx) => (
                    <Link to={card.link} key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50 hover:shadow-md transition-all group relative overflow-hidden flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                        <p className="text-sm text-gray-500 flex-grow leading-relaxed">
                            {card.description}
                        </p>
                        <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider transition-all" style={{ color: card.color }}>
                            Saber más <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sección informativa principal */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <Info size={28} className="text-blue-500" />
                            Guía de Inicio para Afiliados
                        </h2>

                        <div className="space-y-4 text-gray-600 leading-relaxed">
                            <p>
                                En <strong>Visión Circular</strong>, nuestra misión es acompañar a las organizaciones en su transición hacia modelos de negocio más sostenibles. Como miembro de esta plataforma, puedes navegar por diferentes recursos diseñados para informarte y conectar con otros actores del ecosistema.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Search size={16} className="text-green-500" />
                                        Búsqueda de Información
                                    </h4>
                                    <p className="text-sm">
                                        Utiliza la sección de explorar para encontrar documentos técnicos, casos de éxito y normatividades actualizadas sobre la gestión de residuos y recursos.
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                        <Globe size={16} className="text-blue-500" />
                                        Impacto Regional
                                    </h4>
                                    <p className="text-sm">
                                        Consulta las líneas estratégicas para entender cómo nuestras acciones colectivas están impactando positivamente en el desarrollo económico del país.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-4">
                            <HelpCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-blue-800 font-medium">¿Necesitas ayuda adicional?</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Si tienes dudas sobre cómo navegar o necesitas soporte técnico, puedes contactarnos a través de los canales oficiales de soporte de Visión Circular.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Resumen Informativo */}
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-100 shadow-sm h-fit">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Tu Compromiso</h3>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="h-2 w-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-gray-800 block mb-1">Actualización</span>
                                Mantener tu perfil actualizado permite una mejor comunicación con el gremio.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-gray-800 block mb-1">Participación</span>
                                Tus respuestas en las encuestas ayudan a definir políticas nacionales de sostenibilidad.
                            </p>
                        </li>
                        <li className="flex gap-4">
                            <div className="h-2 w-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-gray-800 block mb-1">Aprendizaje</span>
                                El uso de la biblioteca técnica mejora las capacidades circulares de tu empresa.
                            </p>
                        </li>
                    </ul>
                </div>
            </div>

        </div>
    );
}
