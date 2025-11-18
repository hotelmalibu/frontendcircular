import React, { useState } from "react";

const ResponseManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos los estados");
  const [selectedDate, setSelectedDate] = useState("");

  // Datos de ejemplo de respuestas
  const responses = [
    {
      form: "Registro Productores Envasados",
      companyUser: "EcoPlásticos Ltda. - S00012456-7",
      status: "Aprobado",
      completion: "100%",
      date: "14/09/2025 15:30",
      reviewer: "María González",
      actions: null,
    },
    {
      form: "Manifiesto RESPEL",
      companyUser: "Químicos Industriales S.A. - 89022457-8",
      status: "Requiere Corrección",
      completion: "85%",
      date: "13/09/2025 14:45",
      reviewer: "Carlos Ruiz",
      actions: null,
    },
    {
      form: "Reporte Trimestral Aprovechamiento",
      companyUser: "Reciclaje Verde Colombia - 83034567-9",
      status: "En Revisión",
      completion: "65%",
      date: "12/09/2025 08:20",
      reviewer: "David López",
      actions: null,
    },
  ];

  // Filtrar respuestas según el término de búsqueda, estado y fecha
  const filteredResponses = responses.filter((response) => {
    const matchesSearch = response.form.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         response.companyUser.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "Todos los estados" || response.status === filterStatus;
    const responseDate = new Date(response.date.split(" ")[0].split("/").reverse().join("-"));
    const selected = selectedDate ? new Date(selectedDate.split("/").reverse().join("-")) : null;

    const matchesDate = !selected || responseDate.toDateString() === selected.toDateString();
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Sección superior de filtros */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-end items-center mb-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Buscar Formulario"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 p-2 border border-gray-300 rounded"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Buscar
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded w-full"
          >
            <option value="Todos los estados">Todos los estados</option>
            <option value="Aprobado">Aprobado</option>
            <option value="Requiere Corrección">Requiere Corrección</option>
            <option value="En Revisión">En Revisión</option>
          </select>
          <input
            type="text"
            placeholder="día/mes/año"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>

      {/* Sección de exportación */}
      <div className="mb-4 flex justify-start">
        <button
          className="bg-[#34672A] text-white px-4 py-2 rounded hover:bg-[#2A4F20]"
          style={{ backgroundColor: "#34672A" }}
        >
          Exportar Respuestas
        </button>
      </div>

      {/* Tabla de respuestas */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold mb-4">Gestión de Respuestas</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b">Formulario</th>
              <th className="p-2 border-b">Empresa/Usuario</th>
              <th className="p-2 border-b">Estado</th>
              <th className="p-2 border-b">Completitud</th>
              <th className="p-2 border-b">Fecha Envío</th>
              <th className="p-2 border-b">Revisor</th>
              <th className="p-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredResponses.map((response, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{response.form}</td>
                <td className="p-2">{response.companyUser}</td>
                <td className="p-2">
                  <span
                    className={`px-2 py-1 rounded ${
                      response.status === "Aprobado"
                        ? "bg-green-200 text-green-800"
                        : response.status === "Requiere Corrección"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {response.status}
                  </span>
                </td>
                <td className="p-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        response.status === "Aprobado"
                          ? "bg-green-600"
                          : response.status === "Requiere Corrección"
                          ? "bg-red-600"
                          : "bg-yellow-600"
                      }`}
                      style={{ width: response.completion }}
                    ></div>
                  </div>
                  <span className="text-sm ml-2">{response.completion}</span>
                </td>
                <td className="p-2">{response.date}</td>
                <td className="p-2">{response.reviewer}</td>
                <td className="p-2">
                  <button className="text-gray-500 hover:text-gray-700">
                    ✏️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResponseManagement;