import { useState } from "react";
import type {
  TypeNuevoAlumno,
  TypeActividad,
} from "../../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../../Types/TypeClaseNueva";
import type { TypeNuevaEvaluacion } from "../../Types/TypeNuevaEvaluacion";
import nuevoAlumno from "../../Types/TypeNuevoAlumno";

import FormAlumnos from "./FormAlumnos";

import DetalleAlumno from "./DetalleAlumno";

export type TypeClase = TypeClaseNueva & {
  _id: string;
  escuelaId: string;
  usuarioId: string;
};

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeEvaluacionesSeleccionadas = TypeNuevaEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

interface AlumnosProp {
  alumnos: TypeAlumnos[];
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClase;
  evaluaciones: TypeEvaluacionesSeleccionadas[];
}

function SeccionAlumnos({
  alumnos,
  obtenerAlumnos,
  claseSeleccionada,
  evaluaciones,
}: AlumnosProp) {
  const [formAlumno, setFormAlumno] = useState<TypeNuevoAlumno>(nuevoAlumno);

  const [mostrarFormAlumnos, setMostrarFormALumnos] = useState<boolean>(false);

  const [mostrarBotonAlumnos, setMostrarBotonAlumnos] = useState<boolean>(true);

  const [modalDetalleAlumno, setModalDetalleAlumno] = useState<boolean>(false);

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");

  // const [modalImportar, setModalImportar] = useState<boolean>(false);

  const [filtroAsistencia, setFiltroAsistencia] = useState<
    "dia" | "semana" | "mes"
  >("semana");

  const [filtroActividad, setFiltroActividad] = useState<string>("todas");

  const [filtroEvaluacion, setFiltroEvaluacion] = useState<string>("");

  const [vistaAlumnos, setVistaAlumnos] = useState<
    "asistencia" | "trabajos" | "evaluaciones"
  >("asistencia");

  const [busquedaAlumno, setBusquedaAlumno] = useState<string>("");

  /* =========================================================
     ALUMNOS ORDENADOS
  ========================================================= */

  const alumnosOrdenados = [...alumnos]
    .filter((alumno) => {
      const nombreCompleto =
        `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.toLowerCase();

      return nombreCompleto.includes(busquedaAlumno.toLowerCase());
    })
    .sort((a, b) => a.apellidoPaterno.localeCompare(b.apellidoPaterno));

  /* =========================================================
     RANGO DE ASISTENCIA
  ========================================================= */

  const obtenerRangoPeriodo = () => {
    const hoy = new Date();

    hoy.setHours(23, 59, 59, 999);

    if (filtroAsistencia === "dia") {
      const inicio = new Date(hoy);

      inicio.setHours(0, 0, 0, 0);

      return {
        inicio,
        fin: hoy,
      };
    }

    if (filtroAsistencia === "mes") {
      return {
        inicio: new Date(hoy.getFullYear(), hoy.getMonth(), 1),
        fin: hoy,
      };
    }

    const dia = hoy.getDay();

    const diferencia = dia === 0 ? 6 : dia - 1;

    const inicio = new Date(hoy);

    inicio.setDate(hoy.getDate() - diferencia);

    inicio.setHours(0, 0, 0, 0);

    return {
      inicio,
      fin: hoy,
    };
  };

  /* =========================================================
     ASISTENCIAS DEL PERIODO
  ========================================================= */

  const asistenciasDelPeriodo = (alumno: TypeAlumnos) => {
    const materia = alumno.materias?.find(
      (materia) => materia.nombre === claseSeleccionada.materia,
    );

    if (!materia) return [];

    const { inicio, fin } = obtenerRangoPeriodo();

    return (materia.asistencias || []).filter((asistencia) => {
      if (!asistencia.fecha) return false;

      const fecha = new Date(`${asistencia.fecha}T00:00:00`);

      return fecha >= inicio && fecha <= fin;
    });
  };

  /* =========================================================
     TOTALES DE ASISTENCIA
  ========================================================= */

  const totalPresentes = alumnos.reduce(
    (total, alumno) =>
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "presente",
      ).length,
    0,
  );

  const totalFaltas = alumnos.reduce(
    (total, alumno) =>
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "falta",
      ).length,
    0,
  );

  const totalRetardos = alumnos.reduce(
    (total, alumno) =>
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "retardo",
      ).length,
    0,
  );

  const totalJustificados = alumnos.reduce(
    (total, alumno) =>
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "justificado",
      ).length,
    0,
  );

  /* =========================================================
     ACTIVIDADES DISPONIBLES
  ========================================================= */

  const actividadesDisponibles = Array.from(
    new Set(
      alumnos.flatMap((alumno) =>
        (alumno.actividades ?? []).map((actividad) => actividad.titulo),
      ),
    ),
  ).sort((a, b) => a.localeCompare(b));

  /* =========================================================
     ACTIVIDADES DEL FILTRO
  ========================================================= */

  const actividadesDelFiltro = (alumno: TypeAlumnos): TypeActividad[] => {
    const actividades = alumno.actividades ?? [];

    if (filtroActividad === "todas") {
      return actividades;
    }

    return actividades.filter(
      (actividad) => actividad.titulo === filtroActividad,
    );
  };

  /* =========================================================
     TOTALES DE ACTIVIDADES
  ========================================================= */

  const totalEntregados = alumnos.reduce(
    (total, alumno) =>
      total +
      actividadesDelFiltro(alumno).filter(
        (actividad) => actividad.estado === "Entregado",
      ).length,
    0,
  );

  const totalPendientes = alumnos.reduce(
    (total, alumno) =>
      total +
      actividadesDelFiltro(alumno).filter(
        (actividad) => actividad.estado === "Pendiente",
      ).length,
    0,
  );

  const totalNoEntregados = alumnos.reduce(
    (total, alumno) =>
      total +
      actividadesDelFiltro(alumno).filter(
        (actividad) => actividad.estado === "No entregado",
      ).length,
    0,
  );

  const totalEntregadosTarde = alumnos.reduce(
    (total, alumno) =>
      total +
      actividadesDelFiltro(alumno).filter(
        (actividad) => actividad.estado === "Entregado tarde",
      ).length,
    0,
  );
  /* =========================================================
     EVALUACIONES DISPONIBLES
  ========================================================= */

  const evaluacionesDisponibles = [...evaluaciones].sort((a, b) => {
    const fechaA = new Date(`${a.fecha}T00:00:00`).getTime();

    const fechaB = new Date(`${b.fecha}T00:00:00`).getTime();

    return fechaB - fechaA;
  });

  /* =========================================================
     EVALUACIÓN SELECCIONADA
  ========================================================= */

  const evaluacionSeleccionada = evaluaciones.find(
    (evaluacion) => evaluacion._id === filtroEvaluacion,
  );

  /* =========================================================
     ESTADÍSTICAS DE EVALUACIÓN
  ========================================================= */

  const resultadosEvaluacion = evaluacionSeleccionada?.resultados ?? [];

  const resultadosConCalificacion = resultadosEvaluacion.filter(
    (resultado) => resultado.calificacion !== "",
  );

  const resultadosConNivel = resultadosEvaluacion.filter(
    (resultado) => resultado.nivelDesempeno !== "",
  );

  const promedioEvaluacion =
    resultadosConCalificacion.length > 0
      ? resultadosConCalificacion.reduce(
          (total, resultado) => total + Number(resultado.calificacion || 0),
          0,
        ) / resultadosConCalificacion.length
      : 0;

  const alumnosConResultado = resultadosEvaluacion.length;

  /* =========================================================
     ATENCIÓN REQUERIDA
  ========================================================= */

  const alumnosAtencion = alumnos
    .map((alumno) => {
      const asistencias = asistenciasDelPeriodo(alumno);

      const faltas = asistencias.filter(
        (asistencia) => asistencia.estado === "falta",
      ).length;

      const trabajosNoEntregados =
        alumno.actividades?.filter(
          (actividad) => actividad.estado === "No entregado",
        ).length ?? 0;

      return {
        ...alumno,
        faltas,
        trabajosNoEntregados,
      };
    })
    .filter((alumno) => alumno.faltas >= 3 || alumno.trabajosNoEntregados >= 2)
    .sort((a, b) => {
      const totalA = a.faltas + a.trabajosNoEntregados;

      const totalB = b.faltas + b.trabajosNoEntregados;

      return totalB - totalA;
    });

  /* =========================================================
     VER DETALLES DEL ALUMNO
  ========================================================= */

  const verDetalles = (id: string) => {
    setAlumnoSeleccionado(id);
    setModalDetalleAlumno(true);
  };

  /* =========================================================
     ESTADO DE ASISTENCIA
  ========================================================= */

  const obtenerEstadoAsistencia = (alumno: TypeAlumnos) => {
    const asistencias = asistenciasDelPeriodo(alumno);

    return {
      presente: asistencias.filter((a) => a.estado === "presente").length,

      falta: asistencias.filter((a) => a.estado === "falta").length,

      retardo: asistencias.filter((a) => a.estado === "retardo").length,

      justificado: asistencias.filter((a) => a.estado === "justificado").length,
    };
  };

  /* =========================================================
     ESTADO DE ACTIVIDADES
  ========================================================= */

  const obtenerEstadoActividades = (alumno: TypeAlumnos) => {
    const actividades = actividadesDelFiltro(alumno);

    return {
      entregado: actividades.filter((a) => a.estado === "Entregado").length,

      pendiente: actividades.filter((a) => a.estado === "Pendiente").length,

      noEntregado: actividades.filter((a) => a.estado === "No entregado")
        .length,

      entregadoTarde: actividades.filter((a) => a.estado === "Entregado tarde")
        .length,
    };
  };

  /* =========================================================
     RESULTADO DE EVALUACIÓN
  ========================================================= */

  const obtenerResultadoEvaluacion = (alumnoId: string) => {
    if (!evaluacionSeleccionada) {
      return undefined;
    }

    return evaluacionSeleccionada.resultados.find(
      (resultado) => String(resultado.alumnoId) === String(alumnoId),
    );
  };

  /* =========================================================
     CAMBIAR EVALUACIÓN
  ========================================================= */

  const cambiarEvaluacion = (evaluacionId: string) => {
    setFiltroEvaluacion(evaluacionId);
    setVistaAlumnos("evaluaciones");
  };

  return (
    <section className="mt-6 space-y-6">
      {/* =====================================================
          FORMULARIO / ACCIONES DE ALUMNOS
      ===================================================== */}

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Alumnos</h2>

            <p className="mt-1 text-sm text-slate-500">
              Administra los alumnos de esta clase.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {mostrarBotonAlumnos && (
              <button
                type="button"
                onClick={() => {
                  setMostrarFormALumnos(!mostrarFormAlumnos);
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                {mostrarFormAlumnos ? "Cerrar formulario" : "Agregar alumno"}
              </button>
            )}

            {/* <button
              type="button"
              onClick={() => setModalImportar(true)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Importar
            </button> */}
          </div>
        </div>

        {mostrarFormAlumnos && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            <FormAlumnos
              formAlumno={formAlumno}
              setFormAlumno={setFormAlumno}
              obtenerAlumnos={obtenerAlumnos}
              claseSeleccionada={claseSeleccionada}
              setMostrarFormALumnos={setMostrarFormALumnos}
              setMostrarBotonAlumnos={setMostrarBotonAlumnos}
            />
          </div>
        )}
      </section>

      {/* =====================================================
          RESÚMENES
      ===================================================== */}

      <section className="grid gap-4 lg:grid-cols-2">
        {/* ================= ASISTENCIA ================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">
                Resumen de asistencia
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Asistencia registrada.
              </p>
            </div>

            <select
              value={filtroAsistencia}
              onChange={(e) =>
                setFiltroAsistencia(e.target.value as "dia" | "semana" | "mes")
              }
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400"
            >
              <option value="dia">Día</option>

              <option value="semana">Semana</option>

              <option value="mes">Mes</option>
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-600">Presente</p>

              <p className="mt-1 text-lg font-bold text-emerald-700">
                {totalPresentes}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs text-red-600">Faltas</p>

              <p className="mt-1 text-lg font-bold text-red-700">
                {totalFaltas}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-600">Retardos</p>

              <p className="mt-1 text-lg font-bold text-amber-700">
                {totalRetardos}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs text-blue-600">Justificados</p>

              <p className="mt-1 text-lg font-bold text-blue-700">
                {totalJustificados}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVistaAlumnos("asistencia");
              document.getElementById("lista-alumnos")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Mostrar →
          </button>
        </div>

        {/* ================= ACTIVIDADES ================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">
                Resumen de trabajos
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Estado de las actividades.
              </p>
            </div>

            <select
              value={filtroActividad}
              onChange={(e) => setFiltroActividad(e.target.value)}
              className="max-w-[180px] rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-600 outline-none focus:border-indigo-400"
            >
              <option value="todas">Todas las actividades</option>

              {actividadesDisponibles.map((titulo) => {
                const actividad = alumnos
                  .flatMap((alumno) => alumno.actividades ?? [])
                  .find((actividad) => actividad.titulo === titulo);

                let textoActividad = titulo;

                if (actividad?.fecha) {
                  const fecha = new Date(`${actividad.fecha}T00:00:00`);

                  textoActividad = `${titulo} — ${fecha.toLocaleDateString(
                    "es-MX",
                  )}`;
                }

                return (
                  <option key={titulo} value={titulo}>
                    {textoActividad}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg bg-emerald-50 p-3">
              <p className="text-xs text-emerald-600">Entregados</p>

              <p className="mt-1 text-lg font-bold text-emerald-700">
                {totalEntregados}
              </p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3">
              <p className="text-xs text-amber-600">Pendientes</p>

              <p className="mt-1 text-lg font-bold text-amber-700">
                {totalPendientes}
              </p>
            </div>

            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs text-red-600">No entregados</p>

              <p className="mt-1 text-lg font-bold text-red-700">
                {totalNoEntregados}
              </p>
            </div>

            <div className="rounded-lg bg-orange-50 p-3">
              <p className="text-xs text-orange-600">Entrega tarde</p>

              <p className="mt-1 text-lg font-bold text-orange-700">
                {totalEntregadosTarde}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setVistaAlumnos("trabajos");
              document.getElementById("lista-alumnos")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Mostrar →
          </button>
        </div>
      </section>

      {/* =====================================================
          ATENCIÓN + EVALUACIONES
      ===================================================== */}

      <section className="grid gap-4 lg:grid-cols-2">
        {/* ================= ATENCIÓN ================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Atención requerida</h2>

            <p className="mt-1 text-sm text-slate-500">
              Alumnos que requieren seguimiento.
            </p>
          </div>

          {alumnosAtencion.length === 0 ? (
            <div className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No hay alumnos que requieran atención en este momento.
            </div>
          ) : (
            <div className="space-y-2">
              {alumnosAtencion.slice(0, 5).map((alumno) => (
                <button
                  type="button"
                  key={alumno._id}
                  onClick={() => verDetalles(alumno._id)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-left transition hover:bg-slate-100"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {alumno.nombre} {alumno.apellidoPaterno}{" "}
                      {alumno.apellidoMaterno}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {alumno.faltas} faltas · {alumno.trabajosNoEntregados}{" "}
                      trabajos no entregados
                    </p>
                  </div>

                  <span className="shrink-0 text-slate-400">→</span>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ================= EVALUACIONES ================= */}

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-slate-900">Evaluaciones</h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulta los resultados de cada evaluación.
              </p>
            </div>

            <span className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-600">
              {evaluaciones.length}
            </span>
          </div>

          {evaluaciones.length === 0 ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
              No hay evaluaciones registradas para esta clase.
            </div>
          ) : (
            <>
              <select
                value={filtroEvaluacion}
                onChange={(e) => cambiarEvaluacion(e.target.value)}
                className="mt-4 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
              >
                <option value="">Seleccionar evaluación</option>

                {evaluacionesDisponibles.map((evaluacion) => {
                  let textoEvaluacion = evaluacion.nombre;

                  if (evaluacion.fecha) {
                    const fecha = new Date(`${evaluacion.fecha}T00:00:00`);

                    textoEvaluacion = `${evaluacion.nombre} — ${fecha.toLocaleDateString(
                      "es-MX",
                    )}`;
                  }

                  return (
                    <option key={evaluacion._id} value={evaluacion._id}>
                      {textoEvaluacion}
                    </option>
                  );
                })}
              </select>

              {evaluacionSeleccionada && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-indigo-50 p-3">
                    <p className="text-xs text-indigo-600">Alumnos evaluados</p>

                    <p className="mt-1 text-lg font-bold text-indigo-700">
                      {alumnosConResultado}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      {evaluacionSeleccionada.cuantitativa
                        ? "Promedio"
                        : "Resultados"}
                    </p>

                    <p className="mt-1 text-lg font-bold text-slate-700">
                      {evaluacionSeleccionada.cuantitativa
                        ? promedioEvaluacion.toFixed(1)
                        : resultadosConNivel.length}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!filtroEvaluacion}
                onClick={() => {
                  (setVistaAlumnos("evaluaciones"),
                    document.getElementById("lista-alumnos")?.scrollIntoView({
                      behavior: "smooth",
                    }));
                }}
                className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Mostrar →
              </button>
            </>
          )}
        </section>
      </section>

      {/* =====================================================
          TABLA DE ALUMNOS
      ===================================================== */}

      <section
        id="lista-alumnos"
        className="rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Lista de alumnos</h2>

              <p className="mt-1 text-sm text-slate-500">
                {vistaAlumnos === "asistencia" &&
                  "Consulta la asistencia del periodo seleccionado."}

                {vistaAlumnos === "trabajos" &&
                  "Consulta el estado de las actividades."}

                {vistaAlumnos === "evaluaciones" &&
                  "Consulta los resultados de la evaluación seleccionada."}
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={busquedaAlumno}
                onChange={(e) => setBusquedaAlumno(e.target.value)}
                placeholder="Buscar alumno..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="w-12 px-3 py-3 text-center font-semibold">#</th>

                <th className="px-4 py-3 font-semibold sm:px-6">Alumno</th>

                {vistaAlumnos === "asistencia" && (
                  <>
                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Presente
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Falta
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Retardo
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Justificado
                    </th>
                  </>
                )}

                {vistaAlumnos === "trabajos" && (
                  <>
                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Entregado
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Pendiente
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      No entregado
                    </th>

                    <th className="w-28 px-4 py-3 text-center font-semibold">
                      Entregado tarde
                    </th>
                  </>
                )}

                {vistaAlumnos === "evaluaciones" && (
                  <>
                    <th className="px-4 py-3 font-semibold">Resultado</th>

                    <th className="px-4 py-3 font-semibold">Observaciones</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {alumnosOrdenados.map((alumno) => {
                const asistencia = obtenerEstadoAsistencia(alumno);

                const actividades = obtenerEstadoActividades(alumno);

                const resultado = obtenerResultadoEvaluacion(alumno._id);

                return (
                  <tr key={alumno._id} className="transition hover:bg-slate-50">
                    <td className="w-12 px-3 py-4 text-center text-sm text-slate-400">
                      {alumnosOrdenados.indexOf(alumno) + 1}
                    </td>
                    {/* ALUMNO */}

                    <td className="px-4 py-4 sm:px-6">
                      <button
                        type="button"
                        onClick={() => verDetalles(alumno._id)}
                        className="group text-left"
                      >
                        <span className="font-medium text-slate-800 group-hover:text-indigo-600">
                          {alumno.nombre} {alumno.apellidoPaterno}{" "}
                          {alumno.apellidoMaterno}
                          <span className="ml-1 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-400">
                            →
                          </span>
                        </span>
                      </button>
                    </td>

                    {/* ASISTENCIA */}

                    {vistaAlumnos === "asistencia" && (
                      <>
                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-emerald-600">
                          {asistencia.presente}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-red-600">
                          {asistencia.falta}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-amber-600">
                          {asistencia.retardo}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-blue-600">
                          {asistencia.justificado}
                        </td>
                      </>
                    )}

                    {/* ACTIVIDADES */}

                    {vistaAlumnos === "trabajos" && (
                      <>
                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-emerald-600">
                          {actividades.entregado}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-amber-600">
                          {actividades.pendiente}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-red-600">
                          {actividades.noEntregado}
                        </td>

                        <td className="w-28 px-4 py-4 text-center text-sm font-medium text-orange-600">
                          {actividades.entregadoTarde}
                        </td>
                      </>
                    )}

                    {/* EVALUACIÓN */}

                    {vistaAlumnos === "evaluaciones" && (
                      <>
                        <td className="px-4 py-4 text-sm">
                          {!evaluacionSeleccionada ? (
                            <span className="text-slate-400">
                              Selecciona una evaluación
                            </span>
                          ) : !resultado ? (
                            <span className="text-slate-400">
                              Sin resultado
                            </span>
                          ) : evaluacionSeleccionada.cuantitativa ? (
                            <span className="font-semibold text-indigo-600">
                              {resultado.calificacion || "Sin calificación"}
                            </span>
                          ) : evaluacionSeleccionada.cualitativa ? (
                            <span className="font-medium text-slate-700">
                              {resultado.nivelDesempeno ||
                                "Sin nivel de desempeño"}
                            </span>
                          ) : (
                            <span className="text-slate-400">
                              Sin resultado
                            </span>
                          )}
                        </td>

                        <td className="max-w-md px-4 py-4 text-sm text-slate-600">
                          {resultado?.observaciones || "Sin observaciones"}
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}

              {alumnosOrdenados.length === 0 && (
                <tr>
                  <td
                    colSpan={vistaAlumnos === "evaluaciones" ? 3 : 5}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron alumnos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =====================================================
          MODALES
      ===================================================== */}

      {modalDetalleAlumno && (
        <DetalleAlumno
          alumnoSeleccionado={alumnoSeleccionado}
          setAlumnoSeleccionado={setAlumnoSeleccionado}
          setModalDetalleAlumno={setModalDetalleAlumno}
          obtenerAlumnos={obtenerAlumnos}
          claseSeleccionada={claseSeleccionada}
        />
      )}

      {/* {modalImportar && <ModalImportar setModalImportar={setModalImportar} />} */}
    </section>
  );
}

export default SeccionAlumnos;
