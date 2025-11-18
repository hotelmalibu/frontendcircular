import React from "react";
import { Folder, Upload, ExternalLink, Trash2 } from "lucide-react";

export default function BibliotecaDeMedios() {
  const archivos = [
    {
      nombre: "Reciclaje 1",
      tipo: "Imagen JPG",
      peso: "1.2 MB",
      url: "https://c.files.bbci.co.uk/29F4/production/_129704701_gettyimages-1363177318-1.jpg",
    },
    {
      nombre: "Reciclaje 2",
      tipo: "Imagen PNG",
      peso: "850 KB",
      url: "https://s1.significados.com/foto/reciclaje-og.jpg",
    },
  ];

  const handleEliminar = (nombre) => {
    alert(`Archivo "${nombre}" eliminado.`);
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        background: "#f9fafb",
        minHeight: "100vh",
        padding: "40px",
        color: "#0f172a",
      }}
    >
      {/* 🔹 Encabezado */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1000px",
          margin: "0 auto 40px auto",
          paddingBottom: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Folder size={22} color="#111827" />
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "700",
              margin: 0,
              color: "#111827",
            }}
          >
            Biblioteca de Medios
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
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 3px 8px rgba(37,99,235,0.25)",
            transition: "all 0.25s ease",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
        >
          <Upload size={16} /> Subir Archivo
        </button>
      </div>

      {/* 🔹 Filtros */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto 24px auto",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <label style={{ fontSize: "14px", fontWeight: "500" }}>Tipo</label>
        <select
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "6px 10px",
            fontSize: "14px",
            background: "white",
            cursor: "pointer",
          }}
        >
          <option>Todos</option>
          <option>Imágenes</option>
          <option>Videos</option>
          <option>Documentos</option>
        </select>

        <input
          type="text"
          placeholder="Buscar archivos..."
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            padding: "8px 12px",
            fontSize: "14px",
            outline: "none",
            transition: "border 0.2s ease",
          }}
          onFocus={(e) => (e.currentTarget.style.border = "1px solid #2563eb")}
          onBlur={(e) => (e.currentTarget.style.border = "1px solid #d1d5db")}
        />
      </div>

      {/* 🔹 Galería */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {archivos.map((archivo, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                background: "#f3f4f6",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
              }}
            >
              {/* Botón Eliminar */}
              <button
                onClick={() => handleEliminar(archivo.nombre)}
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                  background: "rgba(255,255,255,0.9)",
                  border: "1px solid #e5e7eb",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "background 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#fee2e2")}
                onMouseOut={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.9)")}
              >
                <Trash2 size={15} color="#dc2626" />
              </button>

              {/* Imagen */}
              <img
                src={archivo.url}
                alt={archivo.nombre}
                style={{
                  width: "100%",
                  height: "130px",
                  objectFit: "cover",
                  borderBottom: "1px solid #e5e7eb",
                }}
              />

              {/* Info */}
              <div
                style={{
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {archivo.nombre}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#6b7280",
                  }}
                >
                  {archivo.tipo} · {archivo.peso}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Contenido externo */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "32px auto 0 auto",
          background: "white",
          borderRadius: "12px",
          padding: "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "12px",
          }}
        >
          Contenido Externo
        </h3>

        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            placeholder="https://youtube.com/watch?v=... o https://twitter.com/.../incrustar"
            style={{
              flex: 1,
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              padding: "8px 12px",
              fontSize: "14px",
              outline: "none",
              transition: "border 0.2s ease",
            }}
            onFocus={(e) => (e.currentTarget.style.border = "1px solid #2563eb")}
            onBlur={(e) => (e.currentTarget.style.border = "1px solid #d1d5db")}
          />
          <button
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "all 0.25s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-1px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "none")}
          >
            <ExternalLink size={16} /> Incrustar
          </button>
        </div>
      </div>
    </div>
  );
}
