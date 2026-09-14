import { useState } from "react";
import ModalEvaluacion from "./ModalEvaluacion";
import ModalEditarEvaluacion from "./ModalEditarEvaluacion";
import inicialEvaluacionMongo from "../../Types/TypeEvaluacionMongo";
import type { TypeEvaluacionMongo } from "../../Types/TypeEvaluacionMongo";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";
import type { TypeAlumnoMongo } from "../../Types/TypeAlumnoMongo";

interface Prop {
  alumnos: TypeAlumnoMongo[];
  claseSeleccionada: TypeClaseMongo;
  evaluaciones: TypeEvaluacionMongo[];
  obtenerEvaluaciones: () => Promise<void>;
}

function Evaluaciones({
  alumnos,
  claseSeleccionada,
  evaluaciones,
  obtenerEvaluaciones,
}: Prop) {
  const [motrarModalEvaluacion, setMotrarModalEvaluacion] =
    useState<boolean>(false);

  const [verEvaluacion, setVerEvaluacion] = useState<boolean>(false);

  const [evaluacionSeleccionada, setEvaluacionSeleccionada] =
    useState<TypeEvaluacionMongo>(inicialEvaluacionMongo);

  return (
    <section className="mt-6 space-y-6">
      {/* ENCABEZADO */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Evaluaciones
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta y administra las evaluaciones de esta clase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMotrarModalEvaluacion(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Nueva evaluación
          </button>
        </div>
      </section>

      {/* HISTORIAL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="font-semibold text-slate-900">
          Historial de evaluaciones
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({evaluaciones.length})
          </span>
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona una evaluación para consultarla o editarla.
        </p>

        {evaluaciones.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            No hay evaluaciones registradas.
          </div>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {evaluaciones.map((e) => (
              <button
                key={e._id}
                type="button"
                onClick={() => {
                  setEvaluacionSeleccionada(e);
                  setVerEvaluacion(true);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {e.nombre}
                </p>

                <p className="mt-1 text-sm text-slate-500">{e.materia}</p>

                <p className="mt-1 text-xs text-slate-400">
                  Realizada: {e.fecha}
                </p>

                <p className="mt-3 text-xs font-medium text-indigo-600">
                  Ver evaluación →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {motrarModalEvaluacion && (
        <ModalEvaluacion
          alumnos={alumnos}
          claseSeleccionada={claseSeleccionada}
          setMotrarModalEvaluacion={setMotrarModalEvaluacion}
          obtenerEvaluaciones={obtenerEvaluaciones}
        />
      )}

      {verEvaluacion && (
        <ModalEditarEvaluacion
          setVerEvaluacion={setVerEvaluacion}
          evaluacionSeleccionada={evaluacionSeleccionada}
          alumnos={alumnos}
          obtenerEvaluaciones={obtenerEvaluaciones}
          claseSeleccionada={claseSeleccionada}
        />
      )}
    </section>
  );
}

export default Evaluaciones;
