import React, { useState } from "react";

const FormBuilder = () => {
  const [formFields, setFormFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);

  // Paleta de elementos de muestra
  const elements = [
    { id: "text", label: "Texto", icon: "📝", category: "Elementos" },
    { id: "email", label: "E-mail", icon: "✉️", category: "Elementos" },
    { id: "date", label: "Fecha", icon: "📅", category: "Elementos" },
    { id: "number", label: "Número", icon: "🔢", category: "Elementos" },
    { id: "list", label: "Lista", icon: "📋", category: "Selección" },
    { id: "radio", label: "Radio botones", icon: "🔘", category: "Selección" },
    { id: "checkbox", label: "Checkbox", icon: "✅", category: "Selección" },
    { id: "file", label: "Archivo", icon: "📁", category: "Avanzados" },
    { id: "textarea", label: "Texto largo", icon: "✍️", category: "Avanzados" },
  ];

  // Manejar inicio de arrastre
  const handleDragStart = (e, fieldType) => {
    e.dataTransfer.setData("text/plain", fieldType);
  };

  // Manejar soltado en el área de vista previa
  const handleDrop = (e) => {
    e.preventDefault();
    const fieldType = e.dataTransfer.getData("text/plain");
    const newField = { id: Date.now(), type: fieldType, label: fieldType };
    setFormFields([...formFields, newField]);
  };

  // Manejar paso del arrastre
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Manejar selección de campo para propiedades
  const handleFieldSelect = (field) => {
    setSelectedField(field);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Sección de búsqueda y creación de formulario */}
      <div className="mb-4 flex justify-end items-center">
        <input
          type="text"
          placeholder="Buscar Formulario"
          className="w-1/3 p-2 border border-gray-300 rounded mr-2"
        />
        <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Crear Formulario
        </button>
      </div>

      {/* Diseño principal */}
      <div className="flex">
        {/* Barra lateral izquierda (Paleta de elementos) */}
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 mr-4">
          {["Elementos", "Selección", "Avanzados"].map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-2 mt-4">{category}</h3>
              {elements
                .filter((element) => element.category === category)
                .map((element) => (
                  <div
                    key={element.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, element.id)}
                    className="p-2 mb-2 bg-gray-100 rounded cursor-move"
                  >
                    {element.icon} {element.label}
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Centro (Área de vista previa) */}
        <div className="w-2/4 p-4 mx-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
          <div className="flex justify-end mb-4">
            <button className="mr-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Crear Borrador
            </button>
            <button className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Publicar
            </button>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="min-h-[400px] border-dashed border-2 border-gray-300 p-4 text-gray-500"
          >
            {formFields.length === 0
              ? "Arrastra campos desde la paleta para construir tu formulario"
              : formFields.map((field) => (
                  <div
                    key={field.id}
                    onClick={() => handleFieldSelect(field)}
                    className="p-2 mb-2 bg-blue-100 rounded cursor-pointer"
                  >
                    {field.type}
                  </div>
                ))}
          </div>
        </div>

        {/* Derecha (Panel de propiedades) */}
        <div className="w-1/4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Propiedades Del Campo</h3>
          {selectedField ? (
            <div>
              <p>Editando: {selectedField.type}</p>
              {/* Agregar campos de edición de propiedades aquí */}
            </div>
          ) : (
            <p className="text-gray-500">Selecciona un campo para editar sus propiedades</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;