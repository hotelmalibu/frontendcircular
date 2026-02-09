import React from "react";
import HelpdeskTable from "./Subcomponents/helpdesk/HelpdeskTable";

export default function Helpdesk() {
    return (
        <div className="animate-fade-in-up">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Mesa de Ayuda</h2>
                <p className="text-gray-500">Gestión de solicitudes de soporte técnico y reportes de usuarios</p>
            </div>
            <HelpdeskTable />
        </div>
    );
}
