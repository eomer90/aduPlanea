import { useState } from "react";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import nuevoAlumno from "../Types/TypeNuevoAlumno";
import FormAlumnos from "./FormAlumnos";
import ModalLista from "../components/ModalLista";
import DetalleAlumno from "../components/DetalleAlumno";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

interface AlumnosProp {
  alumnos: TypeAlumnos[];
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClaseNueva;
}

function SeccionAlumnos({
  alumnos,
  obtenerAlumnos,
  claseSeleccionada,
}: AlumnosProp) {
  const [formAlumno, setFormAlumno] = useState<TypeNuevoAlumno>(nuevoAlumno);
  const [mostrarFormAlumnos, setMostrarFormALumnos] = useState<Boolean>(false);
  const [mostrarBotonAlumnos, setMostrarBotonAlumnos] = useState<Boolean>(true);
  const [modalPasarLista, setModalPasarLista] = useState<Boolean>(false);
  const [modalDetalleAlumno, setModalDetalleAlumno] = useState<boolean>(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>("");

  const totalAsistencias = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (materia) => materia.nombre === claseSeleccionada.nombre,
    );

    return (
      total +
      (materia?.asistencias.filter((asis) => asis.estado === "presente")
        .length ?? 0)
    );
  }, 0);

  const totalFaltas = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (materia) => materia.nombre === claseSeleccionada.nombre,
    );

    return (
      total +
      (materia?.asistencias.filter((asis) => asis.estado === "falta").length ??
        0)
    );
  }, 0);

  const totalRetardos = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (materia) => materia.nombre === claseSeleccionada.nombre,
    );

    return (
      total +
      (materia?.asistencias.filter((asis) => asis.estado === "retardo")
        .length ?? 0)
    );
  }, 0);

  const totalJustificados = alumnos.reduce((total, alumno) => {
    const materia = alumno.materias.find(
      (materia) => materia.nombre === claseSeleccionada.nombre,
    );

    return (
      total +
      (materia?.asistencias.filter((asis) => asis.estado === "justificado")
        .length ?? 0)
    );
  }, 0);

  const alumnosOrdenados = [...alumnos].sort((a, b) =>
    a.apellidoPaterno.localeCompare(b.apellidoPaterno),
  );

  const verDetalles = (id: string) => {
    setModalDetalleAlumno(true);
    setAlumnoSeleccionado(id);
  };

  return (
    <section className="mt-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-semibold text-slate-900">
            Resumen de asistencia
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Estado general de asistencia del grupo
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-700">Asistencias</p>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {totalAsistencias}
            </p>

            <p className="mt-1 text-xs text-emerald-600">Registros presentes</p>
          </div>

          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">Faltas</p>

            <p className="mt-2 text-3xl font-bold text-red-700">
              {totalFaltas}
            </p>

            <p className="mt-1 text-xs text-red-600">Registros de falta</p>
          </div>

          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-700">Retardos</p>

            <p className="mt-2 text-3xl font-bold text-amber-700">
              {totalRetardos}
            </p>

            <p className="mt-1 text-xs text-amber-600">Llegadas tarde</p>
          </div>

          <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
            <p className="text-sm font-medium text-indigo-700">Justificados</p>

            <p className="mt-2 text-3xl font-bold text-indigo-700">
              {totalJustificados}
            </p>

            <p className="mt-1 text-xs text-indigo-600">Faltas justificadas</p>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
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

        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <p className="text-sm text-slate-500">
            Gestiona la asistencia y evaluación del grupo.
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
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Evaluación
            </button>
          </div>
        </div>

        <div>
          {alumnosOrdenados.length > 0 ? (
            <div className="flex flex-col gap-4 p-6">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="w-10 px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      N°
                    </th>

                    <th className="px-2 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Alumno
                    </th>

                    <th className="w-24 px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Asist.
                    </th>

                    <th className="w-20 px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Faltas
                    </th>

                    <th className="w-20 px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Ret.
                    </th>

                    <th className="w-24 px-1 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Calif.
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {alumnos.map((a, index) => {
                    const materia = a.materias.find(
                      (materia) => materia.nombre === claseSeleccionada.nombre,
                    );

                    const asistencias =
                      materia?.asistencias.filter(
                        (asis) => asis.estado === "presente",
                      ).length ?? 0;

                    const faltas =
                      materia?.asistencias.filter(
                        (asis) => asis.estado === "falta",
                      ).length ?? 0;

                    const retardos =
                      materia?.asistencias.filter(
                        (asis) => asis.estado === "retardo",
                      ).length ?? 0;

                    return (
                      <tr key={a._id} className="transition hover:bg-slate-50">
                        <td className="px-2 py-4 text-sm text-slate-400">
                          {index + 1}
                        </td>

                        <td className="px-2 py-4">
                          <button
                            type="button"
                            className="max-w-full cursor-pointer truncate text-left"
                            onClick={() => verDetalles(a._id)}
                          >
                            <p className="truncate text-sm font-semibold text-slate-700 transition hover:text-indigo-600">
                              {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                            </p>
                          </button>
                        </td>

                        <td className="px-1 py-4 text-center">
                          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-emerald-50 px-2 py-1 text-sm font-semibold text-emerald-700">
                            {asistencias}
                          </span>
                        </td>

                        <td className="px-1 py-4 text-center">
                          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-red-50 px-2 py-1 text-sm font-semibold text-red-700">
                            {faltas}
                          </span>
                        </td>

                        <td className="px-1 py-4 text-center">
                          <span className="inline-flex min-w-7 items-center justify-center rounded-full bg-amber-50 px-2 py-1 text-sm font-semibold text-amber-700">
                            {retardos}
                          </span>
                        </td>

                        <td className="px-1 py-4 text-center">
                          <span className="text-sm font-semibold text-slate-400">
                            —
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="text-sm text-slate-400">
                Todavía no hay alumnos registrados.
              </p>
            </div>
          )}
        </div>

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
            <div className="flex justify-center">
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
            </div>
          )}
        </div>
      </section>

      {modalPasarLista && (
        <ModalLista
          alumnos={alumnos}
          setModalPasarLista={setModalPasarLista}
          obtenerAlumnos={obtenerAlumnos}
          claseSeleccionada={claseSeleccionada}
        />
      )}

      {modalDetalleAlumno && (
        <DetalleAlumno
          alumnoSeleccionado={alumnoSeleccionado}
          setAlumnoSeleccionado={setAlumnoSeleccionado}
          setModalDetalleAlumno={setModalDetalleAlumno}
          obtenerAlumnos={obtenerAlumnos}
          claseSeleccionada={claseSeleccionada}
        />
      )}
    </section>
  );
}

export default SeccionAlumnos;
