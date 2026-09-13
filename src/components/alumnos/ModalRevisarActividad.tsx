import { useState } from "react";
import type { TypeNuevoAlumno } from "../../Types/TypeNuevoAlumno";
import ModalCargando from "../ModalCargando";
import type { TypeClase } from "./SeccionAlumnos";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeActividad = {
  claseId: string;
  titulo: string;
  fecha: string;
  estado: "Pendiente" | "Entregado" | "No entregado" | "Entregado tarde";
  observaciones: string;
};

type TypeActividadAlumno = {
  alumnoId: string;
  estado: "Pendiente" | "Entregado" | "No entregado" | "Entregado tarde";
  observaciones: string;
};

interface AlumnosProp {
  alumnosOrdenados: TypeAlumnos[];
  claseSeleccionada: TypeClase;
  setMostrarModalRevisarActividad: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  obtenerAlumnos: () => Promise<void>;
}

const SERVER = import.meta.env.VITE_API_URL;
const ROUTE2 = "/alumnos";

function ModalRevisarActividad({
  alumnosOrdenados,
  claseSeleccionada,
  setMostrarModalRevisarActividad,
  obtenerAlumnos,
}: AlumnosProp) {
  const [actividad, setActividad] = useState({
    titulo: "",
    fecha: "",
  });

  const [actividadesAlumnos, setActividadesAlumnos] = useState<
    TypeActividadAlumno[]
  >(
    alumnosOrdenados.map((alumno) => ({
      alumnoId: alumno._id,
      estado: "Pendiente",
      observaciones: "",
    })),
  );

  const [cargando, setCargando] = useState(false);

  const handleChangeActividad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setActividad({
      ...actividad,
      [name]: value,
    });
  };

  const cambiarEstado = (
    alumnoId: string,
    estado: TypeActividadAlumno["estado"],
  ) => {
    const nuevasActividades = actividadesAlumnos.map((actividadAlumno) =>
      actividadAlumno.alumnoId === alumnoId
        ? {
            ...actividadAlumno,
            estado,
          }
        : actividadAlumno,
    );

    setActividadesAlumnos(nuevasActividades);
  };

  const cambiarObservaciones = (alumnoId: string, observaciones: string) => {
    const nuevasActividades = actividadesAlumnos.map((actividadAlumno) =>
      actividadAlumno.alumnoId === alumnoId
        ? {
            ...actividadAlumno,
            observaciones,
          }
        : actividadAlumno,
    );

    setActividadesAlumnos(nuevasActividades);
  };

  const guardarActividad = async () => {
    if (!actividad.titulo || !actividad.fecha) {
      return;
    }

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      for (const alumno of alumnosOrdenados) {
        const actividadAlumno = actividadesAlumnos.find(
          (actividad) => actividad.alumnoId === alumno._id,
        );

        if (!actividadAlumno) continue;

        const nuevaActividad: TypeActividad = {
          claseId: claseSeleccionada._id,
          titulo: actividad.titulo,
          fecha: actividad.fecha,
          estado: actividadAlumno.estado,
          observaciones: actividadAlumno.observaciones,
        };

        const nuevasActividades = [
          ...(alumno.actividades || []),
          nuevaActividad,
        ];

        await fetch(`${SERVER}${ROUTE2}/${alumno._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            actividades: nuevasActividades,
          }),
        });
      }

      await obtenerAlumnos();

      setMostrarModalRevisarActividad(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {cargando && <ModalCargando />}

      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-3 sm:items-center sm:p-4">
        <div className="my-auto flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl sm:max-h-[90vh]">
          {/* Header */}
          <div className="shrink-0 border-b border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
                  Agregar actividad
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registra la actividad y el estado de cada alumno.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMostrarModalRevisarActividad(false)}
                className="shrink-0 rounded-lg px-2 py-1 text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          </div>

          {/* Contenido */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {/* Datos de la actividad */}
            <div className="mb-6">
              <h3 className="mb-4 font-semibold text-slate-800">
                Datos de la actividad
              </h3>

              <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-600">
                      Título
                    </label>

                    <input
                      type="text"
                      name="titulo"
                      value={actividad.titulo}
                      onChange={handleChangeActividad}
                      placeholder="Ej. Tarea de matemáticas"
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-semibold text-slate-600">
                      Fecha
                    </label>

                    <input
                      type="date"
                      name="fecha"
                      value={actividad.fecha}
                      onChange={handleChangeActividad}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alumnos */}
            <div>
              <div className="mb-3">
                <h3 className="font-semibold text-slate-800">Alumnos</h3>

                <p className="mt-1 text-xs text-slate-500">
                  Selecciona el estado y agrega observaciones.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[750px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Alumno
                      </th>

                      <th className="w-52 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Estado
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Observaciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnosOrdenados.map((alumno) => {
                      const actividadAlumno = actividadesAlumnos.find(
                        (actividad) => actividad.alumnoId === alumno._id,
                      );

                      return (
                        <tr
                          key={alumno._id}
                          className="border-t border-slate-200"
                        >
                          {/* Alumno */}
                          <td className="px-4 py-3 text-sm font-medium text-slate-700">
                            {alumno.nombre} {alumno.apellidoPaterno}{" "}
                            {alumno.apellidoMaterno}
                          </td>

                          {/* Estado */}
                          <td className="px-4 py-3">
                            <select
                              value={actividadAlumno?.estado || "Pendiente"}
                              onChange={(e) =>
                                cambiarEstado(
                                  alumno._id,
                                  e.target
                                    .value as TypeActividadAlumno["estado"],
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            >
                              <option value="Pendiente">Pendiente</option>

                              <option value="Entregado">Entregado</option>

                              <option value="No entregado">No entregado</option>

                              <option value="Entregado tarde">
                                Entregado tarde
                              </option>
                            </select>
                          </td>

                          {/* Observaciones */}
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={actividadAlumno?.observaciones || ""}
                              onChange={(e) =>
                                cambiarObservaciones(alumno._id, e.target.value)
                              }
                              placeholder="Observaciones..."
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 border-t border-slate-200 px-4 py-4 sm:px-6">
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
              <button
                type="button"
                onClick={() => setMostrarModalRevisarActividad(false)}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={guardarActividad}
                disabled={!actividad.titulo || !actividad.fecha || cargando}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Guardar actividad
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalRevisarActividad;
