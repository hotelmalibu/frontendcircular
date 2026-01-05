import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

const BRAND = {
    blue: "#2C67B0",
    green: "#B1D357",
    orange: "#E15200",
    red: "#DC2626",
};

export default function FeedbackModal({ type = "success", title, message, isOpen, onClose, autoClose = 0 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setVisible(true);
            if (autoClose > 0) {
                const timer = setTimeout(() => {
                    handleClose();
                }, autoClose);
                return () => clearTimeout(timer);
            }
        } else {
            setVisible(false);
        }
    }, [isOpen, autoClose]);

    const handleClose = () => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    if (!isOpen && !visible) return null;

    const getConfig = () => {
        switch (type) {
            case "success":
                return {
                    icon: <CheckCircle size={48} className="text-green-500" />,
                    bgIcon: "bg-green-100",
                    borderColor: "border-green-200",
                    titleColor: "text-green-800",
                    buttonBg: "bg-green-600 hover:bg-green-700",
                };
            case "error":
                return {
                    icon: <XCircle size={48} className="text-red-500" />,
                    bgIcon: "bg-red-100",
                    borderColor: "border-red-200",
                    titleColor: "text-red-800",
                    buttonBg: "bg-red-600 hover:bg-red-700",
                };
            case "warning":
                return {
                    icon: <AlertTriangle size={48} className="text-orange-500" />,
                    bgIcon: "bg-orange-100",
                    borderColor: "border-orange-200",
                    titleColor: "text-orange-800",
                    buttonBg: "bg-orange-600 hover:bg-orange-700",
                };
            default:
                return {
                    icon: <CheckCircle size={48} className="text-blue-500" />,
                    bgIcon: "bg-blue-100",
                    borderColor: "border-blue-200",
                    titleColor: "text-blue-800",
                    buttonBg: "bg-blue-600 hover:bg-blue-700",
                };
        }
    };

    const config = getConfig();

    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-fadeIn">
            <div className={`relative bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full mx-4 transform transition-all duration-300 ${visible ? "scale-100 translate-y-0" : "scale-95 translate-y-8"}`}>
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full mb-4 ${config.bgIcon} bg-opacity-50`}>
                        {config.icon}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${config.titleColor}`}>
                        {title}
                    </h3>

                    <p className="text-gray-600 mb-6 font-medium">
                        {message}
                    </p>

                    <button
                        onClick={handleClose}
                        className={`w-full py-3 px-6 rounded-xl text-white font-bold shadow-lg shadow-gray-200 transform active:scale-95 transition-all ${config.buttonBg}`}
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
