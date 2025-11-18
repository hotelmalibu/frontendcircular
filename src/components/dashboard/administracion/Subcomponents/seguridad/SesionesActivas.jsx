import React from "react";
import { MapPin, Monitor, Clock, Users } from "lucide-react";

export default function SesionesActivas() {
  const sesiones = [
    {
      nombre: "Laura Sánchez",
      correo: "laura.sanchez@admin.ecocircular.com",
      ubicacion: "Bogotá, Colombia",
      navegador: "Chrome/Windows",
      fecha: "15/9/2025, 20:15:32",
      sesiones: 1,
    },
    {
      nombre: "María González",
      correo: "maria.gonzalez@ecotech.com",
      ubicacion: "Bogotá, Colombia",
      navegador: "Chrome/Windows",
      fecha: "15/9/2025, 20:15:32",
      sesiones: 1,
    },
    {
      nombre: "Carlos Ruiz",
      correo: "carlos.ruiz@madrid.gov",
      ubicacion: "Bogotá, Colombia",
      navegador: "Chrome/Windows",
      fecha: "15/9/2025, 20:15:32",
      sesiones: 1,
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Sesiones Activas
      </h2>

      <div className="space-y-3">
        {sesiones.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center p-4"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {s.nombre}{" "}
                <span className="text-gray-600 text-sm">({s.correo})</span>
              </p>

              <div className="flex flex-wrap items-center text-gray-500 text-sm mt-1 gap-x-3">
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {s.ubicacion}
                </span>
                <span className="flex items-center gap-1">
                  <Monitor size={14} /> {s.navegador}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {s.fecha}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {s.sesiones} sesión(es)
                </span>
              </div>
            </div>

            <div className="flex gap-2 mt-3 sm:mt-0">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm px-4 py-2 rounded-md">
                Detalles
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-md">
                Terminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
