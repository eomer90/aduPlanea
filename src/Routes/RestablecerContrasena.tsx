import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ModalCargando from "../components/ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;

function RestablecerContrasena() {
  const [password, setPassword] = useState<string>("");
  const [confirmarPassword, setConfirmarPassword] = useState<string>("");
  const [mensaje, setMensaje] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmarPassword) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    setMensaje("");
    try {
      const req = await fetch(`${SERVER}/login/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });
      const res = await req.json();
      if (!req.ok) {
        setMensaje(res.mensaje);
        return;
      }
      setMensaje(res.mensaje);
      setTimeout(() => {
        navigate("/login");
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
            Restablecer contraseña
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nueva contraseña
            </span>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Confirmar contraseña
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
            onClick={() => navigate("/login")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Regresar al inicio de sesión
          </button>
        </form>

        {mensaje && (
          <p className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            {mensaje}
          </p>
        )}

        {cargando && <ModalCargando />}
      </div>
    </div>
  );
}

export default RestablecerContrasena;
