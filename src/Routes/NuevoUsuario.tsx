import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TypeNuevoUsuario } from "../Types/TypeNuevoUsuario";
import nuevoUsuarioInicial from "../Types/TypeNuevoUsuario";
import ModalCargando from "../components/ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;

export type TypeEscuela = {
  nombreEscuela: string;
  nivelEducativo: string;
};

const escuelaInicial: TypeEscuela = {
  nombreEscuela: "",
  nivelEducativo: "",
};

function NuevoUsuario() {
  const [formUsuario, setFormUsuario] =
    useState<TypeNuevoUsuario>(nuevoUsuarioInicial);
  const [cargando, setCargando] = useState<boolean>(false);
  //   const [escuelas, setEscuelas] = useState<TypeEscuela>(escuelaInicial);

  const navigate = useNavigate();

  const obtenerEscuelas = async () => {
    setCargando(true);
    try {
      const req = await fetch(`${SERVER}/escuelas`);
      const res = await req.json();
      //   setEscuelas(res.escuelasEncontradas);
      console.log(res.escuelasEncontradas);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormUsuario({
      ...formUsuario,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCargando(true);

    try {
      const req = await fetch(`${SERVER}/registro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formUsuario),
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      console.log(res);
      navigate("/login");
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEscuelas();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Crear cuenta
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registrate y crea tu cuenta de EduPlanea.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre de la escuela
            </span>

            <input
              type="text"
              name="nombreEscuela"
              value={formUsuario.nombreEscuela}
              onChange={handleChange}
              placeholder="Ej. Escuela Secundaria Benito Juárez"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nivel educativo
            </span>

            <select
              name="nivelEducativo"
              value={formUsuario.nivelEducativo}
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Selecciona un nivel</option>
              <option value="Preescolar">Preescolar</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre completo
            </span>

            <input
              type="text"
              name="nombreUsuario"
              value={formUsuario.nombreUsuario}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Correo electrónico
            </span>

            <input
              type="email"
              name="correo"
              value={formUsuario.correo}
              onChange={handleChange}
              placeholder="Ej. juan@email.com"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre de usuario
            </span>

            <input
              type="text"
              name="username"
              value={formUsuario.username}
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
              value={formUsuario.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Crear cuenta
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

export default NuevoUsuario;
