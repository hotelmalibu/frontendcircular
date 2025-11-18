import { FileDown, FileSpreadsheet, FileText, FileJson, Camera, Pencil } from "lucide-react";

export default function ReporteFormularios() {
  const formularios = [
    {
      nombre: "Registro Productores Envases",
      empresa: "EcoPlásticos Ltda.",
      nit: "900123456-7",
      estado: "Aprobado",
      estadoColor: "bg-teal-100 text-teal-800",
      completitud: 100,
      fecha: "14/09/2025, 15:30",
      revisor: "María González",
    },
    {
      nombre: "Manifiesto RESPEL",
      empresa: "Químicos Industriales S.A.",
      nit: "860234567-8",
      estado: "Requiere Corrección",
      estadoColor: "bg-rose-200 text-rose-800",
      completitud: 85,
      fecha: "13/09/2025, 11:45",
      revisor: "Carlos Ruiz",
    },
    {
      nombre: "Reporte Trimestral Aprovechamiento",
      empresa: "Reciclaje Verde Colombia",
      nit: "830345678-9",
      estado: "Pendiente Revisión",
      estadoColor: "bg-orange-200 text-orange-800",
      completitud: 95,
      fecha: "12/09/2025, 09:20",
      revisor: "David López",
    },
  ];

  const exportaciones = [
    {
      titulo: "Exportar a CSV",
      descripcion: "Ideal para análisis de datos en Excel o herramientas estadísticas",
      icono: <FileDown className="w-6 h-6 text-gray-700" />,
    },
    {
      titulo: "Exportar a Exel",
      descripcion: "Incluye formato, fórmulas y gráficos automáticos",
      icono: <FileSpreadsheet className="w-6 h-6 text-gray-700" />,
    },
    {
      titulo: "Exportar a PDF",
      descripcion: "Reportes formateados listos para presentación",
      icono: <FileText className="w-6 h-6 text-gray-700" />,
    },
    {
      titulo: "Exportar a JSON",
      descripcion: "Para integraciones con APIs y sistemas externos",
      icono: <FileJson className="w-6 h-6 text-gray-700" />,
    },
  ];

  return (
    <div className="p-6">
      {/* Buscador alineado a la derecha con botón separado */}
      <div className="flex justify-end items-center gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar Formulario"
          className="w-full max-w-sm pl-4 pr-4 py-2 border border-gray-300 rounded-full focus:ring focus:ring-blue-200"
        />
        <button className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-full px-5 py-2 shadow-sm transition">
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl shadow-md border border-gray-200 mb-10">
        <table className="w-full text-left border-collapse">
          <thead className="bg-amber-50 text-gray-800">
            <tr>
              <th className="px-6 py-3 font-semibold">Formulario</th>
              <th className="px-6 py-3 font-semibold">Empresa/Usuario</th>
              <th className="px-6 py-3 font-semibold">Estado</th>
              <th className="px-6 py-3 font-semibold">Completitud</th>
              <th className="px-6 py-3 font-semibold">Fecha Envío</th>
              <th className="px-6 py-3 font-semibold">Revisor</th>
              <th className="px-6 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {formularios.map((f, i) => (
              <tr key={i} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-700">{f.nombre}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">{f.empresa}</span>
                    <span className="text-sm text-gray-500">{f.nit}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${f.estadoColor}`}
                  >
                    {f.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-32 bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-teal-700 h-2"
                      style={{ width: `${f.completitud}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{f.completitud}%</span>
                </td>
                <td className="px-6 py-4 text-gray-700">{f.fecha}</td>
                <td className="px-6 py-4 text-gray-700">{f.revisor}</td>
                <td className="px-6 py-4 flex items-center space-x-2">
                  <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-2 bg-orange-100 hover:bg-orange-200 rounded-md">
                    <Pencil className="w-4 h-4 text-orange-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tarjetas de exportación */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {exportaciones.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-between bg-white shadow-md rounded-xl p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow"
          >
            {item.icono}
            <h3 className="font-semibold text-lg mt-2">{item.titulo}</h3>
            <p className="text-sm text-gray-600 mt-1 mb-4">{item.descripcion}</p>
            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Descargar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
