import { useState } from "react";
import type { TypeNuevoAlumno } from "../../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../../Types/TypeClaseNueva";
import ModalCargando from "../ModalCargando";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

type TypeClase = TypeClaseNueva & {
  _id: string;
  escuelaId: string;
  usuarioId: string;
};

export type ActividadClase = {
  titulo: string;
  fecha: string;
};

interface Props {
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClase;
  actividadInicial: ActividadClase;
  setMostrarEditarActividades: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerAlumnos: () => Promise<void>;
}

function EditarActividades({
  alumnos,
  claseSeleccionada,
  actividadInicial,
  setMostrarEditarActividades,
  obtenerAlumnos,
}: Props) {
  const [cargando, setCargando] = useState<boolean>(false);
  const [titulo, setTitulo] = useState<string>(actividadInicial.titulo);
  const [fecha, setFecha] = useState<string>(actividadInicial.fecha);

  const cambiarActividad = async () => {
    if (!titulo.trim() || !fecha) return;

    if (
      titulo.trim() === actividadInicial.titulo &&
      fecha === actividadInicial.fecha
    ) {
      return;
    }

    const confirmar = window.confirm(
      `¿Actualizar "${actividadInicial.titulo}" para todos los alumnos?`,
    );

    if (!confirmar) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/alumnos/actividades`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            claseId: claseSeleccionada._id,
            tituloAnterior: actividadInicial.titulo,
            fechaAnterior: actividadInicial.fecha,
            tituloNuevo: titulo.trim(),
            fechaNueva: fecha,
          }),
        },
      );

      const res = await req.json();

      if (!req.ok || res.error) {
        console.log(res.mensaje);
        return;
      }

      await obtenerAlumnos();
      setMostrarEditarActividades(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarActividad = async () => {
    const confirmar = window.confirm(
      `¿Eliminar "${actividadInicial.titulo}" del historial de todos los alumnos?`,
    );

    if (!confirmar) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/alumnos/actividades`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            claseId: claseSeleccionada._id,
            titulo: actividadInicial.titulo,
            fecha: actividadInicial.fecha,
          }),
        },
      );

      const res = await req.json();

      if (!req.ok || res.error) {
        console.log(res.mensaje);
        return;
      }

      await obtenerAlumnos();
      setMostrarEditarActividades(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const alumnosConActividad = alumnos.filter((alumno) =>
    alumno.actividades?.some(
      (actividad) =>
        actividad.titulo === actividadInicial.titulo &&
        actividad.fecha === actividadInicial.fecha,
    ),
  ).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl">
        {/* ENCABEZADO */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Editar actividad
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Modifica esta actividad para toda la clase.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarEditarActividades(false)}
            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Nombre de la actividad
              </span>

              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
              />
            </label>

            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">
                Fecha de la actividad
              </span>

              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
              />
            </label>

            <p className="mt-3 text-xs text-slate-500">
              Esta actividad está registrada para {alumnosConActividad}{" "}
              alumno(s).
            </p>

            <button
              type="button"
              onClick={cambiarActividad}
              disabled={!titulo.trim() || !fecha}
              className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar cambios
            </button>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h3 className="text-sm font-semibold text-red-700">
              Eliminar actividad
            </h3>

            <p className="mt-1 text-sm text-red-600">
              Esta acción eliminará esta actividad del historial de todos los
              alumnos de la clase.
            </p>

            <button
              type="button"
              onClick={eliminarActividad}
              className="mt-3 w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Eliminar actividad
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMostrarEditarActividades(false)}
            className="w-full rounded-lg bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Cerrar
          </button>
        </div>
      </div>

      {cargando && <ModalCargando />}
    </div>
  );
}

export default EditarActividades;
