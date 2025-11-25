# News Management Components

Sistema completo de gestión de noticias para la plataforma EcoCircular.

## 📁 Estructura de Archivos

```
src/
├── api/
│   └── newsApi.js                    # Servicio API para noticias
└── components/
    └── dashboard/
        └── comunicaciones/
            ├── News.jsx              # Componente principal wrapper
            └── Subcomponents/
                └── News/
                    ├── index.jsx              # Punto de entrada
                    ├── NewsList.jsx           # Lista y tabla de noticias
                    ├── NewsFormModal.jsx      # Modal para crear/editar
                    └── NewsDetailModal.jsx    # Modal de detalles
```

## 🚀 Características

### NewsList Component
- ✅ Listado completo de noticias en tabla
- ✅ Búsqueda en tiempo real (título, descripción, autor, categoría)
- ✅ Filtros por tipo (news/event) y estado (published/draft)
- ✅ Acciones CRUD: Ver, Crear, Editar, Eliminar
- ✅ Badges visuales para tipo y estado
- ✅ Formato de fechas en español
- ✅ Manejo de estados de carga y errores

### NewsFormModal Component
- ✅ Formulario completo para crear/editar noticias
- ✅ Validación de campos requeridos
- ✅ Campos de fecha con datetime-local
- ✅ Validación de fechas (fin > inicio)
- ✅ Soporte para tipos: news, event
- ✅ Estados: draft, published
- ✅ Información contextual sobre fechas

- ### Editor de Texto Enriquecido
- ✅ Soporte para edición WYSIWYG de la descripción (`description`) usando CKEditor 5 (Classic build).
- ✅ Formatos disponibles: encabezados (H1/H2/H3), negritas, cursivas, subrayado, listas ordenadas y viñetas, sangrías y tamaño de fuente.
- ✅ El HTML resultante se guarda en `description` y se renderiza limpiamente en la vista pública y en el detalle de la noticia (sanitizado con DOMPurify).

Dependencias requeridas (instalación):
```bash
npm install @ckeditor/ckeditor5-build-classic dompurify
```

### NewsDetailModal Component
- ✅ Vista detallada de la noticia
- ✅ Visualización de todos los campos
- ✅ Badges de estado y tipo
- ✅ Indicador de noticia activa
- ✅ Botón de edición rápida
- ✅ Formato de fechas completo

## 📊 Modelo de Datos

```json
{
  "type": "news",                          // "news" | "event"
  "title": "New Recycling Program 2025",   // Requerido
  "description": "Full article content...", // Opcional
  "category": "Environment",                // Opcional
  "author": "John Doe",                     // Opcional
  "start_date": "2025-10-16T10:00:00",     // Opcional (ISO 8601)
  "end_date": "2025-10-17T10:00:00",       // Opcional (ISO 8601)
  "published_at": "2025-10-16T12:00:00",   // Opcional (ISO 8601)
  "status": "published"                     // "draft" | "published"
}
```

## 🔌 API Endpoints

### Base URL
```
https://api-ecocircular.creativostecnologicosit.com/api
```

### Endpoints Disponibles

#### GET /news
Obtener todas las noticias
```javascript
import { getAllNews } from '../api/newsApi';

const news = await getAllNews();
```

#### GET /news/:id
Obtener una noticia específica
```javascript
import { getNewsById } from '../api/newsApi';

const news = await getNewsById(newsId);
```

#### POST /news
Crear una nueva noticia
```javascript
import { createNews } from '../api/newsApi';

const newNews = await createNews({
  type: "news",
  title: "Mi Noticia",
  description: "Contenido...",
  status: "draft"
});
```

#### PUT /news/:id
Actualizar una noticia existente
```javascript
import { updateNews } from '../api/newsApi';

const updated = await updateNews(newsId, {
  title: "Título Actualizado",
  status: "published"
});
```

#### DELETE /news/:id
Eliminar una noticia
```javascript
import { deleteNews } from '../api/newsApi';

await deleteNews(newsId);
```

## 💻 Uso

### Integración en el Dashboard

El componente ya está integrado en el módulo de Comunicaciones:

```jsx
// src/modules/dashboard/Comunicaciones.jsx
import News from "../../components/dashboard/comunicaciones/News";

const tabs = [
  { name: "Dashboard", component: <Dashboard /> },
  { name: "Noticias", component: <News /> },  // ← Nueva pestaña
  // ... otros tabs
];
```

### Uso Independiente

```jsx
import News from './components/dashboard/comunicaciones/News';

function App() {
  return <News />;
}
```

## 🎨 Estilos y UI

- **Framework CSS**: Tailwind CSS
- **Iconos**: Lucide React
- **Colores principales**:
  - Verde: `#10b981` (acciones principales)
  - Azul: `#3b82f6` (información)
  - Rojo: `#ef4444` (eliminación)
  - Amarillo: `#f59e0b` (borradores)

## 🔐 Autenticación

Los componentes utilizan el token de autenticación almacenado en `localStorage`:

```javascript
// El interceptor de axios agrega automáticamente el token
const token = localStorage.getItem("token");
config.headers.Authorization = `Bearer ${token}`;
```

## 📝 Validaciones

### Campos Requeridos
- `type`: Debe ser "news" o "event"
- `title`: No puede estar vacío
- `status`: Debe ser "draft" o "published"

### Validaciones de Fechas
- `end_date` debe ser posterior a `start_date`
- Las fechas se envían en formato ISO 8601

## 🐛 Manejo de Errores

Los componentes manejan errores de forma consistente:

```javascript
try {
  await createNews(data);
  alert("Noticia creada exitosamente");
} catch (err) {
  const errorMessage = err.response?.data?.message || "Error al crear la noticia";
  alert(errorMessage);
  console.error("Error:", err);
}
```

## 🔄 Estados del Componente

### NewsList
- `loading`: Cargando datos
- `error`: Error al cargar
- `news`: Array de noticias
- `filteredNews`: Noticias filtradas
- `searchTerm`: Término de búsqueda
- `filterType`: Filtro por tipo
- `filterStatus`: Filtro por estado

## 📱 Responsive Design

Los componentes son completamente responsive:
- **Desktop**: Tabla completa con todas las columnas
- **Tablet**: Grid adaptativo
- **Mobile**: Cards apiladas (puede requerir ajustes adicionales)

## 🚦 Estados de Noticia

### Published (Publicado)
- Badge verde con ícono de check
- Visible para usuarios finales
- Requiere `published_at` <= fecha actual

### Draft (Borrador)
- Badge amarillo con ícono de reloj
- Solo visible en el dashboard
- No requiere fecha de publicación

### Active (Activa)
- Publicada Y no expirada
- `published_at` <= ahora
- `end_date` > ahora (o null)

## 🛠️ Personalización

### Agregar Nuevos Campos

1. Actualizar el modelo en `NewsFormModal.jsx`:
```jsx
const [formData, setFormData] = useState({
  // ... campos existentes
  newField: "",
});
```

2. Agregar el campo en el formulario
3. Actualizar la vista de detalles en `NewsDetailModal.jsx`

### Cambiar Estilos

Los componentes usan clases de Tailwind CSS que pueden ser personalizadas:

```jsx
// Cambiar color del botón principal
className="bg-green-600 hover:bg-green-700"
// a
className="bg-blue-600 hover:bg-blue-700"
```

## 📦 Dependencias

```json
{
  "axios": "^1.x.x",
  "react": "^18.x.x",
  "lucide-react": "^0.x.x"
}
```

## 🤝 Contribución

Para agregar nuevas funcionalidades:

1. Crear un nuevo componente en `Subcomponents/News/`
2. Importarlo en `index.jsx`
3. Actualizar este README

## 📄 Licencia

Este código es parte del proyecto EcoCircular.

---

**Desarrollado para**: EcoCircular Platform  
**Última actualización**: Noviembre 2025
