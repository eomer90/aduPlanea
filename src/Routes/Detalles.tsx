import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Panel from "../components/Panel";
import SeccionAlumnos from "../components/alumnos/SeccionAlumnos";
import EditarClase from "../components/clases/EditarClase";
import ModalCargando from "../components/ModalCargando";
import Evaluaciones from "../components/evaluaciones/Evaluaciones";
import inicialClaseMongo from "../Types/TypeClaseMongo";
import Asistencias from "../components/alumnos/Asistencias";
import Actividades from "../components/alumnos/Actividades";
import type { TypeClaseMongo } from "../Types/TypeClaseMongo";
import type { TypeAlumnoMongo } from "../Types/TypeAlumnoMongo";
import type { TypeEvaluacionMongo } from "../Types/TypeEvaluacionMongo";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";

function Detalles() {
  const [claseSeleccionada, setClaseSeleccionada] =
    useState<TypeClaseMongo>(inicialClaseMongo);
  const [alumnos, setAlumnos] = useState<TypeAlumnoMongo[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<TypeEvaluacionMongo[]>([]);
  const [mostrarDetalles, setMostrarDetalles] = useState<boolean>(true);
  const [mostrarAlumnos, setMostrarAlumnos] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [mostrarEditarClase, setMostrarEditarClase] = useState<boolean>(false);
  const [mostrarEvaluaciones, setMostrarEvaluaciones] =
    useState<boolean>(false);
  const [mostrarAsistencias, setMostrarAsistencias] = useState<boolean>(false);
  const [mostrarActividades, setMostrarActividades] = useState<boolean>(false);

  const { id } = useParams();

  const obtenerClaseSeleccionada = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/clases/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      setClaseSeleccionada(res.claseEncontrada);
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
      const req = await fetch(
        `${SERVER}/alumnos/clase/${claseSeleccionada._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      setAlumnos(res.alumnos);
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
      const req = await fetch(
        `${SERVER}/evaluaciones/clase/${claseSeleccionada._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      setEvaluaciones(res.evaluacionesEncontradas);
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
  }, [claseSeleccionada._id]);

  useEffect(() => {
    if (claseSeleccionada._id) {
      obtenerAlumnos();
    }
  }, [claseSeleccionada._id]);

  const totalAsistencias = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    return total + (materia?.asistencias?.length || 0);
  }, 0);

  const totalPresentes = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    return (
      total +
      (materia?.asistencias?.filter(
        (asistencia) => asistencia.estado === "presente",
      ).length || 0)
    );
  }, 0);

  const totalRetardos = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    return (
      total +
      (materia?.asistencias?.filter(
        (asistencia) => asistencia.estado === "retardo",
      ).length || 0)
    );
  }, 0);

  const totalFaltas = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    return (
      total +
      (materia?.asistencias?.filter(
        (asistencia) => asistencia.estado === "falta",
      ).length || 0)
    );
  }, 0);

  const totalJustificados = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    return (
      total +
      (materia?.asistencias?.filter(
        (asistencia) => asistencia.estado === "justificado",
      ).length || 0)
    );
  }, 0);

  const porcentajePresente =
    totalAsistencias > 0
      ? Math.round((totalPresentes / totalAsistencias) * 100)
      : 0;

  const porcentajeFaltas =
    totalAsistencias > 0
      ? Math.round((totalFaltas / totalAsistencias) * 100)
      : 0;

  const porcentajeRetardos =
    totalAsistencias > 0
      ? Math.round((totalRetardos / totalAsistencias) * 100)
      : 0;

  const porcentajeJustificados =
    totalAsistencias > 0
      ? Math.round((totalJustificados / totalAsistencias) * 100)
      : 0;

  const totalActividades = alumnos.reduce(
    (total, alumno) => total + (alumno.actividades?.length || 0),
    0,
  );

  const totalEntregadas = alumnos.reduce(
    (total, alumno) =>
      total +
      (alumno.actividades?.filter(
        (actividad) => actividad.estado === "Entregado",
      ).length || 0),
    0,
  );

  const porcentajeEntregas =
    totalActividades > 0
      ? Math.round((totalEntregadas / totalActividades) * 100)
      : 0;

  const resultados = evaluaciones.flatMap(
    (evaluacion) => evaluacion.resultados || [],
  );

  const calificaciones = resultados
    .map((resultado) => Number(resultado.calificacion))
    .filter((calificacion) => !Number.isNaN(calificacion));

  const promedioGeneral =
    calificaciones.length > 0
      ? (
          calificaciones.reduce(
            (total, calificacion) => total + calificacion,
            0,
          ) / calificaciones.length
        ).toFixed(1)
      : "—";

  const alumnosAtencion = alumnos.filter((alumno) => {
    const materia = alumno.materias.find(
      (m) => m.nombre === claseSeleccionada.materia,
    );
    const faltas =
      materia?.asistencias?.filter(
        (asistencia) => asistencia.estado === "falta",
      ).length || 0;
    const noEntregadas =
      alumno.actividades?.filter(
        (actividad) => actividad.estado === "No entregado",
      ).length || 0;
    return faltas >= 3 || noEntregadas >= 2;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <h1 className="max-w-full truncate text-2xl font-bold text-slate-900 sm:text-3xl">
                {claseSeleccionada.materia}
              </h1>

              <span className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-base font-bold text-white shadow-sm sm:px-4 sm:py-2 sm:text-lg">
                {claseSeleccionada.grado}° {claseSeleccionada.grupo}
              </span>
            </div>

            <div className="w-full overflow-x-auto lg:w-auto">
              <nav className="flex min-w-max items-center gap-1 rounded-lg bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(true);
                    setMostrarAlumnos(false);
                    setMostrarEvaluaciones(false);
                    setMostrarEditarClase(false);
                    setMostrarAsistencias(false);
                    setMostrarActividades(false);
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
                    setMostrarAsistencias(false);
                    setMostrarActividades(false);
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
                    setMostrarAsistencias(true);
                    setMostrarActividades(false);
                    setMostrarEvaluaciones(false);
                    setMostrarEditarClase(false);
                  }}
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
                    mostrarAsistencias
                      ? "bg-white font-semibold text-indigo-600 shadow-sm"
                      : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  Asistencias
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(false);
                    setMostrarAlumnos(false);
                    setMostrarAsistencias(false);
                    setMostrarActividades(true);
                    setMostrarEvaluaciones(false);
                    setMostrarEditarClase(false);
                  }}
                  className={`rounded-md px-3 py-2 text-sm transition sm:px-4 ${
                    mostrarActividades
                      ? "bg-white font-semibold text-indigo-600 shadow-sm"
                      : "font-medium text-slate-500 hover:bg-white hover:text-slate-700"
                  }`}
                >
                  Actividades
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarDetalles(false);
                    setMostrarAlumnos(false);
                    setMostrarEvaluaciones(true);
                    setMostrarEditarClase(false);
                    setMostrarAsistencias(false);
                    setMostrarActividades(false);
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
                    setMostrarAsistencias(false);
                    setMostrarActividades(false);
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

          {mostrarDetalles && (
            <div className="space-y-6">
              <section>
                <div className="mb-5">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Resumen general
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Indicadores generales del desempeño de la clase.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Alumnos registrados
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-slate-900">
                        {alumnos.length}
                      </p>

                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
                        Grupo
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Asistencia general
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-slate-900">
                        {porcentajePresente}%
                      </p>

                      <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                        Presente
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Entrega de trabajos
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-slate-900">
                        {porcentajeEntregas}%
                      </p>

                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                        Entregados
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm font-medium text-slate-500">
                      Promedio general
                    </p>

                    <div className="mt-3 flex items-end justify-between">
                      <p className="text-3xl font-bold text-slate-900">
                        {promedioGeneral}
                      </p>

                      <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                        Evaluaciones
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="grid gap-6 lg:grid-cols-2">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Distribución de asistencia
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Porcentaje general de registros.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-slate-400">
                      {totalAsistencias} registros
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Presente
                        </span>

                        <span className="font-semibold text-slate-800">
                          {porcentajePresente}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${porcentajePresente}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Falta
                        </span>

                        <span className="font-semibold text-slate-800">
                          {porcentajeFaltas}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{ width: `${porcentajeFaltas}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Retardo
                        </span>

                        <span className="font-semibold text-slate-800">
                          {porcentajeRetardos}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{ width: `${porcentajeRetardos}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Justificado
                        </span>

                        <span className="font-semibold text-slate-800">
                          {porcentajeJustificados}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${porcentajeJustificados}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Entrega de actividades
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Seguimiento general de trabajos.
                      </p>
                    </div>

                    <span className="text-sm font-medium text-slate-400">
                      {totalActividades} actividades
                    </span>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Entregadas
                        </span>

                        <span className="font-semibold text-slate-800">
                          {totalActividades > 0
                            ? Math.round(
                                (totalEntregadas / totalActividades) * 100,
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${
                              totalActividades > 0
                                ? (totalEntregadas / totalActividades) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          Pendientes
                        </span>

                        <span className="font-semibold text-slate-800">
                          {totalActividades > 0
                            ? Math.round(
                                (alumnos.reduce(
                                  (total, alumno) =>
                                    total +
                                    (alumno.actividades?.filter(
                                      (actividad) =>
                                        actividad.estado === "Pendiente",
                                    ).length || 0),
                                  0,
                                ) /
                                  totalActividades) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-amber-500"
                          style={{
                            width: `${
                              totalActividades > 0
                                ? (alumnos.reduce(
                                    (total, alumno) =>
                                      total +
                                      (alumno.actividades?.filter(
                                        (actividad) =>
                                          actividad.estado === "Pendiente",
                                      ).length || 0),
                                    0,
                                  ) /
                                    totalActividades) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          No entregadas
                        </span>

                        <span className="font-semibold text-slate-800">
                          {totalActividades > 0
                            ? Math.round(
                                (alumnos.reduce(
                                  (total, alumno) =>
                                    total +
                                    (alumno.actividades?.filter(
                                      (actividad) =>
                                        actividad.estado === "No entregado",
                                    ).length || 0),
                                  0,
                                ) /
                                  totalActividades) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{
                            width: `${
                              totalActividades > 0
                                ? (alumnos.reduce(
                                    (total, alumno) =>
                                      total +
                                      (alumno.actividades?.filter(
                                        (actividad) =>
                                          actividad.estado === "No entregado",
                                      ).length || 0),
                                    0,
                                  ) /
                                    totalActividades) *
                                  100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-semibold text-slate-900">
                      Seguimiento del grupo
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Alumnos que podrían requerir mayor seguimiento académico.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 font-bold text-amber-600">
                      {alumnosAtencion.length}
                    </span>

                    <span className="text-sm font-medium text-slate-600">
                      {alumnosAtencion.length === 1
                        ? "alumno requiere atención"
                        : "alumnos requieren atención"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="font-semibold text-slate-900">
                    Información de la clase
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Datos generales del grupo y periodo escolar.
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

              <div className="grid gap-6 lg:grid-cols-3">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
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

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
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
            </div>
          )}
          {mostrarAlumnos && (
            <SeccionAlumnos
              alumnos={alumnos}
              obtenerAlumnos={obtenerAlumnos}
              claseSeleccionada={claseSeleccionada}
              evaluaciones={evaluaciones}
            />
          )}

          {mostrarEvaluaciones && (
            <Evaluaciones
              alumnos={alumnos}
              evaluaciones={evaluaciones}
              obtenerEvaluaciones={obtenerEvaluaciones}
              claseSeleccionada={claseSeleccionada}
            />
          )}

          {mostrarAsistencias && (
            <Asistencias
              alumnos={alumnos}
              claseSeleccionada={claseSeleccionada}
              obtenerAlumnos={obtenerAlumnos}
            />
          )}

          {mostrarActividades && (
            <Actividades
              alumnos={alumnos}
              claseSeleccionada={claseSeleccionada}
              obtenerAlumnos={obtenerAlumnos}
            />
          )}

          {mostrarEditarClase && (
            <EditarClase
              claseSeleccionada={claseSeleccionada}
              obtenerClaseSeleccionada={obtenerClaseSeleccionada}
              setMostrarEditarClase={setMostrarEditarClase}
              setMostrarDetalles={setMostrarDetalles}
            />
          )}
        </div>
      </main>

      {cargando && <ModalCargando />}
    </div>
  );
}

export default Detalles;
