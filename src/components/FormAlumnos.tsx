import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import nuevoAlumno from "../Types/TypeNuevoAlumno";
import { useState } from "react";
import ModalCargando from "./ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE = "/alumnos";

interface FormProp {
  setMostrarFormALumnos: React.Dispatch<React.SetStateAction<Boolean>>;
  formAlumno: TypeNuevoAlumno;
  setFormAlumno: React.Dispatch<React.SetStateAction<TypeNuevoAlumno>>;
  setMostrarBotonAlumnos: React.Dispatch<React.SetStateAction<Boolean>>;
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClaseNueva;
}
function FormAlumnos({
  formAlumno,
  setFormAlumno,
  setMostrarFormALumnos,
  setMostrarBotonAlumnos,
  obtenerAlumnos,
  claseSeleccionada,
}: FormProp) {
  const [cargando, setCargando] = useState<boolean>(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormAlumno({
      ...formAlumno,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = {
      nombre: formAlumno.nombre,
      apellidoPaterno: formAlumno.apellidoPaterno,
      apellidoMaterno: formAlumno.apellidoMaterno,
      grado: formAlumno.grado,
      grupo: formAlumno.grupo,
      materias: [
        {
          nombre: claseSeleccionada.materia,
          asistencias: [],
          evaluaciones: [],
          calificaciones: "",
        },
      ],
    };

    setCargando(true);
    try {
      const req = await fetch(SERVER + ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datos),
      });
      const res = await req.json();
      if (res.error) {
        console.log(res.mensaje);
      }
      setFormAlumno(nuevoAlumno);
      setMostrarFormALumnos(false);
      setMostrarBotonAlumnos(true);
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-end gap-3">
          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Nombre(s)
            </span>

            <input
              type="text"
              name="nombre"
              value={formAlumno.nombre}
              placeholder="Ej. Juan"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Apellido paterno
            </span>

            <input
              type="text"
              name="apellidoPaterno"
              value={formAlumno.apellidoPaterno}
              placeholder="Ej. Pérez"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex-1">
            <span className="text-sm font-medium text-slate-700">
              Apellido materno
            </span>

            <input
              type="text"
              name="apellidoMaterno"
              value={formAlumno.apellidoMaterno}
              placeholder="Ej. García"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="w-28">
            <span className="text-sm font-medium text-slate-700">Grado</span>

            <select
              name="grado"
              value={formAlumno.grado}
              onChange={handleChange}
              className="mt-2 w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Selecciona</option>
              <option value="1">1°</option>
              <option value="2">2°</option>
              <option value="3">3°</option>
            </select>
          </label>

          <label className="w-24">
            <span className="text-sm font-medium text-slate-700">Grupo</span>

            <input
              type="text"
              name="grupo"
              value={formAlumno.grupo}
              placeholder="B"
              onChange={handleChange}
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setMostrarFormALumnos(false);
              setMostrarBotonAlumnos(true);
            }}
            className="mb-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            Agregar hoja de Excel
          </button>

          <button
            type="submit"
            disabled={cargando}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
          >
            Guardar alumno
          </button>
        </div>
      </form>
      {cargando && <ModalCargando />}
    </>
  );
}

export default FormAlumnos;
