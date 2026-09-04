import { Link, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-10 h-16 bg-slate-800 text-white">
      <div className="flex h-full items-center justify-between px-6">
        <h1 className="text-xl font-semibold tracking-wide">Eduplanea</h1>

        <div className="flex items-center gap-2">
          {token ? (
            <button
              onClick={cerrarSesion}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-700"
            >
              <FiLogOut size={18} />
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition hover:bg-slate-700"
              >
                Iniciar sesión
              </Link>

              <Link
                to="/nuevo-usuario"
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium transition hover:bg-indigo-700"
              >
                Nuevo usuario
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
