import { Fragment, useEffect, useState } from "react";
import type { TypeEvaluacion } from "../../Types/TypeNuevaEvaluacion";
import type { TypeNuevoAlumno } from "../../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../../Types/TypeClaseNueva";
import contenidosPdaPreescolar from "../../components/ContenidosPdaPreescolar";

const SERVER = import.meta.env.VITE_API_URL;

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeEvaluacionesSeleccionadas = TypeEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

interface Props {
  setVerEvaluacion: React.Dispatch<React.SetStateAction<boolean>>;
  evaluacionSeleccionada: TypeEvaluacionesSeleccionadas;
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClaseNueva;
  obtenerEvaluaciones: () => Promise<void>;
}

function ModalVerEvaluacion({
  setVerEvaluacion,
  evaluacionSeleccionada,
  alumnos,
  claseSeleccionada,
  obtenerEvaluaciones,
}: Props) {
  const [evaluacion, setEvaluacion] = useState<TypeEvaluacion>(
    evaluacionSeleccionada,
  );
  const [cargando, setCargando] = useState<boolean>(false);

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
    valor: string | number,
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
    pdaId: string,
    valor: string,
  ) => {
    const nuevosResultados = evaluacion.resultados.map((resultado) =>
      resultado.alumnoId === alumnoId
        ? {
            ...resultado,
            manifestaciones: resultado.manifestaciones.map((manifestacion) =>
              manifestacion.pdaId === pdaId
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
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/evaluaciones`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluacion),
      });
      const res = await req.json();
      obtenerEvaluaciones();
      setVerEvaluacion(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarEvaluacion = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/evaluaciones`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          _id: evaluacionSeleccionada._id,
        }),
      });
      const res = await req.json();
      obtenerEvaluaciones();
      setVerEvaluacion(false);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  // Imprimir
  const imprimirEvaluacion = () => {
    window.print();
  };

  const esContenidoPDA =
    evaluacion.instrumento.toLowerCase() === "contenidospda";

  const filtro = claseSeleccionada
    ? contenidosPdaPreescolar
        .map((campo) => {
          const contenidosFiltrados = campo.contenidos
            .map((contenido) => {
              const pdasFiltrados = contenido.pdas.filter(
                (pda) => pda.grado === claseSeleccionada.grado,
              );

              return {
                ...contenido,
                pdas: pdasFiltrados,
              };
            })
            .filter((contenido) => contenido.pdas.length > 0);

          return {
            ...campo,
            contenidos: contenidosFiltrados,
          };
        })
        .filter((campo) => campo.contenidos.length > 0)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {cargando && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <p className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow">
            Cargando...
          </p>
        </div>
      )}
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

              <div>
                {alumnos.map((a) => {
                  const resultado = obtenerResultado(a._id);

                  return (
                    <div
                      key={a._id}
                      className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <table className="w-full table-fixed border-collapse">
                        <thead>
                          <tr>
                            <th
                              colSpan={2}
                              className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-lg font-semibold text-slate-800"
                            >
                              {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {filtro.map((f) => (
                            <Fragment key={f.id}>
                              {/* Campo formativo */}

                              <tr>
                                <td
                                  colSpan={2}
                                  className="border-b border-slate-200 bg-indigo-50 px-4 py-3 text-left text-base font-semibold text-indigo-700"
                                >
                                  {f.nombre}
                                </td>
                              </tr>

                              {/* Encabezados */}

                              <tr>
                                <th className="w-1/2 border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                  PDAs
                                </th>

                                <th className="w-1/2 border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                  Manifestaciones del alumno
                                </th>
                              </tr>

                              {/* PDAs */}

                              {f.contenidos.map((c) =>
                                c.pdas.map((p) => {
                                  const pdaId = `${c.id}-${p.id}`;

                                  const manifestacion =
                                    resultado?.manifestaciones.find(
                                      (manifestacion) =>
                                        manifestacion.pdaId === pdaId,
                                    );

                                  return (
                                    <tr key={`${a._id}-${pdaId}`}>
                                      <td className="w-1/2 border-b border-slate-100 px-4 py-4 align-top text-sm text-slate-700">
                                        <p>{p.descripcion}</p>
                                      </td>

                                      <td className="w-1/2 border-b border-slate-100 px-4 py-4 align-top">
                                        <textarea
                                          value={
                                            manifestacion?.manifestacion || ""
                                          }
                                          onChange={(e) =>
                                            actualizarManifestacion(
                                              a._id,
                                              pdaId,
                                              e.target.value,
                                            )
                                          }
                                          rows={6}
                                          placeholder="Escribe la manifestación del alumno..."
                                          className="w-full resize-none rounded-lg border border-slate-300 px-3 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                      </td>
                                    </tr>
                                  );
                                }),
                              )}
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
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

                      console.log(
                        alumno.nombre,
                        "Nivel guardado:",
                        resultado?.nivelDesempeno,
                      );

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
                              <select
                                value={resultado?.nivelDesempeno ?? ""}
                                onChange={(e) =>
                                  actualizarResultado(
                                    alumno._id,
                                    "nivelDesempeno",
                                    e.target.value,
                                  )
                                }
                                className="w-40 rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                              >
                                <option value="">Seleccionar</option>
                                <option value="Requiere apoyo">
                                  Requiere apoyo
                                </option>
                                <option value="En desarrollo">
                                  En desarrollo
                                </option>
                                <option value="Satisfactorio">
                                  Satisfactorio
                                </option>
                                <option value="Destacado">Destacado</option>
                              </select>
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
            onClick={eliminarEvaluacion}
            className="mr-auto rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
          >
            Eliminar evaluación
          </button>
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
}

export default ModalVerEvaluacion;
