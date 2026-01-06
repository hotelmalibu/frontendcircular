import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Package,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react";
import { getAllCompanies, deleteCompany } from "../../../../api/companiesApi";
import toast from "react-hot-toast";
import CompanyFormModal from "./CompanyFormModal";
import CompanyDetailModal from "./CompanyDetailModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  red: "#DC2626",        // Rojo estándar (Eliminar)
  gray: "#6B7280",
};

export default function CompaniesList() {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 8,
    total: 0
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCompanies = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllCompanies(currentPage, pagination.per_page, 'created_at', 'desc');

      let companiesArray = [];

      // Lógica de extracción de datos (Mantenida igual para robustez)
      if (response?.data?.items && Array.isArray(response.data.items)) {
        companiesArray = response.data.items;
        if (response.data.pagination) setPagination(response.data.pagination);
      } else if (response?.data?.companies && Array.isArray(response.data.companies)) {
        companiesArray = response.data.companies;
        if (response.data.pagination) setPagination(response.data.pagination);
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        companiesArray = response.data.data;
        if (response.data.pagination) setPagination(response.data.pagination);
      } else if (response?.data && Array.isArray(response.data)) {
        companiesArray = response.data;
      } else if (Array.isArray(response)) {
        companiesArray = response;
      } else if (typeof response === 'object' && response !== null) {
        const possibleArrays = Object.entries(response).filter(([key, value]) => {
          if (key === 'pagination' || key === 'meta' || key === 'links') return false;
          return Array.isArray(value) && value.length > 0;
        });
        if (possibleArrays.length > 0) {
          companiesArray = possibleArrays[0][1];
        }
        if (response.meta && typeof response.meta === 'object') {
          if (response.meta.total !== undefined) {
            setPagination(prev => ({
              ...prev,
              total: response.meta.total,
              last_page: response.meta.last_page || Math.ceil(response.meta.total / (prev.per_page || 8)),
              current_page: response.meta.current_page || 1
            }));
          }
        }
      }

      setCompanies(companiesArray);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError("Error al conectar con el servidor");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pagination.per_page]);

  const filterCompaniesData = React.useCallback(() => {
    if (!Array.isArray(companies)) {
      setFilteredCompanies([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredCompanies(companies);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = companies.filter(c =>
      (c.name?.toLowerCase().includes(term)) ||
      (c.description?.toLowerCase().includes(term)) ||
      (c.email?.toLowerCase().includes(term)) ||
      (c.address?.toLowerCase().includes(term))
    );
    setFilteredCompanies(filtered);
  }, [searchTerm, companies]);

  useEffect(() => {
    loadCompanies();
  }, [currentPage, loadCompanies]);

  useEffect(() => {
    filterCompaniesData();
  }, [searchTerm, companies, filterCompaniesData]);

  const handleCreate = () => {
    setSelectedCompany(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (companyItem) => {
    setSelectedCompany(companyItem);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleView = (companyItem) => {
    setSelectedCompany(companyItem);
    setShowDetailModal(true);
  };

  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!companyToDelete) return;

    try {
      setIsDeleting(true);
      await deleteCompany(companyToDelete.id);
      await loadCompanies();
      setShowDeleteModal(false);
      setCompanyToDelete(null);
      toast.success("Empresa eliminada correctamente");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar la empresa");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setCurrentPage(1);
    loadCompanies();
    toast.success(isEditing ? "Empresa actualizada correctamente" : "Empresa creada correctamente");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando directorio...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-sans text-gray-700">

      {/* ESPACIADOR SUPERIOR */}
      <div className="w-full "></div>

      {/* Encabezado */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        {/* Encabezado de Sección */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3" style={{ color: BRAND.darkBlue }}>
            <Building className="text-blue-400" size={32} />
            Directorio Circularmente
          </h1>
          <p className="text-gray-500 mt-2 text-lg ml-11">
            Gestión de aliados estratégicos y organizaciones registradas
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.darkGreen }}
        >
          <Plus size={20} />
          Registrar Empresa
        </button>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-700"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition w-full justify-center">
            <Filter size={18} /> <span className="text-sm font-medium">Filtros</span>
          </button>
        </div>
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} className="flex-shrink-0" style={{ color: BRAND.orange }} />
          <span>{error}</span>
        </div>
      )}

      {/* Grid de Empresas */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
            <Building className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron empresas</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">No hay resultados para tu búsqueda o aún no has registrado ninguna empresa.</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-lg font-semibold transition hover:opacity-90"
            style={{ backgroundColor: BRAND.blue }}
          >
            <Plus size={20} />
            Crear Primera Empresa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompanies.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Borde superior decorativo */}
              <div className="h-1.5 w-full absolute top-0 left-0" style={{ backgroundColor: BRAND.blue }}></div>

              <div className="p-5 flex-1 flex flex-col">
                {/* Cabecera de la Tarjeta */}
                <div className="flex justify-between items-start mb-4">
                  <div className="w-14 h-14 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 bg-gray-50">
                    {item.logo && item.logo.url ? (
                      <img
                        src={item.logo.url}
                        alt={`Logo ${item.name}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className={`flex items-center justify-center w-full h-full ${item.logo && item.logo.url ? 'hidden' : ''}`}>
                      <Building size={24} style={{ color: BRAND.lightBlue }} />
                    </div>
                  </div>

                  {/* Badge de fecha */}
                  <div className="flex items-center gap-1 text-[10px] bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                    <Clock size={10} />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                {/* Información Principal */}
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-blue-700 transition-colors">
                  {item.name}
                </h3>

                <p className="text-xs text-gray-500 mb-4 line-clamp-3 leading-relaxed flex-grow">
                  {item.description ?
                    item.description.replace(/<[^>]+>/g, '').slice(0, 100) + (item.description.length > 100 ? '...' : '')
                    : "Sin descripción registrada."
                  }
                </p>

                {/* Detalles de Contacto */}
                <div className="space-y-2 mb-4 border-t border-gray-100 pt-3">
                  {item.email && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate" title={item.email}>
                      <Mail size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.email}</span>
                    </div>
                  )}
                  {item.phone && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                      <Phone size={12} className="text-gray-400 flex-shrink-0" />
                      <span>{item.phone}</span>
                    </div>
                  )}
                  {item.address && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                      <MapPin size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{item.address}</span>
                    </div>
                  )}
                  {item.website_url && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                      <Globe size={12} className="text-gray-400 flex-shrink-0" />
                      <a href={item.website_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                        Web Oficial
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer de Acciones */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                  <Package size={14} style={{ color: BRAND.darkGreen }} />
                  <span>{item.products ? item.products.length : 0} Productos</span>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => handleView(item)}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Ver detalle"
                    style={{ color: BRAND.blue }}
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Editar"
                    style={{ color: BRAND.darkGreen }}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item)}
                    className="p-1.5 rounded-lg hover:bg-white hover:shadow-sm transition"
                    title="Eliminar"
                    style={{ color: BRAND.orange }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginación Estilizada */}
      {pagination.last_page > 1 && (
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Mostrando <span className="font-bold">{filteredCompanies.length}</span> de <span className="font-bold">{pagination.total}</span> empresas
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none no-scrollbar">
              {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${page === currentPage
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100 border border-transparent"
                    }`}
                  style={page === currentPage ? { backgroundColor: BRAND.blue } : {}}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.last_page}
              className="p-2 rounded-lg border border-gray-300 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {showFormModal && (
        <CompanyFormModal
          companyData={selectedCompany}
          isEditing={isEditing}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDetailModal && selectedCompany && (
        <CompanyDetailModal
          companyData={selectedCompany}
          onClose={() => setShowDetailModal(false)}
          onEdit={() => {
            setShowDetailModal(false);
            handleEdit(selectedCompany);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        companyName={companyToDelete?.name || "esta empresa"}
        loading={isDeleting}
      />
    </div>
  );
}