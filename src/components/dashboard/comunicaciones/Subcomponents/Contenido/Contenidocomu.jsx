import React from "react";
import { Edit, Eye, FileText } from "lucide-react";

export default function GestionDeContenido() {
  const articulos = [
    {
      titulo: "Innovaciones en Reciclaje de Plásticos 2025",
      autor: "María González",
      fecha: "09/09/2025",
      vistas: 2340,
      estado: "Publicado",
      color: "#16a34a",
      bg: "#dcfce7",
    },
    {
      titulo: "Economía Circular en el Sector Textil",
      autor: "Carlos Ruiz",
      fecha: "07/09/2025",
      vistas: 0,
      estado: "Pendiente revisión",
      color: "#dc2626",
      bg: "#fee2e2",
    },
    {
      titulo: "Guía de Compostaje Doméstico",
      autor: "Ana Martín",
      fecha: "04/09/2025",
      vistas: 0,
      estado: "Borrador",
      color: "#6b7280",
      bg: "#f3f4f6",
    },
  ];

  const buttonStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    background: "white",
    padding: "6px 12px",
    cursor: "pointer",
    fontSize: "13px",
    color: "#374151",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  };

  const buttonHover = {
    transform: "translateY(-1px)",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)",
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      {/* Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "0 auto 40px auto", // 🔹 Se corrigió aquí
          maxWidth: "900px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FileText size={22} color="#111827" />
          <h2
            style={{
              fontSize: "21px",
              fontWeight: "700",
              color: "#111827",
              margin: 0,
            }}
          >
            Gestión de Contenido
          </h2>
        </div>

        <button
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "9px 18px",
            cursor: "pointer",
            fontWeight: "500",
            boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
            transition: "all 0.2s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
        >
          + Nuevo Artículo
        </button>
      </div>

      {/* Lista de artículos */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "18px",
          }}
        >
          Artículos
        </h3>

        {articulos.map((articulo, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #e5e7eb",
              borderRadius: "10px",
              padding: "16px 20px",
              marginBottom: "14px",
              background: "#fff",
              transition: "box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.boxShadow = "none")
            }
          >
            <div>
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#111827",
                  marginBottom: "4px",
                }}
              >
                {articulo.titulo}
              </h4>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  margin: 0,
                }}
              >
                por {articulo.autor} · {articulo.fecha} · {articulo.vistas}{" "}
                vistas
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  background: articulo.bg,
                  color: articulo.color,
                  border: `1px solid ${articulo.color}`,
                  borderRadius: "9999px",
                  padding: "5px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                {articulo.estado}
              </span>

              <button
                style={buttonStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, buttonHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, buttonStyle)
                }
              >
                <Edit size={14} style={{ marginRight: "5px" }} /> Editar
              </button>

              <button
                style={buttonStyle}
                onMouseEnter={(e) =>
                  Object.assign(e.currentTarget.style, buttonHover)
                }
                onMouseLeave={(e) =>
                  Object.assign(e.currentTarget.style, buttonStyle)
                }
              >
                <Eye size={14} style={{ marginRight: "5px" }} /> Ver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
