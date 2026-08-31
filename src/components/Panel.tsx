import { useNavigate } from "react-router-dom";
function Panel() {
  const navigate = useNavigate();
  return (
    <aside className="fixed top-16 bottom-0 left-0 w-60 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="rounded-lg bg-slate-100 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-200"
        >
          Inicio
        </button>

        <button
          type="button"
          onClick={() => navigate("/clases")}
          className="rounded-lg bg-slate-100 px-4 py-3 text-left font-medium text-slate-800 transition hover:bg-slate-200"
        >
          Mis clases
        </button>

        <button
          type="button"
          className="rounded-lg px-4 py-3 text-left text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Recordatorios
        </button>

        <button
          type="button"
          className="rounded-lg px-4 py-3 text-left text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Planeaciones
        </button>

        <button
          type="button"
          className="rounded-lg px-4 py-3 text-left text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Configuración
        </button>
      </nav>
    </aside>
  );
}

export default Panel;
