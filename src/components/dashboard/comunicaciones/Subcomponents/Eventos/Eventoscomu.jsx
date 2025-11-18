import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Edit, Megaphone, Calendar, MapPin } from "lucide-react";

export default function CalendarioDeEventos() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];
  const diasSemana = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
  const primary = "#A8C657";
  const calRef = useRef(null);
  const [calendarHeight, setCalendarHeight] = useState(0);

  const eventos = [
    { dia: 8, nombre: "Taller", full: "Taller de Reparaciones", fecha: "8/10/2025", lugar: "Sala Principal" },
    { dia: 20, nombre: "Conferencia", full: "Conferencia de Economía Circular", fecha: "20/10/2025", lugar: "Auditorio Central" },
  ];

  function getMonthMatrix(year, month) {
    const first = new Date(year, month, 1);
    const firstWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const matrix = [];
    let cur = 1 - firstWeekday;
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 7; c++, cur++) row.push(cur < 1 || cur > daysInMonth ? 0 : cur);
      matrix.push(row);
    }
    return matrix;
  }

  const matrix = getMonthMatrix(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(v => v - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(v => v + 1); }
    else setViewMonth(m => m + 1);
  };

  const eventoDelDia = (d) => eventos.find(e => e.dia === d);

  useEffect(() => {
    if (calRef.current) {
      setCalendarHeight(calRef.current.offsetHeight);
    }
  }, [viewMonth, viewYear]);

  const s = {
    page: { fontFamily: "Roboto, sans-serif", background: "#f9fafb", minHeight: "100vh", padding: 28, color: "#0f172a" },
    wrapper: { maxWidth: 1040, marginLeft: 28 },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
    title: { fontSize: 20, fontWeight: 700 },
    newBtn: { background: "#2563eb", color: "white", padding: "8px 12px", borderRadius: 8, border: "none", cursor: "pointer" },

    calendarContainer: { display: "flex", gap: 0, alignItems: "stretch" },
    calendarCard: { flex: 1, background: "#fff", borderRadius: "0 12px 12px 0", padding: 18, boxShadow: "0 6px 18px rgba(15,23,42,0.06)" },

    leftCol: {
      width: 170,
      borderRadius: "12px 0 0 12px",
      background: "#fbfdf8",
      border: `1px solid rgba(168,198,87,0.12)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 8,
      height: calendarHeight ? calendarHeight : "auto",
    },
    bigDay: { fontSize: 54, fontWeight: 800, color: primary, lineHeight: 1, textShadow: `0 2px 6px ${primary}33` },
    leftMonth: { fontSize: 15, fontWeight: 700, color: "#0f172a" },
    leftYear: { fontSize: 13, color: "#6b7280" },
    hoyBtn: { marginTop: 6, padding: "6px 10px", borderRadius: 8, border: "1px solid rgba(0,0,0,0.06)", background: "#fff", cursor: "pointer", fontSize: 12, transition: "0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" },

    calHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    iconBtn: { height: 36, width: 36, borderRadius: 8, border: "1px solid rgba(15,23,42,0.06)", display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fff", cursor: "pointer", transition: "0.2s" },
    monthTitle: { fontSize: 18, fontWeight: 600, textTransform: "capitalize" },

    daysRow: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8, marginBottom: 8, textAlign: "center", color: "#6b7280", fontWeight: 700, fontSize: 12 },
    grid: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 8 },
    cell: { minHeight: 72, borderRadius: 10, background: "#f3f4f6", border: "1px solid rgba(15,23,42,0.03)", display: "flex", flexDirection: "column", padding: 10, color: "#0f172a", fontSize: 13 },
    todayCell: { background: primary, color: "#fff", boxShadow: `0 10px 20px ${primary}33`, fontWeight: 700 },
    chip: { marginTop: 8, fontSize: 11, padding: "4px 8px", borderRadius: 999, background: primary, color: "#fff", display: "inline-block" },

    upcomingCard: { marginTop: 20, background: "#fff", borderRadius: 12, padding: 18, boxShadow: "0 6px 18px rgba(15,23,42,0.04)" },
    upcomingHeader: { fontSize: 16, fontWeight: 700, marginBottom: 12 },
    evRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px", borderRadius: 10, border: "1px solid #eef2f7", marginBottom: 12, background: "#fff" },
    evLeft: { display: "flex", alignItems: "center", gap: 12 },
    evBadge: { minWidth: 52, minHeight: 52, borderRadius: 8, background: "#f6fff7", color: "#065f46", fontWeight: 800, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" },
    evTitle: { fontSize: 14, fontWeight: 700 },
    evMeta: { fontSize: 12, color: "#6b7280", marginTop: 6, display: "flex", alignItems: "center", gap: 6 },
    evActions: { display: "flex", gap: 10 },

    // 🌟 Botones mejorados sin cambiar colores
    btnBase: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 8,
      fontSize: 13,
      fontWeight: 600,
      cursor: "pointer",
      transition: "all 0.25s ease",
      boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
    },
    btnEdit: {
      border: "1px solid rgba(15,23,42,0.06)",
      background: "#fff",
      color: "#111827",
    },
    btnPromo: {
      border: "none",
      background: primary,
      color: "#fff",
    },
  };

  return (
    <div style={s.page}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700;900&display=swap" rel="stylesheet" />
      <div style={s.wrapper}>
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Calendar size={16} />
            <div style={s.title}>Calendario de Eventos</div>
          </div>
          <button style={s.newBtn}>+ Nuevo Evento</button>
        </div>

        <div style={s.calendarContainer}>
          <div style={s.leftCol}>
            <div style={s.bigDay}>{today.getDate()}</div>
            <div style={s.leftMonth}>{meses[viewMonth]}</div>
            <div style={s.leftYear}>{viewYear}</div>
            <div style={{ marginTop: 10 }}>
              <label style={{ fontSize: 12, color: "#6b7280", marginRight: 6 }}>Ver:</label>
              <select value={viewMonth} onChange={(e) => setViewMonth(Number(e.target.value))} style={{ padding: "4px 6px", borderRadius: 6 }}>
                {meses.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
              </select>
            </div>
            <button style={s.hoyBtn} onClick={() => { setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); }}>
              Hoy
            </button>
          </div>

          <div style={s.calendarCard} ref={calRef}>
            <div style={s.calHeader}>
              <div style={s.monthTitle}>{meses[viewMonth]} {viewYear}</div>
              <div>
                <button onClick={prevMonth} style={s.iconBtn}><ChevronLeft size={16} /></button>
                <button onClick={nextMonth} style={{ ...s.iconBtn, marginLeft: 8 }}><ChevronRight size={16} /></button>
              </div>
            </div>
            <div style={s.daysRow}>
              {diasSemana.map(d => <div key={d}>{d}</div>)}
            </div>
            <div style={s.grid}>
              {matrix.flat().map((num, idx) => {
                const isEmpty = num === 0;
                const isToday = !isEmpty && viewYear === today.getFullYear() && viewMonth === today.getMonth() && num === today.getDate();
                const ev = eventoDelDia(num);
                if (isEmpty) return <div key={idx} />;
                return (
                  <div key={idx} style={{ ...s.cell, ...(isToday ? s.todayCell : {}) }}>
                    <div style={{ alignSelf: "flex-end", fontWeight: 600 }}>{num}</div>
                    {ev && <div style={s.chip}>{ev.nombre}</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: "#6b7280" }}>Vista mensual · Selecciona un día para ver detalles (próximamente)</div>
          </div>
        </div>

        <div style={s.upcomingCard}>
          <div style={s.upcomingHeader}>Próximos eventos</div>
          {eventos.map((ev, i) => (
            <div key={i} style={s.evRow}>
              <div style={s.evLeft}>
                <div style={s.evBadge}>
                  <div style={{ fontSize: 18 }}>{ev.dia}</div>
                  <div style={{ fontSize: 11 }}>{meses[viewMonth].slice(0,3)}</div>
                </div>
                <div>
                  <div style={s.evTitle}>{ev.full}</div>
                  <div style={s.evMeta}>
                    <Calendar size={12} /> {ev.fecha} <MapPin size={12} /> {ev.lugar}
                  </div>
                </div>
              </div>
              <div style={s.evActions}>
                <button style={{ ...s.btnBase, ...s.btnEdit }}>
                  <Edit size={14} /> Editar
                </button>
                <button style={{ ...s.btnBase, ...s.btnPromo }}>
                  <Megaphone size={14} /> Promocionar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
