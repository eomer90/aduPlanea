import { useState } from "react";
import ModalEvaluacion from "./ModalEvaluacion";
import ModalEditarEvaluacion from "./ModalEditarEvaluacion";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import type { TypeEvaluacion } from "../Types/TypeEvaluacion";
import evaluacionInicial from "../Types/TypeEvaluacion";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeClase = TypeClaseNueva & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

type TypeEvaluacionesSeleccionadas = TypeEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

const nuevaEvaluacion: TypeEvaluacionesSeleccionadas = {
  ...evaluacionInicial,
  claseId: "",
  escuelaId: "",
  usuarioId: "",
  _id: "",
};

interface Prop {
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClase;
  evaluaciones: TypeEvaluacionesSeleccionadas[];
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
    useState<TypeEvaluacionesSeleccionadas>(nuevaEvaluacion);

  return (
    <>
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        {evaluaciones.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <h2 className="text-lg font-semibold text-slate-800">
              Aún no hay evaluaciones
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Agrega una evaluación para comenzar a registrar las
              calificaciones.
            </p>
          </div>
        ) : (
          <div>
            {evaluaciones.map((e) => (
              <button
                key={e._id}
                onClick={() => {
                  setVerEvaluacion(true);
                  setEvaluacionSeleccionada(e);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-800">{e.nombre}</h2>

                  <p className="text-xs text-slate-400">Realizada: {e.fecha}</p>
                </div>

                <p className="mt-1 text-sm text-slate-500">{e.materia}</p>
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setMotrarModalEvaluacion(true)}
          className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          + Agregar una evaluación
        </button>
      </div>
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
    </>
  );
}

export default Evaluaciones;
