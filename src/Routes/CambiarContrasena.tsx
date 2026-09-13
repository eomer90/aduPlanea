import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalCargando from "../components/ModalCargando";
import ModalMensaje from "../components/ModalMensaje";

const SERVER = import.meta.env.VITE_API_URL;

function CambiarContrasena() {
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (passwordNueva !== confirmarPassword) {
      setMensaje("Las contraseñas nuevas no coinciden.");
      return;
    }
    setCargando(true);
    setMensaje("");
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/login/change-password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
        }),
      });
      const res = await req.json();
      if (!req.ok) {
        setMensaje(res.mensaje);
        return;
      }
      setMensaje(res.mensaje);
      setPasswordActual("");
      setPasswordNueva("");
      setConfirmarPassword("");
      setTimeout(() => {
        navigate("/inicio");
      }, 2000);
    } catch (error) {
      console.log(error);
      setMensaje("Ocurrió un error. Intenta nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Cambiar contraseña
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Actualiza la contraseña de tu cuenta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Contraseña actual
            </span>

            <input
              type="password"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nueva contraseña
            </span>

            <input
              type="password"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Confirmar nueva contraseña
            </span>

            <input
              type="password"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Cambiar contraseña
          </button>

          <button
            type="button"
            onClick={() => navigate("/inicio")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Regresar
          </button>
        </form>

        {cargando && <ModalCargando />}
        {mensaje && (
          <ModalMensaje mensaje={mensaje} cerrar={() => setMensaje("")} />
        )}
      </div>
    </div>
  );
}

export default CambiarContrasena;
