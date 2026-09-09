import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Panel from "../components/Panel";
import SeccionAlumnos from "../components/alumnos/SeccionAlumnos";
import EditarClase from "../components/clases/EditarClase";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import defaultClaseNueva from "../Types/TypeClaseNueva";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeEvaluacion } from "../Types/TypeEvaluacion";
import ModalCargando from "../components/ModalCargando";
import Evaluaciones from "../components/evaluaciones/Evaluaciones";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE1 = "/clases";
const ROUTE2 = "/alumnos";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
  escuelaId: string;
  usuarioId: string;
};

type TypeClase = TypeClaseNueva & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

const defaultClaseSeleccionada: TypeClase = {
  ...defaultClaseNueva,
  escuelaId: "",
  usuarioId: "",
  _id: "",
};

type TypeEvaluacionesSeleccionadas = TypeEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

function Detalles() {
  const [claseSeleccionada, setClaseSeleccionada] = useState<TypeClase>(
    defaultClaseSeleccionada,
  );
  const [alumnos, setAlumnos] = useState<TypeAlumnos[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<
    TypeEvaluacionesSeleccionadas[]
  >([]);

  const [mostrarDetalles, setMostrarDetalles] = useState<boolean>(true);
  const [mostrarAlumnos, setMostrarAlumnos] = useState<Boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [mostrarEditarClase, setMostrarEditarClase] = useState<boolean>(false);
  const [mostrarEvaluaciones, setMostrarEvaluaciones] =
    useState<boolean>(false);

  const { id } = useParams();

  const obtenerClaseSeleccionada = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}${ROUTE1}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
      }

      setClaseSeleccionada(res.claseEncontrada);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerAlumnos = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(SERVER + ROUTE2, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();

      const alumnosFiltrados = res.alumnos.filter((a: TypeAlumnos) => {
        const materia = a.materias.some(
          (m) => m.nombre === claseSeleccionada.materia,
        );

        return (
          a.grado === claseSeleccionada.grado &&
          a.grupo === claseSeleccionada.grupo &&
          materia
        );
      });
      setAlumnos(alumnosFiltrados);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerEvaluaciones = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/evaluaciones`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();

      console.log("Evaluaciones:", res.evaluacionesEncontradas);
      console.log("Clase seleccionada:", claseSeleccionada._id);
      console.log(
        "claseId evaluación:",
        res.evaluacionesEncontradas[0]?.claseId,
      );

      const evaluacionesFiltradas = res.evaluacionesEncontradas.filter(
        (e: TypeEvaluacionesSeleccionadas) =>
          String(e.claseId) === String(claseSeleccionada._id),
      );
      setEvaluaciones(evaluacionesFiltradas);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClaseSeleccionada();
  }, []);

  useEffect(() => {
    if (claseSeleccionada._id) {
      obtenerEvaluaciones();
    }
  }, [claseSeleccionada]);

  useEffect(() => {
    if (claseSeleccionada._id) {
      obtenerAlumnos();
    }
  }, [claseSeleccionada]);

  useEffect(() => {
    console.log(alumnos);
  }, [alumnos]);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {claseSeleccionada.materia}
              </h1>

              <span className="rounded-lg bg-indigo-600 px-4 py-2 text-lg font-bold text-white shadow-sm">
                {claseSeleccionada.grado}° {claseSeleccionada.grupo}
              </span>
            </div>

            <nav className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => {
                  setMostrarDetalles(true);
                  setMostrarAlumnos(false);
                  setMostrarEvaluaciones(false);
                  setMostrarEditarClase(false);
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
                  setMostrarEvaluaciones(false);
                  setMostrarEditarClase(false);
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
                className={`rounded-md px-4 py-2 text-sm transition ${
                  mostrarEvaluaciones
                    ? "bg-white font-semibold text-indigo-600 shadow-sm"
                    : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
                onClick={() => {
                  setMostrarDetalles(false);
                  setMostrarAlumnos(false);
                  setMostrarEvaluaciones(true);
                  setMostrarEditarClase(false);
                }}
              >
                Evaluaciones
              </button>

              <button
                type="button"
                className={`rounded-md px-4 py-2 text-sm transition ${
                  mostrarEditarClase
                    ? "bg-white font-semibold text-indigo-600 shadow-sm"
                    : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                }`}
                onClick={() => {
                  setMostrarDetalles(false);
                  setMostrarAlumnos(false);
                  setMostrarEvaluaciones(false);
                  setMostrarEditarClase(true);
                }}
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
            <SeccionAlumnos
              alumnos={alumnos}
              obtenerAlumnos={obtenerAlumnos}
              claseSeleccionada={claseSeleccionada}
            />
          )}

          {mostrarEditarClase && (
            <EditarClase
              claseSeleccionada={claseSeleccionada}
              setMostrarEditarClase={setMostrarEditarClase}
              setMostrarDetalles={setMostrarDetalles}
              obtenerClaseSeleccionada={obtenerClaseSeleccionada}
            />
          )}

          {mostrarEvaluaciones && (
            <Evaluaciones
              alumnos={alumnos}
              claseSeleccionada={claseSeleccionada}
              evaluaciones={evaluaciones}
              obtenerEvaluaciones={obtenerEvaluaciones}
            />
          )}
        </div>
      </main>
      {cargando && <ModalCargando />}
    </div>
  );
}

export default Detalles;
