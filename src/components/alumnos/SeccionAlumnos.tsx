import { useState } from "react";
import type {
  TypeNuevoAlumno,
  TypeActividad,
} from "../../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../../Types/TypeClaseNueva";
import nuevoAlumno from "../../Types/TypeNuevoAlumno";
import FormAlumnos from "./FormAlumnos";
import ModalLista from "./ModalLista";
import DetalleAlumno from "./DetalleAlumno";
import ModalImportar from "../ModalImportar";
import ModalRevisarActividad from "./ModalRevisarActividad";

export type TypeClase = TypeClaseNueva & {
  _id: string;
  escuelaId: string;
  usuarioId: string;
};

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

interface AlumnosProp {
  alumnos: TypeAlumnos[];
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClase;
}

function SeccionAlumnos({
  alumnos,
  obtenerAlumnos,
  claseSeleccionada,
}: AlumnosProp) {
  const [formAlumno, setFormAlumno] = useState<TypeNuevoAlumno>(nuevoAlumno);

  const [mostrarFormAlumnos, setMostrarFormALumnos] = useState<boolean>(false);

  const [mostrarBotonAlumnos, setMostrarBotonAlumnos] = useState<boolean>(true);

  const [modalPasarLista, setModalPasarLista] = useState<boolean>(false);

  const [mostrarModalRevisarActividad, setMostrarModalRevisarActividad] =
    useState<boolean>(false);

  const [modalDetalleAlumno, setModalDetalleAlumno] = useState<boolean>(false);

  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");

  const [modalImportar, setModalImportar] = useState<boolean>(false);

  const [filtroAsistencia, setFiltroAsistencia] = useState<"semana" | "mes">(
    "semana",
  );

  const [busquedaAlumno, setBusquedaAlumno] = useState<string>("");

  /*
   * Ordenar alumnos
   */
  const alumnosOrdenados = [...alumnos]
    .filter((alumno) => {
      const nombreCompleto =
        `${alumno.nombre} ${alumno.apellidoPaterno} ${alumno.apellidoMaterno}`.toLowerCase();

      return nombreCompleto.includes(busquedaAlumno.toLowerCase());
    })
    .sort((a, b) => a.apellidoPaterno.localeCompare(b.apellidoPaterno));

  /*
   * Obtener rango del filtro de asistencia
   */
  const obtenerRangoPeriodo = () => {
    const hoy = new Date();

    hoy.setHours(23, 59, 59, 999);

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

  /*
   * Obtener asistencias del periodo seleccionado
   */
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

  /*
   * Totales de asistencia
   */
  const totalAsistencias = alumnos.reduce((total, alumno) => {
    return (
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "presente",
      ).length
    );
  }, 0);

  const totalFaltas = alumnos.reduce((total, alumno) => {
    return (
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "falta",
      ).length
    );
  }, 0);

  const totalRetardos = alumnos.reduce((total, alumno) => {
    return (
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "retardo",
      ).length
    );
  }, 0);

  const totalJustificados = alumnos.reduce((total, alumno) => {
    return (
      total +
      asistenciasDelPeriodo(alumno).filter(
        (asistencia) => asistencia.estado === "justificado",
      ).length
    );
  }, 0);

  /*
   * Totales de actividades
   */
  const totalEntregados = alumnos.reduce((total, alumno) => {
    return (
      total +
      (alumno.actividades?.filter(
        (actividad) => actividad.estado === "Entregado",
      ).length ?? 0)
    );
  }, 0);

  const totalPendientes = alumnos.reduce((total, alumno) => {
    return (
      total +
      (alumno.actividades?.filter(
        (actividad) => actividad.estado === "Pendiente",
      ).length ?? 0)
    );
  }, 0);

  const totalNoEntregados = alumnos.reduce((total, alumno) => {
    return (
      total +
      (alumno.actividades?.filter(
        (actividad) => actividad.estado === "No entregado",
      ).length ?? 0)
    );
  }, 0);

  const totalEntregadosTarde = alumnos.reduce((total, alumno) => {
    return (
      total +
      (alumno.actividades?.filter(
        (actividad) => actividad.estado === "Entregado tarde",
      ).length ?? 0)
    );
  }, 0);

  /*
   * Ver detalles del alumno
   */
  const verDetalles = (id: string) => {
    setModalDetalleAlumno(true);
    setAlumnoSeleccionado(id);
  };

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

  return (
    <section className="mt-6 space-y-6">
      {/* =========================
          RESUMEN DE ASISTENCIA
      ========================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Resumen de asistencia
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Seguimiento del grupo durante el periodo seleccionado
            </p>
          </div>

          <select
            value={filtroAsistencia}
            onChange={(e) =>
              setFiltroAsistencia(e.target.value as "semana" | "mes")
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="semana">Esta semana</option>
            <option value="mes">Este mes</option>
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Presentes</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {totalAsistencias}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Faltas</p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {totalFaltas}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Retardos</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">
              {totalRetardos}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Justificados</p>
            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {totalJustificados}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          RESUMEN DE TRABAJOS
      ========================== */}
      {/* RESUMEN DE TRABAJOS */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="font-semibold text-slate-900">
            Seguimiento de actividades
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Estado de las actividades asignadas al grupo
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Entregados</p>

            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {totalEntregados}
            </p>

            <p className="mt-1 text-xs text-slate-400">Actividades recibidas</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Pendientes</p>

            <p className="mt-1 text-2xl font-bold text-amber-600">
              {totalPendientes}
            </p>

            <p className="mt-1 text-xs text-slate-400">Aún por entregar</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">No entregados</p>

            <p className="mt-1 text-2xl font-bold text-red-600">
              {totalNoEntregados}
            </p>

            <p className="mt-1 text-xs text-slate-400">Requieren seguimiento</p>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Entregados tarde</p>

            <p className="mt-1 text-2xl font-bold text-indigo-600">
              {totalEntregadosTarde}
            </p>

            <p className="mt-1 text-xs text-slate-400">Fuera de plazo</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Atención requerida
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Alumnos que necesitan seguimiento en asistencia o actividades.
          </p>
        </div>

        {alumnosAtencion.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center">
            <p className="text-sm text-slate-500">
              No hay alumnos que requieran atención.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {alumnosAtencion.map((alumno) => (
              <button
                key={alumno._id}
                type="button"
                onClick={() => verDetalles(alumno._id)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-100 px-4 py-3 text-left transition hover:border-indigo-200 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 font-semibold text-red-600">
                    !
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      {alumno.nombre} {alumno.apellidoPaterno}{" "}
                      {alumno.apellidoMaterno}
                    </p>

                    <div className="mt-1 flex gap-3 text-xs">
                      {alumno.faltas >= 3 && (
                        <span className="text-red-600">
                          {alumno.faltas} faltas
                        </span>
                      )}

                      {alumno.trabajosNoEntregados >= 2 && (
                        <span className="text-amber-600">
                          {alumno.trabajosNoEntregados} trabajos no entregados
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="text-lg text-slate-400">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* =========================
          ALUMNOS
      ========================== */}
      {/* ALUMNOS */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-semibold text-slate-900">Alumnos</h2>

              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500">
                {alumnosOrdenados.length}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Seguimiento individual del grupo
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-xs text-slate-400">Grupo</p>

              <p className="text-sm font-semibold text-slate-700">
                {claseSeleccionada.grado}° {claseSeleccionada.grupo}
              </p>
            </div>

            <div className="relative">
              <input
                type="text"
                value={busquedaAlumno}
                onChange={(e) => setBusquedaAlumno(e.target.value)}
                placeholder="Buscar alumno..."
                className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/50 px-6 py-4">
          <p className="text-sm text-slate-500">
            Registra asistencia o revisa el trabajo del grupo.
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModalPasarLista(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Pasar lista
            </button>

            <button
              type="button"
              onClick={() => setMostrarModalRevisarActividad(true)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Revisar actividad
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div className="p-6">
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full">
              <thead>
                {/* GRUPOS */}
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    rowSpan={2}
                    className="w-14 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    N°
                  </th>

                  <th
                    rowSpan={2}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400"
                  >
                    Alumno
                  </th>

                  <th
                    colSpan={3}
                    className="border-l border-slate-200 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Asistencia
                  </th>

                  <th
                    colSpan={4}
                    className="border-l border-slate-200 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500"
                  >
                    Actividades
                  </th>
                </tr>

                {/* COLUMNAS */}
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="w-20 border-l border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Pres.
                  </th>

                  <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Falt.
                  </th>

                  <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Ret.
                  </th>

                  <th className="w-20 border-l border-slate-200 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Ent.
                  </th>

                  <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Pend.
                  </th>

                  <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    No ent.
                  </th>

                  <th className="w-20 px-2 py-2 text-center text-xs font-semibold text-slate-400">
                    Tarde
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {alumnosOrdenados.map((alumno, index) => {
                  const asistencias = asistenciasDelPeriodo(alumno);

                  const presentes = asistencias.filter(
                    (asistencia) => asistencia.estado === "presente",
                  ).length;

                  const faltas = asistencias.filter(
                    (asistencia) => asistencia.estado === "falta",
                  ).length;

                  const retardos = asistencias.filter(
                    (asistencia) => asistencia.estado === "retardo",
                  ).length;

                  const trabajos = alumno.actividades ?? [];

                  const trabajosEntregados = trabajos.filter(
                    (actividad: TypeActividad) =>
                      actividad.estado === "Entregado",
                  ).length;

                  const trabajosPendientes = trabajos.filter(
                    (actividad: TypeActividad) =>
                      actividad.estado === "Pendiente",
                  ).length;

                  const trabajosNoEntregados = trabajos.filter(
                    (actividad: TypeActividad) =>
                      actividad.estado === "No entregado",
                  ).length;

                  const trabajosEntregadosTarde = trabajos.filter(
                    (actividad: TypeActividad) =>
                      actividad.estado === "Entregado tarde",
                  ).length;

                  return (
                    <tr
                      key={alumno._id}
                      className="group transition hover:bg-slate-50"
                    >
                      <td className="px-3 py-4 text-center text-sm text-slate-400">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => verDetalles(alumno._id)}
                          className="font-medium text-slate-700 transition hover:text-indigo-600"
                        >
                          {alumno.nombre} {alumno.apellidoPaterno}{" "}
                          {alumno.apellidoMaterno}
                        </button>
                      </td>

                      {/* ASISTENCIA */}

                      <td className="border-l border-slate-100 px-2 py-4 text-center">
                        <span className="inline-flex min-w-8 justify-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
                          {presentes}
                        </span>
                      </td>

                      <td className="px-2 py-4 text-center">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-sm font-semibold ${
                            faltas > 0
                              ? "bg-red-50 text-red-700"
                              : "text-slate-400"
                          }`}
                        >
                          {faltas}
                        </span>
                      </td>

                      <td className="px-2 py-4 text-center">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-sm font-semibold ${
                            retardos > 0
                              ? "bg-amber-50 text-amber-700"
                              : "text-slate-400"
                          }`}
                        >
                          {retardos}
                        </span>
                      </td>

                      {/* TRABAJOS */}

                      <td className="border-l border-slate-100 px-2 py-4 text-center">
                        <span className="inline-flex min-w-8 justify-center rounded-md bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
                          {trabajosEntregados}
                        </span>
                      </td>

                      <td className="px-2 py-4 text-center">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-sm font-semibold ${
                            trabajosPendientes > 0
                              ? "bg-amber-50 text-amber-700"
                              : "text-slate-400"
                          }`}
                        >
                          {trabajosPendientes}
                        </span>
                      </td>

                      <td className="px-2 py-4 text-center">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-sm font-semibold ${
                            trabajosNoEntregados > 0
                              ? "bg-red-50 text-red-700"
                              : "text-slate-400"
                          }`}
                        >
                          {trabajosNoEntregados}
                        </span>
                      </td>

                      <td className="px-2 py-4 text-center">
                        <span
                          className={`inline-flex min-w-8 justify-center rounded-md px-2 py-1 text-sm font-semibold ${
                            trabajosEntregadosTarde > 0
                              ? "bg-indigo-50 text-indigo-700"
                              : "text-slate-400"
                          }`}
                        >
                          {trabajosEntregadosTarde}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* =========================
            AGREGAR ALUMNOS
        ========================== */}
        <div className="border-t border-slate-200 p-6">
          {mostrarFormAlumnos && (
            <FormAlumnos
              setMostrarFormALumnos={setMostrarFormALumnos}
              formAlumno={formAlumno}
              setFormAlumno={setFormAlumno}
              setMostrarBotonAlumnos={setMostrarBotonAlumnos}
              obtenerAlumnos={obtenerAlumnos}
              claseSeleccionada={claseSeleccionada}
            />
          )}

          {mostrarBotonAlumnos && (
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setMostrarFormALumnos(true);
                  setMostrarBotonAlumnos(false);
                }}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                + Agregar alumno
              </button>

              <button
                type="button"
                onClick={() => setModalImportar(true)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                Importar alumnos de otra clase
              </button>
            </div>
          )}
        </div>
      </section>

      {/* =========================
          MODAL PASAR LISTA
      ========================== */}
      {modalPasarLista && (
        <ModalLista
          alumnosOrdenados={alumnosOrdenados}
          setModalPasarLista={setModalPasarLista}
          obtenerAlumnos={obtenerAlumnos}
          claseSeleccionada={claseSeleccionada}
        />
      )}

      {/* =========================
          MODAL REVISAR ACTIVIDAD
      ========================== */}
      {mostrarModalRevisarActividad && (
        <ModalRevisarActividad
          alumnosOrdenados={alumnosOrdenados}
          setMostrarModalRevisarActividad={setMostrarModalRevisarActividad}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}

      {/* =========================
          MODAL DETALLE ALUMNO
      ========================== */}
      {modalDetalleAlumno && (
        <DetalleAlumno
          alumnoSeleccionado={alumnoSeleccionado}
          setAlumnoSeleccionado={setAlumnoSeleccionado}
          setModalDetalleAlumno={setModalDetalleAlumno}
          obtenerAlumnos={obtenerAlumnos}
          claseSeleccionada={claseSeleccionada}
        />
      )}

      {/* =========================
          MODAL IMPORTAR
      ========================== */}
      {modalImportar && <ModalImportar setModalImportar={setModalImportar} />}
    </section>
  );
}

export default SeccionAlumnos;
