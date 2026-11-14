import { Link } from "react-router-dom";

export default function Register() {
    return (
        <main className="mx-auto max-w-xl px-6 py-20">
            <h1 className="text-3xl font-bold">Solicitud de acceso</h1>
            <p className="mt-4">La creación de cuentas se gestiona mediante el administrador de la plataforma. Contacta a tu organización para solicitar acceso.</p>
            <Link className="mt-6 inline-block underline" to="/login">Ir al inicio de sesión</Link>
        </main>
    );
}
