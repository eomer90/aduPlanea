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
  const [mostrarAlumnos, setMostrarAlumnos] = useState<boolean>(false);
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

      <main className="pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {/* ENCABEZADO */}
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 className="max-w-full truncate text-2xl font-bold text-slate-900 sm:text-3xl">
                {claseSeleccionada.materia}
              </h1>

              <span className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-base font-bold text-white shadow-sm sm:px-4 sm:py-2 sm:text-lg">
                {claseSeleccionada.grado}° {claseSeleccionada.grupo}
              </span>
            </div>

            {/* NAVEGACIÓN */}
            <div className="w-full overflow-x-auto lg:w-auto">
              <nav className="flex min-w-max items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(true);
                    setMostrarAlumnos(false);
                    setMostrarEvaluaciones(false);
                    setMostrarEditarClase(false);
                  }}
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
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
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
                    mostrarAlumnos
                      ? "bg-white font-semibold text-indigo-600 shadow-sm"
                      : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  Alumnos
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(false);
                    setMostrarAlumnos(false);
                    setMostrarEvaluaciones(true);
                    setMostrarEditarClase(false);
                  }}
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
                    mostrarEvaluaciones
                      ? "bg-white font-semibold text-indigo-600 shadow-sm"
                      : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  Evaluaciones
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(false);
                    setMostrarAlumnos(false);
                    setMostrarEvaluaciones(false);
                    setMostrarEditarClase(true);
                  }}
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
                    mostrarEditarClase
                      ? "bg-white font-semibold text-indigo-600 shadow-sm"
                      : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  Editar clase
                </button>
              </nav>
            </div>
          </div>

          {/* DETALLES */}
          {mostrarDetalles && (
            <div className="space-y-6">
              {/* INFORMACIÓN GENERAL */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Información de la clase
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Información general de tu clase.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Clase
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {claseSeleccionada.nombre}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Materia
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {claseSeleccionada.materia}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Grupo
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {claseSeleccionada.grado}° {claseSeleccionada.grupo}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salón
                    </p>

                    <p className="mt-2 font-semibold text-slate-800">
                      {claseSeleccionada.salon || "Sin asignar"}
                    </p>
                  </div>
                </div>
              </section>

              {/* RESUMEN */}
              <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900">Grupo</h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Alumnos registrados en esta clase.
                      </p>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                      {alumnos.length}
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarDetalles(false);
                        setMostrarAlumnos(true);
                        setMostrarEvaluaciones(false);
                        setMostrarEditarClase(false);
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Ver alumnos →
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-semibold text-slate-900">
                        Evaluaciones
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Evaluaciones creadas para esta clase.
                      </p>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg font-bold text-indigo-600">
                      {evaluaciones.length}
                    </div>
                  </div>

                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => {
                        setMostrarDetalles(false);
                        setMostrarAlumnos(false);
                        setMostrarEvaluaciones(true);
                        setMostrarEditarClase(false);
                      }}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                      Ver evaluaciones →
                    </button>
                  </div>
                </div>
              </section>

              {/* HORARIOS Y PERIODO */}
              <div className="grid gap-6 lg:grid-cols-3">
                {/* HORARIOS */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-2">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">Horarios</h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Días y horas de la clase.
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
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
                        className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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

                {/* PERIODO */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                  <h2 className="font-semibold text-slate-900">
                    Periodo escolar
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Duración de la clase.
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

              {/* ACCIONES */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="font-semibold text-slate-900">
                    Acciones rápidas
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Accede rápidamente a las herramientas de esta clase.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarDetalles(false);
                      setMostrarAlumnos(true);
                      setMostrarEvaluaciones(false);
                      setMostrarEditarClase(false);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <p className="font-medium text-slate-800">Alumnos</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Administrar alumnos del grupo
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarDetalles(false);
                      setMostrarAlumnos(false);
                      setMostrarEvaluaciones(true);
                      setMostrarEditarClase(false);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <p className="font-medium text-slate-800">Evaluaciones</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Consultar y crear evaluaciones
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMostrarDetalles(false);
                      setMostrarAlumnos(false);
                      setMostrarEvaluaciones(false);
                      setMostrarEditarClase(true);
                    }}
                    className="rounded-xl border border-slate-200 px-4 py-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50/50"
                  >
                    <p className="font-medium text-slate-800">Editar clase</p>

                    <p className="mt-1 text-xs text-slate-500">
                      Modificar información de la clase
                    </p>
                  </button>
                </div>
              </section>
            </div>
          )}

          {/* ALUMNOS */}
          {mostrarAlumnos && (
            <SeccionAlumnos
              alumnos={alumnos}
              obtenerAlumnos={obtenerAlumnos}
              claseSeleccionada={claseSeleccionada}
            />
          )}

          {/* EDITAR CLASE */}
          {mostrarEditarClase && (
            <EditarClase
              claseSeleccionada={claseSeleccionada}
              setMostrarEditarClase={setMostrarEditarClase}
              setMostrarDetalles={setMostrarDetalles}
              obtenerClaseSeleccionada={obtenerClaseSeleccionada}
            />
          )}

          {/* EVALUACIONES */}
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
