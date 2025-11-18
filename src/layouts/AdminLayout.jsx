export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow">
        <h1 className="text-lg font-bold">Panel de Administración</h1>
      </header>

      <main className="flex-1 p-6">{children}</main>

      <footer className="bg-gray-200 text-center py-3 text-sm text-gray-600">
        © {new Date().getFullYear()} Vision Circular
      </footer>
    </div>
  );
}
