import { Fragment, useEffect, useState } from "react";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import type { TypeEvaluacion } from "../Types/TypeEvaluacion";
import contenidosPdaPreescolar from "../components/ContenidosPdaPreescolar";
import evaluacionInicial from "../Types/TypeEvaluacion";

const SERVER = import.meta.env.VITE_API_URL;

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeClase = TypeClaseNueva & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

interface Prop {
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClase;
  setMotrarModalEvaluacion: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerEvaluaciones: () => Promise<void>;
}

export type TypeEscuela = {
  _id: string;
  nombreEscuela: string;
  nivelEducativo: string;
};

function FormEvaluacion({
  alumnos,
  claseSeleccionada,
  setMotrarModalEvaluacion,
  obtenerEvaluaciones,
}: Prop) {
  const [formEvaluacion, setFormEvaluacion] =
    useState<TypeEvaluacion>(evaluacionInicial);

  const [escuelas, setEscuelas] = useState<TypeEscuela[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  // Obtener escuela
  const obtenerEscuelas = async () => {
    try {
      const req = await fetch(`${SERVER}/escuelas`);
      const res = await req.json();

      setEscuelas(res.escuelasEncontradas);
    } catch (error) {
      console.log(error);
    }
  };

  const filtroEscuela = escuelas.filter(
    (e) => e._id === claseSeleccionada.escuelaId,
  );

  // Filtrar contenidos y PDA por grado
  const filtro = contenidosPdaPreescolar
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
    .filter((campo) => campo.contenidos.length > 0);

  // Cambiar datos generales de la evaluación
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormEvaluacion({
      ...formEvaluacion,
      [name]: value,
    });
  };

  // Cambiar datos de un alumno
  const cambiarResultado = (
    alumnoId: string,
    campo: "calificacion" | "nivelDesempeno" | "observaciones",
    value: string,
  ) => {
    const resultadoExiste = formEvaluacion.resultados.find(
      (resultado) => resultado.alumnoId === alumnoId,
    );

    if (resultadoExiste) {
      setFormEvaluacion({
        ...formEvaluacion,
        resultados: formEvaluacion.resultados.map((resultado) =>
          resultado.alumnoId === alumnoId
            ? {
                ...resultado,
                [campo]: value,
              }
            : resultado,
        ),
      });

      return;
    }

    setFormEvaluacion({
      ...formEvaluacion,
      resultados: [
        ...formEvaluacion.resultados,
        {
          alumnoId,
          calificacion: campo === "calificacion" ? value : "",
          nivelDesempeno: campo === "nivelDesempeno" ? value : "",
          observaciones: campo === "observaciones" ? value : "",
          manifestaciones: [],
        },
      ],
    });
  };

  // Cambiar manifestación de un PDA
  const cambiarManifestacion = (
    alumnoId: string,
    pdaId: string,
    value: string,
  ) => {
    const resultadoExiste = formEvaluacion.resultados.find(
      (resultado) => resultado.alumnoId === alumnoId,
    );

    // Si el alumno todavía no tiene resultado
    if (!resultadoExiste) {
      setFormEvaluacion({
        ...formEvaluacion,
        resultados: [
          ...formEvaluacion.resultados,
          {
            alumnoId,
            calificacion: "",
            nivelDesempeno: "",
            observaciones: "",
            manifestaciones: [
              {
                pdaId,
                manifestacion: value,
              },
            ],
          },
        ],
      });

      return;
    }

    // Verificar si ya existe la manifestación de ese PDA
    const manifestacionExiste = resultadoExiste.manifestaciones.find(
      (manifestacion) => manifestacion.pdaId === pdaId,
    );

    // Si ya existe, actualizarla
    if (manifestacionExiste) {
      setFormEvaluacion({
        ...formEvaluacion,
        resultados: formEvaluacion.resultados.map((resultado) =>
          resultado.alumnoId === alumnoId
            ? {
                ...resultado,
                manifestaciones: resultado.manifestaciones.map(
                  (manifestacion) =>
                    manifestacion.pdaId === pdaId
                      ? {
                          ...manifestacion,
                          manifestacion: value,
                        }
                      : manifestacion,
                ),
              }
            : resultado,
        ),
      });

      return;
    }

    // Si no existe, agregarla
    setFormEvaluacion({
      ...formEvaluacion,
      resultados: formEvaluacion.resultados.map((resultado) =>
        resultado.alumnoId === alumnoId
          ? {
              ...resultado,
              manifestaciones: [
                ...resultado.manifestaciones,
                {
                  pdaId,
                  manifestacion: value,
                },
              ],
            }
          : resultado,
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setCargando(true);

      const token = localStorage.getItem("token");

      const evaluacion = {
        ...formEvaluacion,
        materia: claseSeleccionada.materia,
        claseId: claseSeleccionada._id,
      };
      const req = await fetch(`${SERVER}/evaluaciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(evaluacion),
      });

      const res = await req.json();

      if (!req.ok) {
        console.log(res);
        return;
      }

      console.log(res);

      setFormEvaluacion(evaluacionInicial);
      setMotrarModalEvaluacion(false);
      obtenerEvaluaciones();
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerEscuelas();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      {cargando && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
          <p className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-700 shadow">
            Guardando evaluación...
          </p>
        </div>
      )}

      <div className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">
            Agregar evaluación
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Registra la evaluación y los resultados de cada alumno.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* DATOS DE LA EVALUACIÓN */}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Nombre</span>

              <input
                type="text"
                name="nombre"
                value={formEvaluacion.nombre}
                onChange={handleChange}
                placeholder="Ej. Evaluación de fracciones"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Fecha</span>

              <input
                type="date"
                name="fecha"
                value={formEvaluacion.fecha}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Instrumento
              </span>

              <select
                name="instrumento"
                value={formEvaluacion.instrumento}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">Selecciona</option>
                <option value="Examen">Examen</option>
                <option value="Rúbrica">Rúbrica</option>
                <option value="Lista de cotejo">Lista de cotejo</option>
                <option value="Proyecto">Proyecto</option>
                <option value="Observación">Observación</option>

                {filtroEscuela.map((e) => {
                  if (e.nivelEducativo === "Preescolar") {
                    return (
                      <option key="contenidos-pda" value="ContenidosPDA">
                        Contenidos & PDA
                      </option>
                    );
                  }

                  return null;
                })}
              </select>
            </label>
          </div>

          {/* TIPO DE EVALUACIÓN */}

          {formEvaluacion.instrumento !== "ContenidosPDA" && (
            <div className="flex gap-6 border-t border-slate-200 pt-5">
              <p className="text-sm font-medium text-slate-700">
                Seleccciona si la evaluación es
              </p>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formEvaluacion.cuantitativa}
                  onChange={(e) =>
                    setFormEvaluacion({
                      ...formEvaluacion,
                      cuantitativa: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Cuantitativa
                </span>
              </label>

              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formEvaluacion.cualitativa}
                  onChange={(e) =>
                    setFormEvaluacion({
                      ...formEvaluacion,
                      cualitativa: e.target.checked,
                    })
                  }
                  className="h-4 w-4"
                />

                <span className="text-sm font-medium text-slate-700">
                  Cualitativa
                </span>
              </label>
            </div>
          )}

          {/* CONTENIDOS Y PDA */}

          {formEvaluacion.instrumento === "ContenidosPDA" && (
            <div>
              {alumnos.map((a) => (
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

                              const resultado = formEvaluacion.resultados.find(
                                (resultado) => resultado.alumnoId === a._id,
                              );

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
                                      value={manifestacion?.manifestacion || ""}
                                      onChange={(e) =>
                                        cambiarManifestacion(
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
              ))}
            </div>
          )}

          {/* TABLA DE INSTRUMENTOS NORMALES */}

          {formEvaluacion.instrumento !== "ContenidosPDA" &&
            formEvaluacion.instrumento !== "" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[900px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Alumno
                      </th>

                      {formEvaluacion.cuantitativa && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Calificación
                        </th>
                      )}

                      {formEvaluacion.cualitativa && (
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Nivel de desempeño
                        </th>
                      )}

                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Observaciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnos.map((alumno) => {
                      const resultado = formEvaluacion.resultados.find(
                        (resultado) => resultado.alumnoId === alumno._id,
                      );

                      return (
                        <tr
                          key={alumno._id}
                          className="border-t border-slate-200"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            {alumno.nombre} {alumno.apellidoPaterno}{" "}
                            {alumno.apellidoMaterno}
                          </td>

                          {formEvaluacion.cuantitativa && (
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                value={resultado?.calificacion || ""}
                                onChange={(e) =>
                                  cambiarResultado(
                                    alumno._id,
                                    "calificacion",
                                    e.target.value,
                                  )
                                }
                                placeholder="0 - 10"
                                className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                              />
                            </td>
                          )}

                          {formEvaluacion.cualitativa && (
                            <td className="px-4 py-3">
                              <select
                                value={resultado?.nivelDesempeno || ""}
                                onChange={(e) =>
                                  cambiarResultado(
                                    alumno._id,
                                    "nivelDesempeno",
                                    e.target.value,
                                  )
                                }
                                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                              >
                                <option value="">Selecciona</option>
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

                          <td className="px-4 py-3">
                            <textarea
                              value={resultado?.observaciones || ""}
                              onChange={(e) =>
                                cambiarResultado(
                                  alumno._id,
                                  "observaciones",
                                  e.target.value,
                                )
                              }
                              rows={2}
                              placeholder="Observaciones..."
                              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          {/* BOTONES */}

          <div className="flex justify-end gap-2 border-t border-slate-200 pt-5">
            <button
              type="button"
              onClick={() => {
                setFormEvaluacion(evaluacionInicial);
                setMotrarModalEvaluacion(false);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Guardar evaluación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default FormEvaluacion;
