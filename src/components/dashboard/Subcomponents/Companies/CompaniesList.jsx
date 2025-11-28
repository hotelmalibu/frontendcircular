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
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { getAllCompanies, deleteCompany } from "../../../../api/companiesApi";
import CompanyFormModal from "./CompanyFormModal";
import CompanyDetailModal from "./CompanyDetailModal";

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
    per_page: 15,
    total: 0
  });
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, [currentPage]);

  useEffect(() => {
    filterCompaniesData();
  }, [searchTerm, companies]);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAllCompanies(currentPage, pagination.per_page, 'created_at', 'desc');
      
      let companiesArray = [];
      
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
              last_page: response.meta.last_page || Math.ceil(response.meta.total / (prev.per_page || 15)),
              current_page: response.meta.current_page || 1
            }));
          }
        }
      }

      setCompanies(companiesArray);
    } catch (err) {
      console.error("❌ Error loading companies:", err);
      setError(err.response?.data?.message || "Error al cargar las empresas");
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCompaniesData = () => {
    if (!Array.isArray(companies)) {
      setFilteredCompanies([]);
      return;
    }
    
    let filtered = [...companies];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCompanies(filtered);
  };

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

  const handleDelete = async (companyId) => {
    if (!window.confirm("¿Está seguro de eliminar esta empresa?")) {
      return;
    }

    try {
      await deleteCompany(companyId);
      await loadCompanies();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la empresa");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    setCurrentPage(1);
    loadCompanies();
    setTimeout(() => {
      alert(isEditing ? "Empresa actualizada correctamente" : "Empresa creada correctamente");
    }, 100);
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      
      {/* ESPACIADOR GRANDE: 
          He colocado este div con h-24 (aprox 100px) en móviles 
          y h-32 (aprox 128px) en pantallas grandes para bajar el contenido.
          Puedes aumentar el número (h-40, h-48) si necesitas bajarlo aún más.
      */}
      <div className="w-full h-24 md:h-32"></div>

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empresas</h1>
          <p className="text-gray-500 mt-2 text-lg">Administra las empresas registradas en la plataforma</p>
        </div>
        <button
          onClick={handleCreate}
          className="w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-xl font-bold text-lg"
        >
          <Plus size={24} />
          Crear Nueva Empresa
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, descripción, email o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-transparent focus:bg-white border focus:border-green-500 rounded-xl outline-none transition-all text-gray-700"
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Building className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">No se encontraron empresas</h3>
          <p className="text-gray-500 mb-8">Comienza agregando tu primera empresa a la plataforma</p>
          <button
            onClick={handleCreate}
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg font-semibold text-lg"
          >
            <Plus size={22} />
            Crear Primera Empresa
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Company Logo */}
              <div className="flex justify-center mb-4">
                {item.logo && item.logo.url ? (
                  <img
                    src={item.logo.url}
                    alt={`Logo de ${item.name}`}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className={`w-16 h-16 bg-gray-100 rounded-xl border border-gray-100 flex items-center justify-center ${item.logo && item.logo.url ? 'hidden' : ''}`}
                >
                  <Building className="text-gray-400" size={24} />
                </div>
              </div>

              {/* Card Header */}
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.name}
                </h3>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                {item.description ? 
                  item.description.replace(/<[^>]+>/g, '').slice(0, 120) + (item.description.length > 120 ? '...' : '')
                  : "Sin descripción disponible..."
                }
              </p>

              {/* Company Details */}
              <div className="space-y-2 mb-4">
                {/* Phone */}
                {item.phone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{item.phone}</span>
                  </div>
                )}

                {/* Email */}
                {item.email && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Mail size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{item.email}</span>
                  </div>
                )}

                {/* Website */}
                {item.website_url && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Globe size={14} className="text-gray-400 flex-shrink-0" />
                    <a 
                      href={item.website_url.startsWith('http') ? item.website_url : `https://${item.website_url}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 truncate flex items-center gap-1"
                    >
                      <span className="truncate">{item.website_url.replace(/^https?:\/\//, '')}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Address */}
                {item.address && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">{item.address}</span>
                  </div>
                )}

                {/* Products Count */}
                {item.products && item.products.length > 0 && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Package size={14} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-600">
                      {item.products.length} producto{item.products.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {/* Created Date */}
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Clock size={14} />
                <span className="text-xs">
                  Creada el {formatDate(item.created_at)}
                </span>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-auto">
                <button
                  onClick={() => handleView(item)}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Ver detalle"
                >
                  <Eye size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={20} className="stroke-[1.5]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded-lg ${
                  page === currentPage
                    ? "bg-green-600 text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.last_page}
            className="px-3 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Mostrando {filteredCompanies.length} de {pagination.total} empresas
      </div>

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
    </div>
  );
}