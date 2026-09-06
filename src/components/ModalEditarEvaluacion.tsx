import { useEffect, useState } from "react";
import type { TypeEvaluacion } from "../Types/TypeEvaluacion";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

interface Props {
  setVerEvaluacion: React.Dispatch<React.SetStateAction<boolean>>;
  evaluacionSeleccionada: TypeEvaluacion;
  alumnos: TypeAlumnos[];
}

const ModalVerEvaluacion = ({
  setVerEvaluacion,
  evaluacionSeleccionada,
  alumnos,
}: Props) => {
  const [evaluacion, setEvaluacion] = useState<TypeEvaluacion>(
    evaluacionSeleccionada,
  );

  useEffect(() => {
    setEvaluacion(evaluacionSeleccionada);
  }, [evaluacionSeleccionada]);

  // Buscar el resultado de un alumno
  const obtenerResultado = (alumnoId: string) => {
    return evaluacion.resultados.find(
      (resultado) => resultado.alumnoId === alumnoId,
    );
  };

  // Actualizar calificación, nivel u observaciones
  const actualizarResultado = (
    alumnoId: string,
    campo: string,
    valor: string,
  ) => {
    const nuevosResultados = evaluacion.resultados.map((resultado) =>
      resultado.alumnoId === alumnoId
        ? {
            ...resultado,
            [campo]: valor,
          }
        : resultado,
    );

    setEvaluacion({
      ...evaluacion,
      resultados: nuevosResultados,
    });
  };

  // Actualizar una manifestación
  const actualizarManifestacion = (
    alumnoId: string,
    index: number,
    valor: string,
  ) => {
    const nuevosResultados = evaluacion.resultados.map((resultado) =>
      resultado.alumnoId === alumnoId
        ? {
            ...resultado,
            manifestaciones: resultado.manifestaciones.map(
              (manifestacion, i) =>
                i === index
                  ? {
                      ...manifestacion,
                      manifestacion: valor,
                    }
                  : manifestacion,
            ),
          }
        : resultado,
    );

    setEvaluacion({
      ...evaluacion,
      resultados: nuevosResultados,
    });
  };

  // Guardar cambios
  const guardarCambios = async () => {
    try {
      console.log("Evaluación a guardar:", evaluacion);

      // Aquí posteriormente irá el PATCH
      // await fetch(`${SERVER}/evaluaciones/${evaluacion._id}`, ...)
    } catch (error) {
      console.log(error);
    }
  };

  // Imprimir
  const imprimirEvaluacion = () => {
    window.print();
  };

  const esContenidoPDA =
    evaluacion.instrumento.toLowerCase() === "contenidopda";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="modal-evaluacion flex max-h-[95vh] w-full max-w-6xl flex-col rounded-2xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {evaluacion.nombre}
            </h2>

            <p className="mt-1 text-sm text-slate-500">{evaluacion.materia}</p>
          </div>

          <button
            type="button"
            onClick={() => setVerEvaluacion(false)}
            className="no-print rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="overflow-y-auto p-6">
          {/* INFORMACIÓN GENERAL */}
          <div className="mb-6 grid gap-4 rounded-xl bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500">Evaluación</p>

              <p className="font-medium text-slate-800">{evaluacion.nombre}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500">Fecha</p>

              <input
                type="date"
                value={evaluacion.fecha}
                onChange={(e) =>
                  setEvaluacion({
                    ...evaluacion,
                    fecha: e.target.value,
                  })
                }
                className="mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
            </div>

            <div>
              <p className="text-xs text-slate-500">Instrumento</p>

              <p className="font-medium text-slate-800">
                {evaluacion.instrumento}
              </p>
            </div>
          </div>

          {/* ========================= */}
          {/* CONTENIDO PDA */}
          {/* ========================= */}

          {esContenidoPDA ? (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">
                Evaluación por PDA
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[950px] text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Alumno</th>

                      <th className="p-3 text-left">Manifestaciones</th>

                      <th className="p-3 text-left">Calificación</th>

                      <th className="p-3 text-left">Nivel de desempeño</th>

                      <th className="p-3 text-left">Observaciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnos.map((alumno) => {
                      const resultado = obtenerResultado(alumno._id);

                      return (
                        <tr
                          key={alumno._id}
                          className="border-t border-slate-200"
                        >
                          {/* ALUMNO */}
                          <td className="p-3 font-medium">
                            {alumno.nombre} {alumno.apellidoPaterno}{" "}
                            {alumno.apellidoMaterno}
                          </td>

                          {/* MANIFESTACIONES */}
                          <td className="p-3">
                            {resultado?.manifestaciones?.length ? (
                              <div className="space-y-2">
                                {resultado.manifestaciones.map(
                                  (manifestacion, index) => (
                                    <textarea
                                      key={index}
                                      value={manifestacion.manifestacion}
                                      onChange={(e) =>
                                        actualizarManifestacion(
                                          alumno._id,
                                          index,
                                          e.target.value,
                                        )
                                      }
                                      className="w-full rounded-lg border border-slate-300 p-2 text-sm"
                                      rows={2}
                                    />
                                  ),
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">
                                Sin manifestaciones
                              </span>
                            )}
                          </td>

                          {/* CALIFICACIÓN */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={resultado?.calificacion ?? ""}
                              onChange={(e) =>
                                actualizarResultado(
                                  alumno._id,
                                  "calificacion",
                                  e.target.value,
                                )
                              }
                              className="w-24 rounded-lg border border-slate-300 p-2"
                            />
                          </td>

                          {/* NIVEL */}
                          <td className="p-3">
                            <input
                              type="text"
                              value={resultado?.nivelDesempeno ?? ""}
                              onChange={(e) =>
                                actualizarResultado(
                                  alumno._id,
                                  "nivelDesempeno",
                                  e.target.value,
                                )
                              }
                              className="w-32 rounded-lg border border-slate-300 p-2"
                            />
                          </td>

                          {/* OBSERVACIONES */}
                          <td className="p-3">
                            <textarea
                              value={resultado?.observaciones ?? ""}
                              onChange={(e) =>
                                actualizarResultado(
                                  alumno._id,
                                  "observaciones",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 p-2"
                              rows={2}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ========================= */
            /* OTROS INSTRUMENTOS */
            /* ========================= */

            <div>
              <h3 className="mb-3 text-lg font-semibold text-slate-800">
                Resultados
              </h3>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[750px] text-sm">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="p-3 text-left">Alumno</th>

                      {evaluacion.cuantitativa && (
                        <th className="p-3 text-left">Calificación</th>
                      )}

                      {evaluacion.cualitativa && (
                        <th className="p-3 text-left">Nivel de desempeño</th>
                      )}

                      <th className="p-3 text-left">Observaciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnos.map((alumno) => {
                      const resultado = obtenerResultado(alumno._id);

                      return (
                        <tr
                          key={alumno._id}
                          className="border-t border-slate-200"
                        >
                          {/* ALUMNO */}
                          <td className="p-3 font-medium">
                            {alumno.nombre} {alumno.apellidoPaterno}{" "}
                            {alumno.apellidoMaterno}
                          </td>

                          {/* CUANTITATIVA */}
                          {evaluacion.cuantitativa && (
                            <td className="p-3">
                              <input
                                type="text"
                                value={resultado?.calificacion ?? ""}
                                onChange={(e) =>
                                  actualizarResultado(
                                    alumno._id,
                                    "calificacion",
                                    e.target.value,
                                  )
                                }
                                className="w-24 rounded-lg border border-slate-300 p-2"
                              />
                            </td>
                          )}

                          {/* CUALITATIVA */}
                          {evaluacion.cualitativa && (
                            <td className="p-3">
                              <input
                                type="text"
                                value={resultado?.nivelDesempeno ?? ""}
                                onChange={(e) =>
                                  actualizarResultado(
                                    alumno._id,
                                    "nivelDesempeno",
                                    e.target.value,
                                  )
                                }
                                className="w-full rounded-lg border border-slate-300 p-2"
                              />
                            </td>
                          )}

                          {/* OBSERVACIONES */}
                          <td className="p-3">
                            <textarea
                              value={resultado?.observaciones ?? ""}
                              onChange={(e) =>
                                actualizarResultado(
                                  alumno._id,
                                  "observaciones",
                                  e.target.value,
                                )
                              }
                              className="w-full rounded-lg border border-slate-300 p-2"
                              rows={2}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="no-print flex justify-end gap-3 border-t border-slate-200 p-4">
          <button
            type="button"
            onClick={() => setVerEvaluacion(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={imprimirEvaluacion}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
          >
            Imprimir
          </button>

          <button
            type="button"
            onClick={guardarCambios}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalVerEvaluacion;
