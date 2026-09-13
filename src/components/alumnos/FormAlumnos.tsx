import { useState } from "react";
import nuevoAlumno from "../../Types/TypeNuevoAlumno";
import ModalCargando from "../ModalCargando";
import type { TypeNuevoAlumno } from "../../Types/TypeNuevoAlumno";
import type { TypeClaseMongo } from "../../Types/TypeClaseMongo";

const SERVER = import.meta.env.VITE_API_URL;
const ROUTE = "/alumnos";

interface FormProp {
  setMostrarFormALumnos: React.Dispatch<React.SetStateAction<boolean>>;
  formAlumno: TypeNuevoAlumno;
  setFormAlumno: React.Dispatch<React.SetStateAction<TypeNuevoAlumno>>;
  setMostrarBotonAlumnos: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerAlumnos: () => Promise<void>;
  claseSeleccionada: TypeClaseMongo;
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      grado: claseSeleccionada.grado,
      grupo: claseSeleccionada.grupo,
      observacionesGenerales: formAlumno.observacionesGenerales,

      materias: [
        {
          claseId: claseSeleccionada._id,
          nombre: claseSeleccionada.materia,
          asistencias: [],
          evaluaciones: [],
        },
      ],

      actividades: [],
    };

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(SERVER + ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      const res = await req.json();

      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }

      setFormAlumno(nuevoAlumno);
      setMostrarFormALumnos(false);
      setMostrarBotonAlumnos(true);

      await obtenerAlumnos();

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* NOMBRE */}
          <label className="min-w-0">
            <span className="text-sm font-medium text-slate-700">
              Nombre(s)
            </span>

            <input
              type="text"
              name="nombre"
              value={formAlumno.nombre}
              placeholder="Ej. Juan"
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* APELLIDO PATERNO */}
          <label className="min-w-0">
            <span className="text-sm font-medium text-slate-700">
              Apellido paterno
            </span>

            <input
              type="text"
              name="apellidoPaterno"
              value={formAlumno.apellidoPaterno}
              placeholder="Ej. Pérez"
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* APELLIDO MATERNO */}
          <label className="min-w-0">
            <span className="text-sm font-medium text-slate-700">
              Apellido materno
            </span>

            <input
              type="text"
              name="apellidoMaterno"
              value={formAlumno.apellidoMaterno}
              placeholder="Ej. García"
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* OBSERVACIONES GENERALES */}
          <label className="min-w-0 sm:col-span-2 lg:col-span-2">
            <span className="text-sm font-medium text-slate-700">
              Observaciones generales
            </span>

            <textarea
              id="observacionesGenerales"
              name="observacionesGenerales"
              value={formAlumno.observacionesGenerales}
              onChange={handleChange}
              rows={4}
              placeholder="Escribe información importante sobre el alumno..."
              className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          {/* BOTÓN CERRAR */}
          <div className="flex items-end justify-start lg:justify-center">
            <button
              type="button"
              onClick={() => {
                setMostrarFormALumnos(false);
                setMostrarBotonAlumnos(true);
              }}
              aria-label="Cerrar formulario"
              className="flex h-10 w-full items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 sm:w-10"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
          <p className="text-sm text-slate-600">
            El alumno se agregará a:
          </p>

          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-indigo-700">
            <span>{claseSeleccionada.materia}</span>

            <span>
              {claseSeleccionada.grado}° {claseSeleccionada.grupo}
            </span>
          </div>
        </div>
        */}

        {/* ACCIONES */}
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300 sm:w-auto"
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
