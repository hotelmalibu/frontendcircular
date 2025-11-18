import React from "react";
import PermisosTable from "./Subcomponents/rolesPermisos/PermisosTable";
import Roles from "./Subcomponents/rolesPermisos/Roles";

export default function RolesPermisos() {
  return (
    <div>
      <h1>Roles y Permisos</h1>
      <Roles />
      <PermisosTable />
    </div>
  );
}