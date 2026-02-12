import React from "react";
import { Loader2 } from "lucide-react";

const DefaultLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 text-[#B1D357] animate-spin" />
        <p className="text-[#005380] font-semibold text-sm animate-pulse">
          Cargando...
        </p>
      </div>
    </div>
  );
};

export default DefaultLoader;
