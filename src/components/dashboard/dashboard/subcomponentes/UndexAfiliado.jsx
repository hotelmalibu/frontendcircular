import React, { useState, useEffect } from "react";
import {
    Leaf,
    Activity,
    FileText,
    Search,
    TrendingUp,
    Layout,
    Award,
    Globe
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../../../../api/projectsApi";

const BRAND = {
    blue: "#2C67B0",
    darkBlue: "#005380",
    lightBlue: "#7FB8D9",
    green: "#B1D357",
    gray: "#6B7280",
};

export default function UndexAfiliado() {
    const [projectsCount, setProjectsCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllProjects();
                setProjectsCount(res.data?.length || 0);
            } catch (e) {
                console.error("Error fetching projects for affiliate", e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = [
        { title: "Mis Proyectos", value: projectsCount.toString(), icon: <FileText size={20} />, color: BRAND.blue },
        { title: "Impacto Ambiental", value: "85%", icon: <Leaf size={20} />, color: BRAND.green },
        { title: "Puntos Acumulados", value: "1,250", icon: <Award size={20} />, color: "#FBBF24" },
        { title: "Eventos Próximos", value: "3", icon: <Globe size={20} />, color: BRAND.lightBlue },
    ];

    return (
        <div className="p-4 sm:p-8 space-y-8 animate-in fade-in duration-500">

            {/* Saludo y Hero */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005380] to-[#2C67B0] p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">¡Bienvenido a Visión Circular!</h1>
                    <p className="text-blue-100 text-lg max-w-2xl">
                        Como afiliado, eres parte fundamental del cambio. Aquí puedes monitorear tus proyectos y ver el impacto positivo que estamos generando juntos.
                    </p>
                </div>
                <div className="absolute right-[-20px] top-[-20px] opacity-10">
                    <Leaf size={200} />
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-50 hover:shadow-md transition-all group overflow-hidden relative">
                        <div className="flex justify-between items-center relative z-10">
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-800">{loading ? '...' : stat.value}</h3>
                            </div>
                            <div className="p-3 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* News Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <Activity size={24} className="text-blue-500" />
                            Notas y Actualizaciones
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors cursor-pointer group">
                                <div className="h-40 bg-gray-100 rounded-xl mb-4 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    {/* Placeholder image representation */}
                                    <div className="flex items-center justify-center h-full text-gray-300">
                                        <Layout size={40} />
                                    </div>
                                </div>
                                <h4 className="font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">Nuevo hito en sostenibilidad {i === 1 ? 'Regional' : 'Nacional'}</h4>
                                <p className="text-sm text-gray-500 line-clamp-2">Explora cómo las nuevas normativas están ayudando a los afiliados a optimizar sus procesos circulares...</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Help / Call to action */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-800">Recursos Rápidos</h2>
                    <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-50 space-y-4">
                        <Link to="/proyectos" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-colors group">
                            <div className="p-3 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <FileText size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Gestionar Proyectos</p>
                                <p className="text-xs text-gray-400 text-nowrap">Ver y editar tus iniciativas</p>
                            </div>
                        </Link>
                        <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-green-50 transition-colors group cursor-pointer">
                            <div className="p-3 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Ver Indicadores</p>
                                <p className="text-xs text-gray-400 text-nowrap">Analiza tu desempeño mensual</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
