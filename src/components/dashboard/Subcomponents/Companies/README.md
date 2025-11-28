# Gestión de Empresas - Dashboard EcoCircular

## Descripción
Sistema completo de CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de empresas en el dashboard de EcoCircular. Permite administrar empresas con sus logos, información de contacto y productos asociados.

## Funcionalidades Implementadas

### ✅ CRUD Completo de Empresas
- **Crear**: Nueva empresa con logo y información completa
- **Leer**: Lista y vista detallada de empresas
- **Actualizar**: Edición de información y logo
- **Eliminar**: Eliminación con confirmación

### ✅ Características
- Subida y gestión de logos de empresas
- Información de contacto completa (teléfono, email, sitio web, dirección)
- Gestión de productos asociados
- Búsqueda por múltiples campos
- Paginación
- Interfaz responsive
- Validación de formularios
- Vista previa de logos
- Diseño consistente con la arquitectura existente

## Estructura de Archivos

```
src/
├── api/
│   └── companiesApi.js              # API para operaciones de empresas
├── components/
│   ├── dashboard/
│   │   ├── Companies.jsx            # Componente principal
│   │   └── Subcomponents/
│   │       └── Companies/
│   │           ├── index.jsx        # Punto de entrada
│   │           ├── CompaniesList.jsx # Lista de empresas
│   │           ├── CompanyFormModal.jsx # Modal crear/editar
│   │           └── CompanyDetailModal.jsx # Modal detalles
│   └── Sidebar.jsx                  # Sidebar actualizado
├── modules/dashboard/
│   └── Empresas.jsx                 # Módulo del dashboard
└── App.js                           # Rutas configuradas
```

## Endpoint de la API
- **URL Base**: `https://api-ecocircular.creativostecnologicosit.com/api/companies`
- **Métodos**: GET, POST, PUT, DELETE
- **Autenticación**: Bearer Token

## Estructura de Datos de Empresa

```json
{
  "id": "01kb47kfdy0spdb3h651rz1zg7",
  "name": "EcoEmpresa S.A.S",
  "description": "Empresa dedicada a la gestión integral de residuos",
  "phone": "+57 300 123 4567",
  "address": "Carrera 15 #93-07, Bogotá, Colombia",
  "email": "contacto1@ecoempresa.com",
  "website_url": "https://www.ecoempresa.com",
  "logo": {
    "id": "01kb47kfeckgpcv6vy85wte9n9",
    "original_name": "WhatsApp Image 2025-11-21 at 7.52.49 AM.jpeg",
    "filename": "COMP692914ed0084a.jpeg",
    "mime": "image/jpeg",
    "size": 50305,
    "extension": "jpeg",
    "path": "companies/logos/COMP692914ed0084a.jpeg",
    "url": "https://api-ecocircular.creativostecnologicosit.com/storage/companies/logos/COMP692914ed0084a.jpeg"
  },
  "products": [
    {
      "id": "01kb47kfef4np6z3e35a4wayy0",
      "name": "Producto 1",
      "description": "Descripción del producto 1",
      "created_at": "2025-11-28T03:20:13.000000Z",
      "updated_at": "2025-11-28T03:20:13.000000Z"
    }
  ],
  "created_at": "2025-11-28T03:20:12+00:00",
  "updated_at": "2025-11-28T03:20:12+00:00"
}
```

## Componentes Principales

### CompaniesList.jsx
- Lista visual de empresas en formato grid
- Búsqueda por nombre, descripción, email o dirección
- Paginación automática
- Acciones: Ver, Editar, Eliminar
- Vista de logos y información resumida

### CompanyFormModal.jsx
- Formulario para crear/editar empresas
- Subida de logos con validación
- Validación de campos requeridos
- Vista previa de imagen seleccionada
- Soporte para FormData para subida de archivos

### CompanyDetailModal.jsx
- Vista completa de información de empresa
- Detalles del logo con metadata
- Lista de productos asociados
- Información de contacto organizada
- Botón de edición rápida

## Navegación
- **Ruta**: `/companies`
- **Acceso**: Desde el menú lateral (Sidebar) → "Empresas"
- **Icono**: Building2 (Lucide React)

## Validaciones
- Logo: Solo archivos de imagen (JPEG, PNG, GIF, WebP)
- Tamaño máximo: 5MB para logos
- Email: Formato válido
- URL sitio web: Debe comenzar con http:// o https://
- Campos requeridos: Nombre y descripción

## Tecnologías Utilizadas
- React + React Router
- Lucide React (iconos)
- Tailwind CSS (estilos)
- Axios (HTTP client)
- FormData para subida de archivos

## Arquitectura
Sigue el patrón arquitectónico existente del proyecto:
1. Módulo en `/modules/dashboard/`
2. Componentes en `/components/dashboard/`
3. API service en `/api/`
4. Rutas en `App.js`
5. Navegación en `Sidebar.jsx`