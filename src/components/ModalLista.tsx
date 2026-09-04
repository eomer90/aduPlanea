import { useState } from "react";
import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeEstado } from "../Types/TypeNuevoAlumno";
import type { TypeObservaciones } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import ModalCargando from "./ModalCargando";

type TypeAlumnos = TypeNuevoAlumno & {
  _id: string;
};

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE2 = "/alumnos";

interface AlumnosProp {
  alumnos: TypeAlumnos[];
  setModalPasarLista: React.Dispatch<React.SetStateAction<Boolean>>;
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClaseNueva;
}

function ModalLista({
  alumnos,
  setModalPasarLista,
  obtenerAlumnos,
  claseSeleccionada,
}: AlumnosProp) {
  const [fecha, setFecha] = useState<string>("");
  const [estados, setEstados] = useState<TypeEstado[]>([]);
  const [observaciones, setObservaciones] = useState<TypeObservaciones[]>([]);
  const [cargando, setCargando] = useState(false);

  const ponerFecha = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nuevaFecha = e.target.value;

    setFecha(nuevaFecha);

    const buscarAlumnos = alumnos.filter((a) => {
      const materia = a.materias.find(
        (materia) => materia.nombre === claseSeleccionada.materia,
      );

      return materia?.asistencias.some((asis) => asis.fecha === nuevaFecha);
    });

    const antiguosEstados = buscarAlumnos.map((a) => {
      const materia = a.materias.find(
        (materia) => materia.nombre === claseSeleccionada.materia,
      );

      const asistencia = materia?.asistencias.find(
        (asis) => asis.fecha === nuevaFecha,
      );

      return {
        id: a._id,
        estado: asistencia!.estado,
      };
    });

    const antiguasObservaciones = buscarAlumnos.map((a) => {
      const materia = a.materias.find(
        (materia) => materia.nombre === claseSeleccionada.nombre,
      );

      const asistencia = materia?.asistencias.find(
        (asis) => asis.fecha === nuevaFecha,
      );

      return {
        id: a._id,
        observaciones: asistencia?.observaciones || "",
      };
    });

    setEstados(antiguosEstados);
    setObservaciones(antiguasObservaciones);
  };

  const seleccionarEstado = (
    id: string,
    estado: "presente" | "falta" | "retardo" | "justificado",
  ) => {
    const existe = estados.find((i) => i.id === id);

    if (existe) {
      setEstados([
        ...estados.filter((i) => i.id !== id),
        {
          id: id,
          estado: estado,
        },
      ]);
      return;
    }

    setEstados([
      ...estados,
      {
        id: id,
        estado: estado,
      },
    ]);
  };

  const guardarObservaciones = (id: string, value: string) => {
    const existe = observaciones.find((i) => i.id === id);

    if (existe) {
      setObservaciones([
        ...observaciones.filter((i) => i.id !== id),
        {
          id: id,
          observaciones: value,
        },
      ]);
      return;
    }

    setObservaciones([
      ...observaciones,
      {
        id: id,
        observaciones: value,
      },
    ]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCargando(true);

    const asistencia = alumnos.map((alumno) => {
      const estado = estados.find((e) => e.id === alumno._id);
      const observacion = observaciones.find((o) => o.id === alumno._id);

      return {
        id: alumno._id,
        estado: estado?.estado,
        observaciones: observacion?.observaciones || "",
      };
    });

    const datos = {
      fecha,
      materia: claseSeleccionada.materia,
      asistencia,
    };

    try {
      const token = localStorage.getItem("token");
      const req = await fetch(SERVER + ROUTE2, {
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
      }
      setFecha("");
      setEstados([]);
      setObservaciones([]);
      setModalPasarLista(false);
      obtenerAlumnos();
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
      >
        <div className="w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Pasar lista
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Registra la asistencia de los alumnos.
                </p>
              </div>

              <button
                type="button"
                className="rounded-lg px-2 py-1 text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                onClick={() => setModalPasarLista(false)}
              >
                ×
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
            <label className="block max-w-xs">
              <span className="text-sm font-medium text-slate-700">
                Fecha de asistencia
              </span>

              <input
                type="date"
                name="fecha"
                value={fecha}
                onChange={ponerFecha}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>
          </div>

          <div className="max-h-[55vh] overflow-y-auto px-6 py-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Alumnos
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Selecciona el estado de cada alumno.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              {alumnos.map((a, index) => (
                <div
                  key={a._id}
                  className="border-b border-slate-100 px-3 py-2 last:border-b-0 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="w-5 text-xs text-slate-400">
                        {index + 1}.
                      </span>

                      <p className="truncate text-sm font-medium text-slate-700">
                        {a.nombre} {a.apellidoPaterno} {a.apellidoMaterno}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-emerald-700">
                        <input
                          type="checkbox"
                          disabled={fecha === ""}
                          checked={
                            estados.find((e) => e.id === a._id)?.estado ===
                            "presente"
                          }
                          onChange={() => seleccionarEstado(a._id, "presente")}
                          className="h-4 w-4 accent-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        Presente
                      </label>

                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-red-700">
                        <input
                          type="checkbox"
                          disabled={fecha === ""}
                          checked={
                            estados.find((e) => e.id === a._id)?.estado ===
                            "falta"
                          }
                          onChange={() => seleccionarEstado(a._id, "falta")}
                          className="h-4 w-4 accent-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        Falta
                      </label>

                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-amber-700">
                        <input
                          type="checkbox"
                          disabled={fecha === ""}
                          checked={
                            estados.find((e) => e.id === a._id)?.estado ===
                            "retardo"
                          }
                          onChange={() => seleccionarEstado(a._id, "retardo")}
                          className="h-4 w-4 accent-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        Retardo
                      </label>

                      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-indigo-700">
                        <input
                          type="checkbox"
                          disabled={fecha === ""}
                          checked={
                            estados.find((e) => e.id === a._id)?.estado ===
                            "justificado"
                          }
                          onChange={() =>
                            seleccionarEstado(a._id, "justificado")
                          }
                          className="h-4 w-4 accent-indigo-500 disabled:cursor-not-allowed disabled:opacity-40"
                        />
                        Justificado
                      </label>
                    </div>
                  </div>

                  <div className="mt-1.5 pl-7">
                    <input
                      type="text"
                      disabled={fecha === ""}
                      name="observaciones"
                      placeholder="Observación..."
                      onChange={(e) =>
                        guardarObservaciones(a._id, e.target.value)
                      }
                      className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:placeholder:text-slate-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
            <span className="text-sm text-slate-400">
              {alumnos.length} alumnos
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                onClick={() => setModalPasarLista(false)}
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={cargando}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Guardar asistencia
              </button>
            </div>
          </div>
        </div>
      </form>
      {cargando && <ModalCargando />}
    </>
  );
}

export default ModalLista;
