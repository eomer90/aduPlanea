import { useEffect, useState } from "react";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import ModalCargando from "./ModalCargando";

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
      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`);
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
    estado: "presente" | "falta" | "retardo" | "justificado" | "",
  ) => {
    const nuevasAsistencias = [...asistencias];

    nuevasAsistencias[index] = {
      ...nuevasAsistencias[index],
      ...(estado === "" ? { fecha: "" } : { estado }),
    };

    const nuevasMaterias = alumnoEncontrado!.materias.map((mat) =>
      mat.nombre === claseSeleccionada.materia
        ? {
            ...mat,
            asistencias: nuevasAsistencias,
          }
        : mat,
    );

    setAlumnoEncontrado({
      ...alumnoEncontrado!,
      materias: nuevasMaterias,
    });
  };

  const guardarCambios = async () => {
    setCargando(true);
    try {
      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(alumnoEncontrado),
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAlumnoSeleccionado("");
      setModalDetalleAlumno(false);
      obtenerAlumnos();
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

    try {
      const req = await fetch(`${SERVER}${ROUTE2}/${alumnoSeleccionado}`, {
        method: "DELETE",
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAlumnoSeleccionado("");
      setModalDetalleAlumno(false);
      obtenerAlumnos();
    } catch (error) {
      console.log(error);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
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
            className="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Datos del alumno
            </h3>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">Nombre</label>

                <input
                  type="text"
                  name="nombre"
                  value={alumnoEncontrado.nombre}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
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
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
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
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="rounded-lg bg-white p-3">
                  <span className="text-xs text-slate-400">Grado</span>

                  <select
                    name="grado"
                    value={alumnoEncontrado.grado}
                    onChange={handleChange}
                    className="mt-1 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
                  >
                    <option value="">Selecciona</option>
                    <option value="1">1°</option>
                    <option value="2">2°</option>
                    <option value="3">3°</option>
                  </select>
                </label>
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-slate-400">Grupo</label>

                <input
                  type="text"
                  name="grupo"
                  value={alumnoEncontrado.grupo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              <div className="rounded-lg bg-white p-3">
                <label className="text-xs text-indigo-500">Calificación</label>

                <input
                  type="text"
                  name="calificacion"
                  value={materia?.calificaciones || "Sin calificación"}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-700 outline-none"
                />
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Historial de asistencia
            </h3>

            {asistencias.length > 0 ? (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200">
                {asistencias.map((asistencia, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-2.5 last:border-b-0"
                  >
                    <span className="text-sm text-slate-600">
                      {asistencia.fecha}
                    </span>

                    <select
                      value={asistencia.fecha === "" ? "" : asistencia.estado}
                      onChange={(e) =>
                        cambiarEstadoAsistencia(
                          index,
                          e.target.value as
                            | "presente"
                            | "falta"
                            | "retardo"
                            | "justificado"
                            | "",
                        )
                      }
                    >
                      <option value="">Quitar asistencia</option>
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
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={eliminarAlumno}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Eliminar alumno
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={cargando}
              className="rounded-lg border border-emerald-200 px-4 py-2.5 text-sm font-medium text-emerald-600 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              onClick={guardarCambios}
            >
              Guardar cambios
            </button>

            <button
              type="button"
              onClick={() => setModalDetalleAlumno(false)}
              className="rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
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
