import { NavLink } from "react-router-dom";

function Panel() {
  return (
    <aside className="fixed bottom-0 left-0 z-40 w-full border-t border-slate-200 bg-white md:top-16 md:right-auto md:bottom-0 md:w-60 md:border-t-0 md:border-r">
      <nav className="flex justify-around gap-1 p-2 md:flex-col md:justify-start md:p-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `rounded-lg px-2 py-2 text-center text-xs transition md:px-4 md:py-3 md:text-left md:text-base ${
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
            `rounded-lg px-2 py-2 text-center text-xs transition md:px-4 md:py-3 md:text-left md:text-base ${
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
            `rounded-lg px-2 py-2 text-center text-xs transition md:px-4 md:py-3 md:text-left md:text-base ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Recordatorios
        </NavLink>

        <NavLink
          to="/anotaciones"
          className={({ isActive }) =>
            `rounded-lg px-2 py-2 text-center text-xs transition md:px-4 md:py-3 md:text-left md:text-base ${
              isActive
                ? "bg-slate-100 text-slate-900"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`
          }
        >
          Anotaciones
        </NavLink>
      </nav>
    </aside>
  );
}

export default Panel;
