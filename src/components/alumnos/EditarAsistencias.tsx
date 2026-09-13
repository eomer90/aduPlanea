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

interface Props {
  alumnos: TypeAlumnos[];
  claseSeleccionada: TypeClase;
  fechaInicial: string;
  setMostrarEditarAsistencias: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerAlumnos: () => Promise<void>;
}

function EditarAsistencias({
  alumnos,
  claseSeleccionada,
  fechaInicial,
  setMostrarEditarAsistencias,
  obtenerAlumnos,
}: Props) {
  const [cargando, setCargando] = useState<boolean>(false);
  const [fecha, setFecha] = useState<string>(fechaInicial);

  const cambiarFecha = async () => {
    if (!fecha || fecha === fechaInicial) return;

    const confirmar = window.confirm(
      `¿Cambiar la fecha ${fechaInicial} a ${fecha} para todos los alumnos?`,
    );

    if (!confirmar) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/alumnos/asistencias/fecha`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            claseId: claseSeleccionada._id,
            fechaAnterior: fechaInicial,
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
      setMostrarEditarAsistencias(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarFecha = async () => {
    const confirmar = window.confirm(
      `¿Eliminar la asistencia del ${fechaInicial} para todos los alumnos?`,
    );

    if (!confirmar) return;

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${import.meta.env.VITE_API_URL}/alumnos/asistencias`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            claseId: claseSeleccionada._id,
            fecha: fechaInicial,
          }),
        },
      );

      const res = await req.json();

      if (!req.ok || res.error) {
        console.log(res.mensaje);
        return;
      }

      await obtenerAlumnos();
      setMostrarEditarAsistencias(false);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const obtenerResumen = () => {
    const resumen = {
      presente: 0,
      falta: 0,
      retardo: 0,
      justificado: 0,
    };

    alumnos.forEach((alumno) => {
      const materia = alumno.materias?.find(
        (materia) => String(materia.claseId) === String(claseSeleccionada._id),
      );

      const asistencia = materia?.asistencias?.find(
        (asistencia) => asistencia.fecha === fechaInicial,
      );

      if (asistencia) {
        resumen[asistencia.estado]++;
      }
    });

    return resumen;
  };

  const resumen = obtenerResumen();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-2 sm:p-4">
      <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl">
        {/* ENCABEZADO */}
        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Editar asistencia
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {claseSeleccionada.materia} · {claseSeleccionada.grado}°{" "}
              {claseSeleccionada.grupo}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-700">
              Fecha: {fechaInicial}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setMostrarEditarAsistencias(false)}
            className="rounded-lg px-2 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            ×
          </button>
        </div>

        {/* CONTENIDO */}
        <div className="space-y-5 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <div className="rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Resumen de asistencia
            </h3>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-lg bg-emerald-50 p-3 text-center">
                <p className="text-xs text-emerald-700">Presentes</p>
                <p className="mt-1 text-xl font-semibold text-emerald-700">
                  {resumen.presente}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-3 text-center">
                <p className="text-xs text-red-700">Faltas</p>
                <p className="mt-1 text-xl font-semibold text-red-700">
                  {resumen.falta}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-3 text-center">
                <p className="text-xs text-amber-700">Retardos</p>
                <p className="mt-1 text-xl font-semibold text-amber-700">
                  {resumen.retardo}
                </p>
              </div>

              <div className="rounded-lg bg-indigo-50 p-3 text-center">
                <p className="text-xs text-indigo-700">Justificados</p>
                <p className="mt-1 text-xl font-semibold text-indigo-700">
                  {resumen.justificado}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 p-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">
                Cambiar fecha
              </span>

              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-400"
              />
            </label>

            <button
              type="button"
              onClick={cambiarFecha}
              disabled={!fecha || fecha === fechaInicial}
              className="mt-3 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar cambio de fecha
            </button>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <h3 className="text-sm font-semibold text-red-700">
              Eliminar asistencia
            </h3>

            <p className="mt-1 text-sm text-red-600">
              Esta acción eliminará la asistencia de esta fecha para todos los
              alumnos de la clase.
            </p>

            <button
              type="button"
              onClick={eliminarFecha}
              className="mt-3 w-full rounded-lg border border-red-300 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              Eliminar asistencia
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-slate-200 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMostrarEditarAsistencias(false)}
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

export default EditarAsistencias;
