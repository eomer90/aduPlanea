import { Fragment, useEffect, useMemo, useState } from "react";
import contenidosPdaPreescolar from "../../components/ContenidosPdaPreescolar";
import evaluacionInicial from "../../Types/TypeNuevaEvaluacion";
import type { TypeAlumnoMongo } from "../../Types/TypeAlumnoMongo";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";
import type { TypeNuevaEvaluacion } from "../../Types/TypeNuevaEvaluacion";

const SERVER = import.meta.env.VITE_API_URL;

interface Prop {
  alumnos: TypeAlumnoMongo[];
  claseSeleccionada: TypeClaseMongo;
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
    useState<TypeNuevaEvaluacion>(evaluacionInicial);

  const [escuelas, setEscuelas] = useState<TypeEscuela[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  // ==========================================
  // ORDENAR ALUMNOS
  // ==========================================

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

  // ==========================================
  // OBTENER ESCUELAS
  // ==========================================

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

  // ==========================================
  // FILTRAR CONTENIDOS Y PDA POR GRADO
  // ==========================================

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

  // ==========================================
  // CAMBIAR DATOS GENERALES
  // ==========================================

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

  // ==========================================
  // CAMBIAR SI EL ALUMNO REALIZÓ LA EVALUACIÓN
  // ==========================================

  const cambiarRealizoEvaluacion = (
    alumnoId: string,
    realizoEvaluacion: boolean,
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
                realizoEvaluacion,

                // Si cambia a "No realizó",
                // se elimina calificación y nivel.
                ...(realizoEvaluacion
                  ? {}
                  : {
                      calificacion: "",
                      nivelDesempeno: "",
                    }),
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
          realizoEvaluacion,
          calificacion: "",
          nivelDesempeno: "",
          observaciones: realizoEvaluacion ? "" : "No presentó la evaluación",
          manifestaciones: [],
        },
      ],
    });
  };

  // ==========================================
  // CAMBIAR DATOS DE UN ALUMNO
  // ==========================================

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
          realizoEvaluacion: true,
          calificacion: campo === "calificacion" ? value : "",
          nivelDesempeno: campo === "nivelDesempeno" ? value : "",
          observaciones: campo === "observaciones" ? value : "",
          manifestaciones: [],
        },
      ],
    });
  };

  // ==========================================
  // CAMBIAR MANIFESTACIÓN DE UN PDA
  // ==========================================

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
            realizoEvaluacion: true,
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

    // Verificar si ya existe la manifestación
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

  // ==========================================
  // GUARDAR EVALUACIÓN
  // ==========================================

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // ==========================================
    // VALIDAR EVALUACIONES NORMALES
    // ==========================================

    if (formEvaluacion.instrumento !== "ContenidosPDA") {
      // ------------------------------------------
      // VALIDAR QUE LOS QUE SÍ REALIZARON
      // TENGAN CALIFICACIÓN Y NIVEL
      // ------------------------------------------

      const resultadosIncompletos = alumnos.some((alumno) => {
        const resultado = formEvaluacion.resultados.find(
          (resultado) => String(resultado.alumnoId) === String(alumno._id),
        );

        // Si no realizó o todavía no ha respondido,
        // no necesita calificación ni nivel.
        if (resultado?.realizoEvaluacion !== true) {
          return false;
        }

        // Si sí realizó, ambos campos son obligatorios.
        return !resultado.calificacion || !resultado.nivelDesempeno;
      });

      if (resultadosIncompletos) {
        alert(
          "Debes registrar la calificación y el nivel de desempeño de todos los alumnos que realizaron la evaluación.",
        );

        return;
      }

      // ------------------------------------------
      // VALIDAR QUE TODOS HAYAN RESPONDIDO SÍ O NO
      // ------------------------------------------

      const alumnosSinRespuesta = alumnos.some((alumno) => {
        const resultado = formEvaluacion.resultados.find(
          (resultado) => String(resultado.alumnoId) === String(alumno._id),
        );

        // No existe resultado
        if (!resultado) {
          return true;
        }

        // Existe, pero todavía no seleccionó Sí o No
        if (resultado.realizoEvaluacion === null) {
          return true;
        }

        return false;
      });

      if (alumnosSinRespuesta) {
        alert(
          "Debes indicar si todos los alumnos realizaron o no la evaluación.",
        );

        return;
      }
    }

    try {
      setCargando(true);

      const token = localStorage.getItem("token");

      const evaluacion = {
        ...formEvaluacion,

        // En evaluaciones normales ambos están activos
        ...(formEvaluacion.instrumento !== "ContenidosPDA" && {
          cuantitativa: true,
          cualitativa: true,
        }),

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

  // ==========================================
  // OBTENER ESCUELAS AL CARGAR
  // ==========================================

  useEffect(() => {
    obtenerEscuelas();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:items-center sm:px-4 sm:py-6">
      {cargando && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 px-4">
          <p className="rounded-lg bg-white px-5 py-3 text-center text-sm font-medium text-slate-700 shadow">
            Guardando evaluación...
          </p>
        </div>
      )}

      <div className="my-auto max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 shadow-xl sm:max-h-[90vh] sm:p-6 lg:p-8">
        {/* ========================================== */}
        {/* ENCABEZADO */}
        {/* ========================================== */}

        <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
              Agregar evaluación
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Registra la evaluación y los resultados de cada alumno.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setFormEvaluacion(evaluacionInicial);
              setMotrarModalEvaluacion(false);
            }}
            className="self-end rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:self-start"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========================================== */}
          {/* DATOS DE LA EVALUACIÓN */}
          {/* ========================================== */}

          <div className="grid gap-4 md:grid-cols-3">
            {/* NOMBRE */}

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

            {/* FECHA */}

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

            {/* INSTRUMENTO */}

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

            {/* OBSERVACIONES GENERALES */}

            <label className="block md:col-span-3">
              <span className="text-sm font-medium text-slate-700">
                Observaciones generales del grupo
              </span>

              <textarea
                name="observacionesGenerales"
                value={formEvaluacion.observacionesGenerales}
                onChange={handleChange}
                rows={4}
                placeholder="Escribe observaciones generales sobre el grupo..."
                className="mt-2 w-full resize-y rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>

          {/* ========================================== */}
          {/* TIPO DE EVALUACIÓN */}
          {/* ========================================== */}

          {formEvaluacion.instrumento !== "ContenidosPDA" &&
            formEvaluacion.instrumento !== "" && (
              <div className="border-t border-slate-200 pt-5">
                <p className="text-sm font-medium text-slate-700">
                  Tipo de evaluación
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Las evaluaciones normales registran información cuantitativa y
                  cualitativa. Los alumnos que no realizaron la evaluación no
                  reciben calificación y no participan en el promedio.
                </p>
              </div>
            )}

          {/* ========================================== */}
          {/* CONTENIDOS Y PDA */}
          {/* ========================================== */}

          {formEvaluacion.instrumento === "ContenidosPDA" && (
            <div className="space-y-6">
              {alumnosOrdenados.map((a) => (
                <div
                  key={a._id}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] table-fixed border-collapse">
                      <thead>
                        <tr>
                          <th
                            colSpan={2}
                            className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-base font-semibold text-slate-800 sm:text-lg"
                          >
                            {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {filtro.map((f) => (
                          <Fragment key={f.id}>
                            {/* CAMPO FORMATIVO */}

                            <tr>
                              <td
                                colSpan={2}
                                className="border-b border-slate-200 bg-indigo-50 px-4 py-3 text-left text-sm font-semibold text-indigo-700 sm:text-base"
                              >
                                {f.nombre}
                              </td>
                            </tr>

                            {/* ENCABEZADOS */}

                            <tr>
                              <th className="w-1/2 border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                PDAs
                              </th>

                              <th className="w-1/2 border-b border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-600">
                                Manifestaciones del alumno
                              </th>
                            </tr>

                            {/* PDAS */}

                            {f.contenidos.map((c) =>
                              c.pdas.map((p) => {
                                const pdaId = `${c.id}-${p.id}`;

                                const resultado =
                                  formEvaluacion.resultados.find(
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
                                        value={
                                          manifestacion?.manifestacion || ""
                                        }
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
                </div>
              ))}
            </div>
          )}

          {/* ========================================== */}
          {/* TABLA DE INSTRUMENTOS NORMALES */}
          {/* ========================================== */}

          {formEvaluacion.instrumento !== "ContenidosPDA" &&
            formEvaluacion.instrumento !== "" && (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="min-w-[220px] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Alumno
                      </th>

                      <th className="min-w-[180px] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        ¿Realizó la evaluación?
                      </th>

                      <th className="w-32 px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Calificación
                      </th>

                      <th className="min-w-[220px] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Nivel de desempeño
                      </th>

                      <th className="min-w-[300px] px-4 py-3 text-left text-sm font-semibold text-slate-700">
                        Observaciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnosOrdenados.map((alumno) => {
                      const resultado = formEvaluacion.resultados.find(
                        (resultado) => resultado.alumnoId === alumno._id,
                      );

                      // null = todavía no ha respondido
                      // true = sí realizó
                      // false = no realizó
                      const realizoEvaluacion =
                        resultado?.realizoEvaluacion ?? null;

                      return (
                        <tr
                          key={alumno._id}
                          className="border-t border-slate-200"
                        >
                          {/* ALUMNO */}

                          <td className="px-4 py-3 text-sm font-medium text-slate-800">
                            {alumno.nombre} {alumno.apellidoPaterno}{" "}
                            {alumno.apellidoMaterno}
                          </td>

                          {/* ¿REALIZÓ LA EVALUACIÓN? */}

                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-2">
                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  name={`realizo-${alumno._id}`}
                                  checked={realizoEvaluacion === true}
                                  onChange={() =>
                                    cambiarRealizoEvaluacion(alumno._id, true)
                                  }
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />

                                <span className="text-sm text-slate-700">
                                  Sí
                                </span>
                              </label>

                              <label className="flex cursor-pointer items-center gap-2">
                                <input
                                  type="radio"
                                  name={`realizo-${alumno._id}`}
                                  checked={realizoEvaluacion === false}
                                  onChange={() =>
                                    cambiarRealizoEvaluacion(alumno._id, false)
                                  }
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                                />

                                <span className="text-sm text-slate-700">
                                  No
                                </span>
                              </label>

                              {realizoEvaluacion === null && (
                                <span className="text-xs text-amber-600">
                                  Pendiente
                                </span>
                              )}
                            </div>
                          </td>

                          {/* CUANTITATIVA */}

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
                              disabled={realizoEvaluacion !== true}
                              required={realizoEvaluacion === true}
                              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                            />
                          </td>

                          {/* CUALITATIVA */}

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
                              disabled={realizoEvaluacion !== true}
                              required={realizoEvaluacion === true}
                              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
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

                          {/* OBSERVACIONES */}

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
                              placeholder={
                                realizoEvaluacion === true
                                  ? "Observaciones opcionales..."
                                  : "Ej. No presentó la evaluación"
                              }
                              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          {/* ========================================== */}
          {/* BOTONES */}
          {/* ========================================== */}

          <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setFormEvaluacion(evaluacionInicial);
                setMotrarModalEvaluacion(false);
              }}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 sm:w-auto"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
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
