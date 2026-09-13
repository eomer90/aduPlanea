import { useEffect, useState } from "react";
import type { TypeNuevoAlumno } from "../../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../../Types/TypeClaseNueva";
import ModalCargando from "../ModalCargando";

interface Prop {
  alumnoSeleccionado: string;
  setAlumnoSeleccionado: React.Dispatch<React.SetStateAction<string>>;
  setModalDetalleAlumno: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClaseNueva;
}

const SERVER = import.meta.env.VITE_API_URL;
const ROUTE2 = "/alumnos";

function DetalleAlumno({
  alumnoSeleccionado,
  setAlumnoSeleccionado,
  setModalDetalleAlumno,
  obtenerAlumnos,
  claseSeleccionada,
}: Prop) {
  const [alumnoEncontrado, setAlumnoEncontrado] = useState<TypeNuevoAlumno>();

  const [cargando, setCargando] = useState<boolean>(false);

  const obtenerAlumno = async () => {
    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAlumnoEncontrado(res.alumnoEncontrado);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (alumnoSeleccionado) {
      obtenerAlumno();
    }
  }, [alumnoSeleccionado]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setAlumnoEncontrado({
      ...alumnoEncontrado!,
      [name]: value,
    });
  };

  const cambiarEstadoAsistencia = (
    index: number,
    estado: "presente" | "falta" | "retardo" | "justificado",
  ) => {
    if (!alumnoEncontrado) return;

    const nuevasAsistencias = [...asistencias];

    nuevasAsistencias[index] = {
      ...nuevasAsistencias[index],
      estado,
    };

    const nuevasMaterias = alumnoEncontrado.materias.map((mat) =>
      mat.nombre === claseSeleccionada.materia
        ? {
            ...mat,
            asistencias: nuevasAsistencias,
          }
        : mat,
    );

    setAlumnoEncontrado({
      ...alumnoEncontrado,
      materias: nuevasMaterias,
    });
  };

  const cambiarActividad = (
    index: number,
    campo: "titulo" | "estado" | "observaciones",
    valor: string,
  ) => {
    if (!alumnoEncontrado) return;

    const nuevasActividades = [...(alumnoEncontrado.actividades || [])];

    nuevasActividades[index] = {
      ...nuevasActividades[index],
      [campo]: valor,
    };

    setAlumnoEncontrado({
      ...alumnoEncontrado,
      actividades: nuevasActividades,
    });
  };

  const guardarCambios = async () => {
    if (!alumnoEncontrado) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const datos = {
        nombre: alumnoEncontrado.nombre,
        apellidoPaterno: alumnoEncontrado.apellidoPaterno,
        apellidoMaterno: alumnoEncontrado.apellidoMaterno,
        grado: alumnoEncontrado.grado,
        grupo: alumnoEncontrado.grupo,
        materias: alumnoEncontrado.materias,
        actividades: alumnoEncontrado.actividades || [],
      };

      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAlumnoSeleccionado("");
      setModalDetalleAlumno(false);

      await obtenerAlumnos();
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarAlumno = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este alumno?",
    );

    if (!confirmar) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAlumnoSeleccionado("");
      setModalDetalleAlumno(false);

      await obtenerAlumnos();
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  if (!alumnoEncontrado) {
    return null;
  }

  const materia = alumnoEncontrado.materias.find(
    (materia) => materia.nombre === claseSeleccionada.materia,
  );

  const asistencias = materia?.asistencias ?? [];

  const presentes = asistencias.filter((a) => a.estado === "presente").length;

  const faltas = asistencias.filter((a) => a.estado === "falta").length;

  const retardos = asistencias.filter((a) => a.estado === "retardo").length;

  const justificados = asistencias.filter(
    (a) => a.estado === "justificado",
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl">
        {/* ENCABEZADO */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0 pr-4">
            <h2 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
              {alumnoEncontrado.nombre} {alumnoEncontrado.apellidoPaterno}{" "}
              {alumnoEncontrado.apellidoMaterno}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Información del alumno.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalDetalleAlumno(false)}
            className="shrink-0 rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO */}

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {/* DATOS DEL ALUMNO */}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Datos del alumno
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">Nombre</label>

                <input
                  type="text"
                  name="nombre"
                  value={alumnoEncontrado.nombre}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">
                  Apellido paterno
                </label>

                <input
                  type="text"
                  name="apellidoPaterno"
                  value={alumnoEncontrado.apellidoPaterno}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">
                  Apellido materno
                </label>

                <input
                  type="text"
                  name="apellidoMaterno"
                  value={alumnoEncontrado.apellidoMaterno}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                />
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">Grado</label>

                <select
                  name="grado"
                  value={alumnoEncontrado.grado}
                  onChange={handleChange}
                  className="mt-1 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none focus:border-indigo-400"
                >
                  <option value="">Selecciona</option>
                  <option value="1">1°</option>
                  <option value="2">2°</option>
                  <option value="3">3°</option>
                </select>
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">Grupo</label>

                <input
                  type="text"
                  name="grupo"
                  value={alumnoEncontrado.grupo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 uppercase outline-none focus:border-indigo-400"
                />
              </div>
            </div>
          </section>

          {/* ASISTENCIAS */}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Historial de asistencia
            </h3>

            {asistencias.length > 0 ? (
              <div className="max-h-56 overflow-y-auto rounded-lg border border-slate-200">
                {asistencias.map((asistencia, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 border-b border-slate-100 px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4"
                  >
                    <span className="text-sm text-slate-600">
                      {asistencia.fecha}
                    </span>

                    <select
                      value={asistencia.estado}
                      onChange={(e) =>
                        cambiarEstadoAsistencia(
                          index,
                          e.target.value as
                            | "presente"
                            | "falta"
                            | "retardo"
                            | "justificado",
                        )
                      }
                      className="w-full cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 outline-none focus:border-indigo-400 sm:w-40"
                    >
                      <option value="presente">Presente</option>

                      <option value="falta">Falta</option>

                      <option value="retardo">Retardo</option>

                      <option value="justificado">Justificado</option>
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-400">
                No hay asistencias registradas.
              </p>
            )}
          </section>

          {/* RESUMEN */}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Resumen de asistencia
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs text-emerald-600">Presentes</p>

                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {presentes}
                </p>
              </div>

              <div className="rounded-lg border border-red-100 bg-red-50 p-3">
                <p className="text-xs text-red-600">Faltas</p>

                <p className="mt-1 text-xl font-bold text-red-700">{faltas}</p>
              </div>

              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                <p className="text-xs text-amber-600">Retardos</p>

                <p className="mt-1 text-xl font-bold text-amber-700">
                  {retardos}
                </p>
              </div>

              <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                <p className="text-xs text-indigo-600">Justificados</p>

                <p className="mt-1 text-xl font-bold text-indigo-700">
                  {justificados}
                </p>
              </div>
            </div>
          </section>

          {/* ACTIVIDADES */}

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Actividades
            </h3>

            {alumnoEncontrado.actividades?.length > 0 ? (
              <div className="max-h-72 overflow-auto rounded-lg border border-slate-200">
                <table className="min-w-[700px] w-full text-sm">
                  <thead className="sticky top-0 z-10 bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs text-slate-500">
                        Actividad
                      </th>

                      <th className="px-3 py-2 text-left text-xs text-slate-500">
                        Fecha
                      </th>

                      <th className="px-3 py-2 text-left text-xs text-slate-500">
                        Estado
                      </th>

                      <th className="px-3 py-2 text-left text-xs text-slate-500">
                        Observaciones
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {alumnoEncontrado.actividades.map((actividad, index) => (
                      <tr key={index} className="border-t border-slate-200">
                        {/* TÍTULO */}

                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={actividad.titulo}
                            onChange={(e) =>
                              cambiarActividad(index, "titulo", e.target.value)
                            }
                            className="w-full border-0 bg-transparent p-0 text-sm outline-none"
                          />
                        </td>

                        {/* FECHA SOLO SE MUESTRA */}

                        <td className="px-3 py-2 text-sm text-slate-600">
                          {actividad.fecha}
                        </td>

                        {/* ESTADO */}

                        <td className="px-3 py-2">
                          <select
                            value={actividad.estado}
                            onChange={(e) =>
                              cambiarActividad(index, "estado", e.target.value)
                            }
                            className="border-0 bg-transparent p-0 text-sm outline-none"
                          >
                            <option value="Pendiente">Pendiente</option>

                            <option value="Entregado">Entregado</option>

                            <option value="No entregado">No entregado</option>

                            <option value="Entregado tarde">
                              Entregado tarde
                            </option>
                          </select>
                        </td>

                        {/* OBSERVACIONES */}

                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={actividad.observaciones}
                            onChange={(e) =>
                              cambiarActividad(
                                index,
                                "observaciones",
                                e.target.value,
                              )
                            }
                            placeholder="Sin observaciones"
                            className="w-full border-0 bg-transparent p-0 text-sm outline-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="rounded-lg bg-slate-50 p-3 text-center text-sm text-slate-400">
                No hay actividades registradas.
              </p>
            )}
          </section>
        </div>

        {/* FOOTER */}

        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <button
            type="button"
            onClick={eliminarAlumno}
            className="w-full rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 sm:w-auto"
          >
            Eliminar alumno
          </button>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              type="button"
              disabled={cargando}
              onClick={guardarCambios}
              className="w-full rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 sm:w-auto"
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={() => setModalDetalleAlumno(false)}
              className="w-full rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 sm:w-auto"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {cargando && <ModalCargando />}
    </div>
  );
}

export default DetalleAlumno;
