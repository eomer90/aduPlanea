import { useMemo, useState } from "react";
import type {
  TypeNuevoAlumno,
  TypeActividad,
} from "../../Types/TypeNuevoAlumno";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";
import ModalRevisarActividad from "../alumnos/ModalRevisarActividad";
import EditarActividades from "../alumnos/EditarActividades";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

interface Props {
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClaseMongo;
  obtenerAlumnos: () => Promise<void>;
}

function Actividades({ alumnos, claseSeleccionada, obtenerAlumnos }: Props) {
  const [mostrarNuevaActividad, setMostrarNuevaActividad] =
    useState<boolean>(false);

  const [mostrarEditarActividades, setMostrarEditarActividades] =
    useState<boolean>(false);

  const [actividadSeleccionada, setActividadSeleccionada] =
    useState<TypeActividad | null>(null);

  const actividades = useMemo(() => {
    const actividadesMap = new Map<string, TypeActividad>();

    alumnos.forEach((alumno) => {
      alumno.actividades?.forEach((actividad) => {
        if (String(actividad.claseId) === String(claseSeleccionada._id)) {
          const llave = `${actividad.titulo}-${actividad.fecha}`;

          if (!actividadesMap.has(llave)) {
            actividadesMap.set(llave, actividad);
          }
        }
      });
    });

    return Array.from(actividadesMap.values()).sort((a, b) =>
      b.fecha.localeCompare(a.fecha),
    );
  }, [alumnos, claseSeleccionada._id]);

  return (
    <section className="mt-6 space-y-6">
      {/* ENCABEZADO */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Actividades
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta y administra las actividades revisadas.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarNuevaActividad(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Nueva actividad
          </button>
        </div>
      </section>

      {/* HISTORIAL */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="font-semibold text-slate-900">
          Actividades registradas
          <span className="ml-2 text-sm font-normal text-slate-400">
            ({actividades.length})
          </span>
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecciona una actividad para editarla o eliminarla.
        </p>

        {actividades.length === 0 ? (
          <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">
            No hay actividades registradas.
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {actividades.map((actividad) => (
              <button
                key={`${actividad.titulo}-${actividad.fecha}`}
                type="button"
                onClick={() => {
                  setActividadSeleccionada(actividad);
                  setMostrarEditarActividades(true);
                }}
                className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-800">
                    {actividad.titulo}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Fecha: {actividad.fecha}
                  </p>
                </div>

                <span className="text-sm font-medium text-indigo-600">
                  Editar actividad →
                </span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* NUEVA ACTIVIDAD */}
      {mostrarNuevaActividad && (
        <ModalRevisarActividad
          alumnosOrdenados={alumnos}
          claseSeleccionada={claseSeleccionada}
          setMostrarModalRevisarActividad={setMostrarNuevaActividad}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}

      {/* EDITAR ACTIVIDAD */}
      {mostrarEditarActividades && actividadSeleccionada && (
        <EditarActividades
          alumnos={alumnos}
          claseSeleccionada={claseSeleccionada}
          actividadInicial={{
            titulo: actividadSeleccionada.titulo,
            fecha: actividadSeleccionada.fecha,
          }}
          setMostrarEditarActividades={setMostrarEditarActividades}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}
    </section>
  );
}

export default Actividades;
