import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  Tag,
  FolderOpen
} from "lucide-react";
import { getAllCategories, deleteCategory } from "../../../../../api/categoriesApi";
import { stripHtml } from "../../../../../utils/textUtils";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmModal from "../../../../../components/common/ConfirmModal";
import { toast } from "react-hot-toast";

// --- PALETA DE COLORES VISIÓN CIRCULAR ---
const BRAND = {
  blue: "#2C67B0",       // Azul Principal
  darkBlue: "#005380",   // Azul Logo/Profundo
  lightBlue: "#7FB8D9",  // Azul Claro
  green: "#B1D357",      // Verde Principal (Claro)
  darkGreen: "#8CB200",  // Verde Secundario
  orange: "#E15200",     // Naranja (Alertas)
  yellow: "#E8AD00",     // Amarillo
  gray: "#6B7280",
};

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const loadCategories = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllCategories();

      let categoriesArray = [];
      if (response?.data?.items && Array.isArray(response.data.items)) {
        categoriesArray = response.data.items;
      } else if (Array.isArray(response)) {
        categoriesArray = response;
      } else if (response?.data && Array.isArray(response.data)) {
        categoriesArray = response.data;
      } else if (response?.categories && Array.isArray(response.categories)) {
        categoriesArray = response.categories;
      } else {
        categoriesArray = response ? [response] : [];
      }

      setCategories(categoriesArray);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las categorías");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const executeDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteCategory(itemToDelete.id);
      toast.success("Categoría eliminada correctamente");
      await loadCategories();
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al eliminar la categoría");
    }
  };

  const filterCategoriesData = React.useCallback(() => {
    if (!Array.isArray(categories)) {
      setFilteredCategories([]);
      return;
    }

    let filtered = [...categories];
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
  }, [categories, searchTerm]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    filterCategoriesData();
  }, [searchTerm, categories, filterCategoriesData]);

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDelete = (category) => {
    setItemToDelete(category);
    setShowDeleteModal(true);
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadCategories();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 mb-4" style={{ borderColor: BRAND.blue }}></div>
        <p className="text-gray-500 font-medium">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-700">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: BRAND.darkBlue }}>Gestión de Categorías</h1>
          <p className="text-gray-500 mt-1">Administra las etiquetas y clasificaciones de contenido</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 text-white rounded-xl shadow-md hover:shadow-lg transition-all font-bold text-sm transform active:scale-95"
          style={{ backgroundColor: BRAND.blue }}
        >
          <Plus size={20} />
          Nueva Categoría
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm mb-8 border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:border-transparent outline-none transition-all text-gray-700"
            style={{ "--tw-ring-color": BRAND.lightBlue }}
          />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle size={20} style={{ color: BRAND.orange }} />
          <span>{error}</span>
        </div>
      )}

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 bg-gray-50">
            <FolderOpen className="text-gray-400" size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron categorías</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Intenta ajustar los filtros de búsqueda o crea una nueva categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-lg border border-gray-100 hover:border-blue-200 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
            >
              {/* Borde Superior de Acento */}
              <div
                className="h-1.5 w-full absolute top-0 left-0"
                style={{ backgroundColor: BRAND.green }}
              ></div>

              <div className="p-6 flex-1 flex flex-col">
                {/* Category Header */}
                <div className="flex justify-between items-start gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                      <Tag size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-blue-700 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed line-clamp-3">
                  {stripHtml(category.description) || "Sin descripción disponible..."}
                </p>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-gray-50 flex justify-end items-center gap-2 mt-auto">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(category)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-200 pt-6">
        Mostrando <span className="font-bold text-gray-600">{filteredCategories.length}</span> categorías
      </div>

      {/* Modal */}
      {showFormModal && (
        <CategoryFormModal
          categoryData={selectedCategory}
          isEditing={isEditing}
          onClose={() => setShowFormModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={executeDelete}
        title="Eliminar Categoría"
        message={`¿Está seguro que desea eliminar la categoría "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
}