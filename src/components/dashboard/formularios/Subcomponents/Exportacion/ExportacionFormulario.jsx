import React, { useState, useEffect, useCallback } from "react";
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Calendar, 
  BarChart3, 
  ClipboardList,
  Loader2,
  AlertCircle
} from "lucide-react";
import formsApi from "../../../../../api/formsApi";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";



export default function ExportacionFormulario() {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formsApi.listForms({ 
        search: searchTerm, 
        category: selectedCategory !== "all" ? selectedCategory : undefined 
      });
      const body = response.data || response;
      const list = body.forms || body.data?.forms || (Array.isArray(body) ? body : []);
      setForms(Array.isArray(list) ? list : []);
      setError(null);
    } catch (err) {
      console.error("Error fetching forms for export:", err);
      setError("No se pudieron cargar los formularios. Por favor, intenta de nuevo.");
      toast.error("Error al cargar formularios");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleExportExcel = async (formId, formName) => {
    const toastId = toast.loading(`Preparando exportación para "${formName}"...`);
    
    try {
      // 1. Obtener los datos del formulario (estructura) y las respuestas
      const [formRes, responsesRes] = await Promise.all([
        formsApi.getForm(formId),
        formsApi.getFormResponses(formId, { page: 1, per_page: 500 }) // Intentamos traer bastantes de una vez
      ]);

      const formBody = formRes.data || formRes;
      const form = formBody.form || formBody.data || formBody;
      const formFields = form.fields || [];
      
      const body = responsesRes.data || responsesRes;
      let allResponses = body.data || (Array.isArray(body) ? body : []);
      const meta = body.meta || {};
      
      // 2. Obtener todas las páginas restantes si existen (si hay más de 500)
      if (meta.last_page > 1) {
        const promises = [];
        for (let p = 2; p <= meta.last_page; p++) {
          promises.push(formsApi.getFormResponses(formId, { page: p, per_page: 500 }));
        }
        
        const results = await Promise.all(promises);
        results.forEach(res => {
          const pageBody = res.data || res;
          const pageData = pageBody.data || (Array.isArray(pageBody) ? pageBody : []);
          allResponses = [...allResponses, ...pageData];
        });
      }

      if (allResponses.length === 0) {
        toast.error("No hay respuestas para exportar", { id: toastId });
        return;
      }

      // 3. Normalizar los datos para el Excel
      const excelData = allResponses.map(submission => {
        const row = {
          "ID Respuesta": submission.id,
          "Fecha de Envío": submission.submitted_at ? new Date(submission.submitted_at).toLocaleString() : 'N/A',
          "Usuario": submission.user?.name || 
                     (submission.user?.first_name ? `${submission.user.first_name} ${submission.user.last_name || ''}` : null) || 
                     submission.submitted_by_name || 
                     submission.submitted_by || 
                     "Anónimo"
        };

        // Mapear cada campo/pregunta usando la definición del formulario
        formFields.forEach(field => {
          // 1. Identificar el tipo de campo de forma robusta y filtrar inmediatamente
          const typeSlug = String(field.field_type?.slug || field.type_slug || field.type || field.fieldType?.slug || 'text').toLowerCase();
          
          // FILTRO ESTRICTO: Solo preguntas reales. 
          const excludedTypes = [
            'title', 'paragraph', 'section', 'divider', 'spacer', 'image', 'video', 'header', 'rich_text',
            'image-display', 'video-display', 'section-break', 'title-display'
          ];
          
          if (excludedTypes.includes(typeSlug)) {
            return;
          }

          // Buscamos la respuesta correspondiente a este campo
          const fieldSubmission = submission.field_submissions?.find(fs => 
            String(fs.form_field_id) === String(field.id) || 
            String(fs.field?.id) === String(field.id) ||
            String(fs.field_id) === String(field.id)
          );

          let rawValue = fieldSubmission?.value;
          const questionLabel = field.label || field.name || `Pregunta ${field.id}`;

          if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
            let fieldOptions = field.options || {};
            if (typeof fieldOptions === 'string') {
              try { fieldOptions = JSON.parse(fieldOptions); } catch(e) {}
            }
            const choices = (fieldOptions.choices || fieldOptions.options || []).filter(Boolean);

            if (typeSlug.includes('grid')) {
              // --- CASO ESPECIAL: GRID (FLATTENED) ---
              try {
                const data = (typeof rawValue === 'string') ? JSON.parse(rawValue) : rawValue;
                const rows = fieldOptions.rows || [];
                const columns = fieldOptions.columns || [];
                
                if (rows.length > 0 && columns.length > 0) {
                  rows.forEach(r => {
                    const rowColHeader = `${questionLabel} [${r.label}]`;
                    const cellVal = (data && typeof data === 'object') 
                      ? (data[r.id] ?? data[String(r.id)] ?? data[r.label] ?? data[r.name] ?? null)
                      : null;

                    if (cellVal === null || cellVal === undefined || cellVal === "") {
                      row[rowColHeader] = "";
                    } else {
                      const cellArray = Array.isArray(cellVal) ? cellVal : [cellVal];
                      const labels = cellArray.map(cv => {
                        const col = columns.find(c => 
                          String(c.id) === String(cv) || 
                          String(c.value) === String(cv) || 
                          String(c.label) === String(cv)
                        );
                        return col ? col.label : cv;
                      }).filter(Boolean);
                      
                      row[rowColHeader] = labels.join(", ") || "";
                    }
                  });
                  return; // Terminamos con este campo ya que se expandió en varias columnas
                }
              } catch (e) {
                row[questionLabel] = String(rawValue);
                return;
              }
            }

            // --- CASO ESTÁNDAR: OTROS CAMPOS ---
            let value = "";
            if (choices.length > 0) {
              // Mapeo de select/radio/checkbox simple con opciones
              if (Array.isArray(rawValue)) {
                value = rawValue.map(v => {
                  const choice = choices.find(c => String(c.id) === String(v) || String(c.value) === String(v) || String(c.label) === String(v));
                  return choice ? choice.label : v;
                }).join(", ");
              } else {
                const choice = choices.find(c => String(c.id) === String(rawValue) || String(c.value) === String(rawValue) || String(c.label) === String(rawValue));
                value = choice ? choice.label : rawValue;
              }
            } else if (typeSlug === 'checkbox') {
              // Checkbox simple sin opciones (booleano)
              value = (String(rawValue) === "1" || rawValue === true || String(rawValue) === "true") ? "Sí" : "No";
            } else if (Array.isArray(rawValue)) {
              value = rawValue.join(", ");
            } else if (typeSlug === 'file') {
              value = fieldSubmission.file_url || rawValue;
            } else {
              value = String(rawValue);
            }
            row[questionLabel] = value;
          } else {
            // Si no hay respuesta, dejamos la celda vacía
            if (!typeSlug.includes('grid')) {
              row[questionLabel] = "";
            } else {
              // Para grids vacíos, también creamos las columnas vacías
              let fieldOptions = field.options || {};
              if (typeof fieldOptions === 'string') { try { fieldOptions = JSON.parse(fieldOptions); } catch(e) {} }
              const rows = fieldOptions.rows || [];
              rows.forEach(r => { row[`${questionLabel} [${r.label}]`] = ""; });
            }
          }
        });

        return row;
      });

      // 4. Crear el libro de Excel
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Ajustar anchos de columna automáticamente
      const wscols = Object.keys(excelData[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Respuestas");

      // 5. Generar el archivo y descargar
      const cleanFormName = formName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const fileName = `${cleanFormName}_respuestas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Excel generado correctamente", { id: toastId });
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      toast.error("Error al generar el archivo Excel. Verifica tu conexión.", { id: toastId });
    }
  };

  const categories = [
    { id: "all", label: "Todos", icon: <ClipboardList size={16} /> },
    { id: "encuesta", label: "Encuestas", icon: <BarChart3 size={16} /> },
    { id: "normativo", label: "Normativos", icon: <ClipboardList size={16} /> },
    { id: "periodico", label: "Periódicos", icon: <Calendar size={16} /> },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Header Interactivo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <FileSpreadsheet className="text-green-600" size={24} />
            </div>
            Exportación de Datos
          </h2>
          <p className="text-gray-500">
            Descarga los resultados de tus formularios en formato Microsoft Excel para análisis detallado.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Selector de Categoría Estilizado */}
          <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200 w-full md:w-auto overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? "bg-white text-blue-600 shadow-sm ring-1 ring-gray-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Grid de Formularios */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-500 font-medium">Buscando formularios disponibles...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 bg-red-50 rounded-3xl border border-red-100 text-center space-y-4">
          <div className="p-4 bg-white rounded-2xl shadow-sm text-red-500">
            <AlertCircle size={40} />
          </div>
          <div className="max-w-md">
            <p className="text-red-800 font-bold text-lg">{error}</p>
            <button 
              onClick={fetchForms}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold shadow-sm"
            >
              Reintentar carga
            </button>
          </div>
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-center">
          <div className="p-5 bg-gray-50 rounded-full text-gray-300 mb-6">
            <ClipboardList size={60} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">No se encontraron formularios</h3>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            No hay formularios que coincidan con tus filtros o aún no se han creado formularios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {forms.map((form) => (
            <div 
              key={form.ulid || form.id} 
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
            >
              {/* Card Header con Badge de Categoría */}
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    form.category === 'encuesta' ? 'bg-purple-100 text-purple-700' :
                    form.category === 'normativo' ? 'bg-blue-100 text-blue-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {form.category || 'General'}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${form.status === 'published' ? 'bg-green-500 ring-4 ring-green-100' : 'bg-gray-300 ring-4 ring-gray-50'}`} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-base text-gray-900 leading-snug line-clamp-3 min-h-[4rem] group-hover:text-blue-600 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={12} />
                    Actualizado: {new Date(form.updated_at).toLocaleDateString()}
                  </p>
                </div>

                {/* Mini Estadísticas */}
                <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tight">Respuestas</p>
                    <p className="text-lg font-black text-gray-800">{form.submissions_count || 0}</p>
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[10px] uppercase text-gray-400 font-bold tracking-tight">Estado</p>
                    <p className={`text-sm font-bold ${form.status === 'published' ? 'text-green-600' : 'text-gray-500'}`}>
                      {form.status === 'published' ? 'Publicado' : 'Borrador'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acciones de la Card */}
              <div className="p-4 bg-gray-50/50 group-hover:bg-white transition-colors">
                <div className="flex flex-nowrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-tighter shrink-0">
                    <Download size={14} className="text-gray-300" />
                    XLS
                  </div>
                  <button 
                    onClick={() => handleExportExcel(form.ulid || form.id, form.title)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-green-700 border border-green-200 rounded-xl shadow-sm hover:bg-green-600 hover:text-white hover:border-green-600 transition-all font-bold text-xs md:text-sm group/btn disabled:opacity-50"
                    disabled={!form.submissions_count || form.submissions_count === 0}
                    title={!form.submissions_count ? "Sin respuestas para exportar" : "Descargar Excel"}
                  >
                    <span>Exportar</span>
                    <Download size={16} className="group-hover/btn:translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-6 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-start gap-4">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">Nota de Exportación</p>
          <p className="text-sm text-blue-800/80 leading-relaxed">
            Las exportaciones solo se generan para formularios que tengan <strong>al menos una respuesta registrada</strong>. 
            El archivo Excel incluirá todas las preguntas, metadatos de usuario (si aplica) y marcas de tiempo de envío.
          </p>
        </div>
      </div>
    </div>
  );
}
