import { useState } from "react";
import type { TypeLogin } from "../Types/TypeLogin";
import loginInicial from "../Types/TypeLogin";
import { useNavigate } from "react-router-dom";
import ModalCargando from "../components/ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";

function Login() {
  const [formLogin, setFormLogin] = useState<TypeLogin>(loginInicial);
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const req = await fetch(`${SERVER}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formLogin),
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      localStorage.setItem("token", res.token);
      navigate("/");
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Iniciar sesión
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Ingresa a tu cuenta de EduPlanea.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre de usuario
            </span>

            <input
              type="text"
              name="username"
              value={formLogin.username}
              onChange={handleChange}
              placeholder="Ej. juanperez"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Contraseña
            </span>

            <input
              type="password"
              name="password"
              value={formLogin.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Iniciar sesión
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800"
          >
            Regresar
          </button>
        </form>
        {cargando && <ModalCargando />}
      </div>
    </div>
  );
}

export default Login;
