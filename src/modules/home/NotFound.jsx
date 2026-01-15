
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 md:px-8 lg:px-24">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Visual Icon Section */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center blur-3xl opacity-20 bg-blue-500 rounded-full w-48 h-48 mx-auto -z-10 animate-pulse"></div>
                    <div className="w-40 h-40 bg-white rounded-full shadow-2xl shadow-blue-900/10 flex items-center justify-center mx-auto border border-gray-100 relative overflow-hidden group">
                        <AlertTriangle size={64} className="text-[#005380] group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#B1D357] text-[#005380] text-[50px] font-black px-6 py-1 rounded-2xl shadow-lg leading-none">
                        404
                    </div>
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-gray-800">¡Página no encontrada!</h1>
                    <p className="text-gray-500 font-medium">
                        Lo sentimos, la ruta que buscas no existe o ha sido movida temporalmente.
                    </p>
                </div>

                <div className="pt-6">
                    <Link 
                        to="/"
                        className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-[#2C67B0] text-white font-bold rounded-2xl hover:bg-[#005380] transition-all shadow-xl shadow-blue-900/20 active:scale-95 group"
                    >
                        <Home size={20} className="group-hover:-translate-y-0.5 transition-transform" />
                        Volver al Inicio
                    </Link>
                </div>
            </div>

            {/* Branded Footer accent */}
            <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B1D357] via-[#2C67B0] to-[#005380]"></div>
        </div>
    );
};

export default NotFound;
