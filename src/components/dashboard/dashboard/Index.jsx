import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import Undexsub from "./subcomponentes/Undexsub";
import UndexAfiliado from "./subcomponentes/UndexAfiliado";

export default function Index() {
  const { user } = useContext(AuthContext);

  // Determinar si es afiliado
  const isAfiliado = user?.role_slug === 'afiliado' || user?.role?.toLowerCase() === 'afiliado' || user?.role?.toLowerCase() === 'afiliados';

  if (isAfiliado) {
    return <UndexAfiliado />;
  }

  return <Undexsub />;
}