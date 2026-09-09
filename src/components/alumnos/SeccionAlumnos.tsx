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

  /*
   * Ordenar alumnos
   */
  const alumnosOrdenados = [...alumnos].sort((a, b) =>
    a.apellidoPaterno.localeCompare(b.apellidoPaterno),
  );

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

  return (
    <section className="mt-6 space-y-6">
      {/* =========================
          RESUMEN DE ASISTENCIA
      ========================== */}
      {/* =========================
    RESUMEN DE ASISTENCIA
========================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Resumen de asistencia
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Asistencia del grupo durante el periodo seleccionado
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-500">
            Filtro por:
            <select
              value={filtroAsistencia}
              onChange={(e) =>
                setFiltroAsistencia(e.target.value as "semana" | "mes")
              }
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500"
            >
              <option value="semana">Semana</option>

              <option value="mes">Mes</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* ASISTENCIAS */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-700">Asistencias</p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {totalAsistencias}
            </p>

            <p className="mt-1 text-xs text-emerald-600">Registros presentes</p>
          </div>

          {/* FALTAS */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">Faltas</p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {totalFaltas}
            </p>

            <p className="mt-1 text-xs text-red-600">Registros de falta</p>
          </div>

          {/* RETARDOS */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">Retardos</p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {totalRetardos}
            </p>

            <p className="mt-1 text-xs text-amber-600">Llegadas tarde</p>
          </div>

          {/* JUSTIFICADOS */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-700">Justificados</p>

            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {totalJustificados}
            </p>

            <p className="mt-1 text-xs text-indigo-600">Faltas justificadas</p>
          </div>
        </div>
      </section>

      {/* =========================
          RESUMEN DE TRABAJOS
      ========================== */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">Resumen de trabajos</h2>

          <p className="mt-1 text-sm text-slate-500">
            Estado general de las actividades del grupo
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* ENTREGADOS */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-700">Entregados</p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {totalEntregados}
            </p>
          </div>

          {/* PENDIENTES */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">Pendientes</p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {totalPendientes}
            </p>
          </div>

          {/* NO ENTREGADOS */}
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">No entregados</p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {totalNoEntregados}
            </p>
          </div>

          {/* ENTREGADOS TARDE */}
          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-700">
              Entregados tarde
            </p>

            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {totalEntregadosTarde}
            </p>
          </div>
        </div>
      </section>

      {/* =========================
          ALUMNOS
      ========================== */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="font-semibold text-slate-900">Alumnos</h2>

            <p className="mt-1 text-sm text-slate-500">
              Alumnos inscritos en esta clase
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
            {alumnos.length} alumno(s)
          </span>
        </div>

        {/* ACCIONES */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Gestiona la asistencia y las actividades del grupo.
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
              Revisar una actividad
            </button>
          </div>
        </div>

        {/* TABLA */}
        <div>
          {alumnos.length > 0 ? (
            <div className="p-6">
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      {/* NÚMERO */}
                      <th className="w-12 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                        N°
                      </th>

                      {/* ALUMNO */}
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Alumno
                      </th>

                      {/* PRESENTES */}
                      <th className="w-20 px-2 py-3 text-center text-xs font-semibold text-slate-500">
                        Pres.
                      </th>

                      {/* FALTAS */}
                      <th className="w-20 px-2 py-3 text-center text-xs font-semibold text-slate-500">
                        Falt.
                      </th>

                      {/* ENTREGADOS */}
                      <th className="w-20 px-2 py-3 text-center text-xs font-semibold text-slate-500">
                        Ent.
                      </th>

                      {/* NO ENTREGADOS */}
                      <th className="w-20 px-2 py-3 text-center text-xs font-semibold text-slate-500">
                        No ent.
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

                      const trabajos = alumno.actividades ?? [];

                      const trabajosEntregados = trabajos.filter(
                        (actividad: TypeActividad) =>
                          actividad.estado === "Entregado",
                      ).length;

                      const trabajosNoEntregados = trabajos.filter(
                        (actividad: TypeActividad) =>
                          actividad.estado === "No entregado",
                      ).length;

                      return (
                        <tr
                          key={alumno._id}
                          className="transition hover:bg-slate-50"
                        >
                          {/* NÚMERO DE LISTA */}
                          <td className="px-3 py-4 text-center text-sm font-medium text-slate-500">
                            {index + 1}
                          </td>

                          {/* ALUMNO */}
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() => verDetalles(alumno._id)}
                              className="text-left text-sm font-semibold text-slate-700 hover:text-indigo-600"
                            >
                              {alumno.nombre} {alumno.apellidoPaterno}{" "}
                              {alumno.apellidoMaterno}
                            </button>
                          </td>

                          {/* PRESENTES */}
                          <td className="px-2 py-4 text-center">
                            <span className="font-semibold text-emerald-600">
                              {presentes}
                            </span>
                          </td>

                          {/* FALTAS */}
                          <td className="px-2 py-4 text-center">
                            <span className="font-semibold text-red-600">
                              {faltas}
                            </span>
                          </td>

                          {/* ENTREGADOS */}
                          <td className="px-2 py-4 text-center">
                            <span className="font-semibold text-emerald-600">
                              {trabajosEntregados}
                            </span>
                          </td>

                          {/* NO ENTREGADOS */}
                          <td className="px-2 py-4 text-center">
                            <span className="font-semibold text-red-600">
                              {trabajosNoEntregados}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-400">
                Todavía no hay alumnos registrados.
              </p>
            </div>
          )}
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
