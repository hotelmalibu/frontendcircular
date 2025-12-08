import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Tag,
} from "lucide-react";
import { getAllCategories, deleteCategory } from "../../../../../api/categoriesApi";
import CategoryFormModal from "./CategoryFormModal";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategoriesData();
  }, [searchTerm, categories]);

  const loadCategories = async () => {
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
        // If it's a single object, wrap it in an array
        categoriesArray = response ? [response] : [];
      }

      setCategories(categoriesArray);
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar las categorías");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCategoriesData = () => {
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
  };

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

  const handleDelete = async (categoryId) => {
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      await loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Error al eliminar la categoría");
    }
  };

  const handleFormSuccess = () => {
    setShowFormModal(false);
    loadCategories();
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
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-500 mt-1">Administra las categorías de las noticias</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all shadow-sm font-medium"
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 border border-gray-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
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

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-gray-400" size={24} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No se encontraron categorías</h3>
          <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-transparent hover:border-gray-200 transition-all duration-300 flex flex-col"
            >
              {/* Category Header */}
              <div className="flex justify-between items-start gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <Tag className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm mb-6 flex-grow leading-relaxed">
                {category.description || "Sin descripción disponible..."}
              </p>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end items-center gap-3 mt-auto">
                <button
                  onClick={() => handleEdit(category)}
                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Edit size={20} className="stroke-[1.5]" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
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

      <div className="mt-6 text-center text-sm text-gray-400">
        Mostrando {filteredCategories.length} resultados
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
    </div>
  );
}