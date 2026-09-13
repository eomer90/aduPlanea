import { useMemo, useState } from "react";
import type { TypeAlumnoMongo } from "../../Types/TypeAlumnoMongo";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";
import ModalLista from "../alumnos/ModalLista";
import EditarAsistencias from "../alumnos/EditarAsistencias";

interface Props {
  alumnos: TypeAlumnoMongo[];
  claseSeleccionada: TypeClaseMongo;
  obtenerAlumnos: () => Promise<void>;
}

function Asistencias({ alumnos, claseSeleccionada, obtenerAlumnos }: Props) {
  const [mostrarNuevaAsistencia, setMostrarNuevaAsistencia] =
    useState<boolean>(false);

  const [mostrarEditarAsistencias, setMostrarEditarAsistencias] =
    useState<boolean>(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");

  const fechas = useMemo(() => {
    const fechasUnicas = new Set<string>();

    alumnos.forEach((alumno) => {
      const materia = alumno.materias?.find(
        (materia) => String(materia.claseId) === String(claseSeleccionada._id),
      );

      materia?.asistencias?.forEach((asistencia) => {
        if (asistencia.fecha) {
          fechasUnicas.add(asistencia.fecha);
        }
      });
    });

    return Array.from(fechasUnicas).sort((a, b) => b.localeCompare(a));
  }, [alumnos, claseSeleccionada._id]);

  return (
    <section className="mt-6 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Asistencias
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta y administra las asistencias de esta clase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarNuevaAsistencia(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Nueva asistencia
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="font-semibold text-slate-900">
          Historial de asistencias
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({fechas.length})
          </span>
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona una fecha para editarla o eliminarla.
        </p>

        {fechas.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            No hay asistencias registradas.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fechas.map((fecha) => (
              <button
                key={fecha}
                type="button"
                onClick={() => {
                  setFechaSeleccionada(fecha);
                  setMostrarEditarAsistencias(true);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <p className="text-sm font-semibold text-slate-800">
                  Asistencia del
                </p>

                <p className="mt-1 text-sm text-slate-500">{fecha}</p>

                <p className="mt-3 text-xs font-medium text-indigo-600">
                  Editar asistencia →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {mostrarNuevaAsistencia && (
        <ModalLista
          alumnosOrdenados={alumnos}
          claseSeleccionada={claseSeleccionada}
          setModalPasarLista={setMostrarNuevaAsistencia}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}

      {mostrarEditarAsistencias && (
        <EditarAsistencias
          alumnos={alumnos}
          claseSeleccionada={claseSeleccionada}
          fechaInicial={fechaSeleccionada}
          setMostrarEditarAsistencias={setMostrarEditarAsistencias}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}
    </section>
  );
}

export default Asistencias;
