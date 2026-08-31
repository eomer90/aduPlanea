import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Panel from "../components/Panel";
import SeccionAlumnos from "../components/SeccionAlumnos";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import defaultClaseNueva from "../Types/TypeClaseNueva";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE1 = "/clases";
const ROUTE2 = "/alumnos";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

function Detalles() {
  const [claseSeleccionada, setClaseSeleccionada] =
    useState<TypeClaseNueva>(defaultClaseNueva);
  const [mostrarDetalles, setMostrarDetalles] = useState<Boolean>(true);
  const [mostrarAlumnos, setMostrarAlumnos] = useState<Boolean>(false);
  const [alumnos, setAlumnos] = useState<TypeAlumnos[]>([]);

  const { id } = useParams();

  const obtenerClaseSeleccionada = async () => {
    try {
      const req = await fetch(`${SERVER}${ROUTE1}/${id}`);
      const res = await req.json();

      setClaseSeleccionada(res.claseEncontrada);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerAlumnos = async () => {
    try {
      const req = await fetch(SERVER + ROUTE2);
      const res = await req.json();

      const alumnosFiltrados = res.alumnos.filter(
        (a: TypeAlumnos) =>
          a.grado === claseSeleccionada.grado &&
          a.grupo === claseSeleccionada.grupo,
      );
      setAlumnos(alumnosFiltrados);
      console.log(alumnosFiltrados);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerClaseSeleccionada();
  }, []);

  useEffect(() => {
    if (claseSeleccionada.grado && claseSeleccionada.grupo) {
      obtenerAlumnos();
    }
  }, [claseSeleccionada]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-6 flex items-center justify-between">
            {/* Información de la clase */}
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {claseSeleccionada.materia}
              </h1>

              <span className="rounded-lg bg-indigo-600 px-4 py-2 text-lg font-bold text-white shadow-sm">
                {claseSeleccionada.grado}° {claseSeleccionada.grupo}
              </span>
            </div>

            {/* Navegación de la clase */}
            <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMostrarDetalles(true);
                  setMostrarAlumnos(false);
                }}
                className={`rounded-md px-4 py-2 text-sm transition ${
                  mostrarDetalles
                    ? "bg-white font-semibold text-indigo-600 shadow-sm"
                    : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
              >
                Detalles
              </button>

              <button
                type="button"
                onClick={() => {
                  setMostrarDetalles(false);
                  setMostrarAlumnos(true);
                }}
                className={`rounded-md px-4 py-2 text-sm transition ${
                  mostrarAlumnos
                    ? "bg-white font-semibold text-indigo-600 shadow-sm"
                    : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
              >
                Alumnos
              </button>

              <button
                type="button"
                className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-white hover:text-slate-700"
              >
                Editar clase
              </button>
            </nav>
          </div>

          {mostrarDetalles && (
            <div className="grid gap-6 lg:grid-cols-3">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">Horarios</h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Días y horas de la clase
                    </p>
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                    {claseSeleccionada.horarios.length}{" "}
                    {claseSeleccionada.horarios.length === 1
                      ? "horario"
                      : "horarios"}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  {claseSeleccionada.horarios.map((horario, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium capitalize text-slate-700">
                        {horario.dia}
                      </span>

                      <span className="text-sm text-slate-500">
                        {horario.inicio} — {horario.fin}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-slate-900">
                  Periodo escolar
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Duración de la clase
                </p>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Inicio
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {claseSeleccionada.periodoInicio}
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Finalización
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {claseSeleccionada.periodoFin}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {mostrarAlumnos && (
            <SeccionAlumnos alumnos={alumnos} obtenerAlumnos={obtenerAlumnos} />
          )}
        </div>
      </main>
    </div>
  );
}

export default Detalles;
