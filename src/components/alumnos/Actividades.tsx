import { useMemo, useState } from "react";
import ModalRevisarActividad from "../alumnos/ModalRevisarActividad";
import EditarActividades from "../alumnos/EditarActividades";
import type { TypeAlumnoMongo } from "../../Types/TypeAlumnoMongo";
import type { TypeActividad } from "../../Types/TypeNuevoAlumno";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";

interface Props {
  alumnos: TypeAlumnoMongo[];
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

  const alumnosOrdenados = useMemo(() => {
    return [...alumnos].sort((a, b) => {
      const apellidoPaterno = a.apellidoPaterno.localeCompare(
        b.apellidoPaterno,
        "es",
        { sensitivity: "base" },
      );

      if (apellidoPaterno !== 0) {
        return apellidoPaterno;
      }

      const apellidoMaterno = a.apellidoMaterno.localeCompare(
        b.apellidoMaterno,
        "es",
        { sensitivity: "base" },
      );

      if (apellidoMaterno !== 0) {
        return apellidoMaterno;
      }

      return a.nombre.localeCompare(b.nombre, "es", {
        sensitivity: "base",
      });
    });
  }, [alumnos]);

  return (
    <section className="mt-6 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Actividades
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Consulta y administra las actividades de esta clase.
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

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="font-semibold text-slate-900">
          Historial de actividades
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
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actividades.map((actividad) => (
              <button
                key={`${actividad.titulo}-${actividad.fecha}`}
                type="button"
                onClick={() => {
                  setActividadSeleccionada(actividad);
                  setMostrarEditarActividades(true);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-300 hover:bg-indigo-50"
              >
                <p className="text-sm font-semibold text-slate-800">
                  {actividad.titulo}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Fecha: {actividad.fecha}
                </p>

                <p className="mt-3 text-xs font-medium text-indigo-600">
                  Editar actividad →
                </p>
              </button>
            ))}
          </div>
        )}
      </section>

      {mostrarNuevaActividad && (
        <ModalRevisarActividad
          alumnosOrdenados={alumnosOrdenados}
          claseSeleccionada={claseSeleccionada}
          setMostrarModalRevisarActividad={setMostrarNuevaActividad}
          obtenerAlumnos={obtenerAlumnos}
        />
      )}

      {mostrarEditarActividades && actividadSeleccionada && (
        <EditarActividades
          alumnos={alumnosOrdenados}
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
