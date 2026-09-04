import { useState } from "react";
import type { TypeRegistro } from "../Types/TypeNuevaEscuela";
import registroInicial from "../Types/TypeNuevaEscuela";
import ModalCargando from "./ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";

function Registro() {
  const [formRegistro, setFormRegistro] =
    useState<TypeRegistro>(registroInicial);
  const [cargando, setCargando] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormRegistro({
      ...formRegistro,
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
        body: JSON.stringify(formRegistro),
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      console.log(res);

      setFormRegistro(registroInicial);
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
            Crear cuenta
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Registra tu escuela y crea tu cuenta de administrador.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Datos de la escuela
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Nombre de la escuela
                </span>

                <input
                  type="text"
                  name="nombreEscuela"
                  value={formRegistro.nombreEscuela}
                  onChange={handleChange}
                  placeholder="Ej. Secundaria Benito Juárez"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Nivel educativo
                </span>

                <select
                  name="nivelEducativo"
                  value={formRegistro.nivelEducativo}
                  onChange={handleChange}
                  className="mt-2 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Selecciona un nivel</option>
                  <option value="Preescolar">Preescolar</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Secundaria">Secundaria</option>
                </select>
              </label>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-5">
            <h2 className="mb-3 text-sm font-semibold text-slate-800">
              Datos del administrador
            </h2>

            <div className="space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Nombre
                </span>

                <input
                  type="text"
                  name="nombreUsuario"
                  value={formRegistro.nombreUsuario}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Correo electrónico
                </span>

                <input
                  type="email"
                  name="correo"
                  value={formRegistro.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Nombre de usuario
                </span>

                <input
                  type="text"
                  name="username"
                  value={formRegistro.username}
                  onChange={handleChange}
                  placeholder="Ej. juanperez"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Contraseña
                </span>

                <input
                  type="password"
                  name="password"
                  value={formRegistro.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-5">
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Crear cuenta
            </button>
          </div>
        </form>
      </div>
      {cargando && <ModalCargando />}
    </div>
  );
}

export default Registro;
