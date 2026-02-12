
import { Check } from "lucide-react";

export default function PasswordStrengthMeter({ password }) {
  const requirements = [
    { label: "Al menos 8 caracteres", test: (p) => p.length >= 8 },
    { label: "Una letra minúscula (a-z)", test: (p) => /[a-z]/.test(p) },
    { label: "Una letra mayúscula (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { label: "Al menos un número (0-9)", test: (p) => /\d/.test(p) },
    { label: "Un carácter especial (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
  ];

  const strength = requirements.filter((r) => r.test(password)).length;
  const strengthLabel = ["Muy Débil", "Débil", "Regular", "Buena", "Fuerte", "Muy Fuerte"];
  const strengthColor = ["bg-red-500", "bg-red-400", "bg-yellow-500", "bg-blue-400", "bg-green-500", "bg-green-600"];

  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <h4 className="text-xs font-bold text-gray-700 mb-2">Requisitos de seguridad:</h4>
      <ul className="space-y-1 mb-3">
        {requirements.map((req, index) => {
          const met = req.test(password);
          return (
            <li key={index} className={`text-xs flex items-center gap-2 ${met ? "text-green-600" : "text-gray-400"}`}>
              {met ? <Check size={12} /> : <div className="w-3 h-3 rounded-full border border-gray-300" />}
              {req.label}
            </li>
          );
        })}
      </ul>
      
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-gray-600">Seguridad:</span>
        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ${strengthColor[strength]}`} 
            style={{ width: `${(strength / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-bold ${strength >= 5 ? "text-green-600" : "text-gray-500"}`}>
            {strengthLabel[strength]}
        </span>
      </div>
    </div>
  );
}
