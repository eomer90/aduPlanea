import { useState } from "react";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import ModalCargando from "./ModalCargando";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeActividad = {
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
  alumnos: TypeAlumnos[];
  setMostrarModalRevisarActividad: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  obtenerAlumnos: () => Promise<void>;
}

const SERVER = import.meta.env.VITE_API_URL;
const ROUTE2 = "/alumnos";

function ModalRevisarActividad({
  alumnos,
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
    alumnos.map((alumno) => ({
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
      for (const alumno of alumnos) {
        const actividadAlumno = actividadesAlumnos.find(
          (actividad) => actividad.alumnoId === alumno._id,
        );

        if (!actividadAlumno) continue;

        const nuevaActividad: TypeActividad = {
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

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Agregar actividad
              </h2>

              <p className="text-sm text-slate-500">
                Registra la actividad y el estado de cada alumno
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMostrarModalRevisarActividad(false)}
              className="text-2xl text-slate-400 hover:text-slate-700"
            >
              ×
            </button>
          </div>

          {/* Contenido */}
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <h3 className="mb-4 font-semibold text-slate-800">
              Datos de la actividad
            </h3>
            {/* Datos de la actividad */}
            <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Alumnos */}
            <div>
              <h3 className="mb-3 font-semibold text-slate-800">Alumnos</h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Alumno
                      </th>

                      <th className="w-48 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Estado
                      </th>

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">
                        Observaciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnos.map((alumno) => {
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
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
                              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
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
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={() => setMostrarModalRevisarActividad(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={guardarActividad}
              disabled={!actividad.titulo || !actividad.fecha || cargando}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar actividad
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ModalRevisarActividad;
