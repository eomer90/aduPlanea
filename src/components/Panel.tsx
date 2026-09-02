import { NavLink } from "react-router-dom";

function Panel() {
  return (
    <aside className="fixed top-16 bottom-0 left-0 w-60 border-r border-slate-200 bg-white">
      <nav className="flex flex-col gap-1 p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `rounded-lg px-4 py-3 text-left transition ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Inicio
        </NavLink>

        <NavLink
          to="/clases"
          className={({ isActive }) =>
            `rounded-lg px-4 py-3 text-left transition ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Mis clases
        </NavLink>

        <NavLink
          to="/recordatorios"
          className={({ isActive }) =>
            `rounded-lg px-4 py-3 text-left transition ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Recordatorios
        </NavLink>

        <NavLink
          to="/planeaciones"
          className={({ isActive }) =>
            `rounded-lg px-4 py-3 text-left transition ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Planeaciones
        </NavLink>

        <NavLink
          to="/configuracion"
          className={({ isActive }) =>
            `rounded-lg px-4 py-3 text-left transition ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
}

export default Panel;
