import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import defaultClaseNueva from "../Types/TypeClaseNueva";
import ModalCargando from "./ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE = "/clases";

type TypeClase = TypeClaseNueva & {
  _id: string;
};

interface Prop {
  claseSeleccionada: TypeClase;
  setMostrarEditarClase: React.Dispatch<React.SetStateAction<boolean>>;
  setMostrarDetalles: React.Dispatch<React.SetStateAction<boolean>>;
  obtenerClaseSeleccionada: () => Promise<void>;
  //   obtenerClase: () => Promise<void>;
}

const defaultClaseActualizada = {
  ...defaultClaseNueva,
  _id: "",
};

function EditarClase({
  claseSeleccionada,
  setMostrarEditarClase,
  setMostrarDetalles,
  obtenerClaseSeleccionada,
  //   obtenerClase,
}: Prop) {
  const [claseActualizada, setClaseActualizada] = useState<TypeClase>(
    defaultClaseActualizada,
  );
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
  ) => {
    const { name, value } = e.target;

    if (
      index !== undefined &&
      (name === "dia" || name === "inicio" || name === "fin")
    ) {
      const nuevosHorarios = [...claseActualizada.horarios];

      nuevosHorarios[index] = {
        ...nuevosHorarios[index],
        [name]: value,
      };

      setClaseActualizada({
        ...claseActualizada,
        horarios: nuevosHorarios,
      });

      return;
    }

    setClaseActualizada({
      ...claseActualizada,
      [name]: value,
    });
  };

  const agregarHorario = () => {
    setClaseActualizada({
      ...claseActualizada,
      horarios: [
        ...claseActualizada.horarios,
        {
          dia: "",
          inicio: "",
          fin: "",
        },
      ],
    });
  };

  const eliminarHorario = (index: number) => {
    const horariosFiltrados = claseActualizada.horarios.filter(
      (_, i) => i !== index,
    );
    setClaseActualizada({
      ...claseActualizada,
      horarios: horariosFiltrados,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      ...claseActualizada,
      nombre: claseActualizada.nombre.trim(),
      materia: claseActualizada.materia.trim(),
      grado: claseActualizada.grado.trim(),
      grupo: claseActualizada.grupo.trim().toUpperCase(),
      horarios: claseActualizada.horarios,
      periodoInicio: claseActualizada.periodoInicio,
      periodoFin: claseActualizada.periodoFin,
    };

    setCargando(true);

    const id = claseActualizada._id;

    try {
      const req = await fetch(`${SERVER}${ROUTE}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await req.json();
      if (res.error) {
        console.log(res.mensaje);
      }

      console.log(res);

      setClaseActualizada(defaultClaseActualizada);
      setMostrarEditarClase(false);
      setMostrarDetalles(true);
      obtenerClaseSeleccionada();
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const eliminarClase = async () => {
    setCargando(true);

    try {
      const id = claseActualizada._id;
      const req = await fetch(`${SERVER}${ROUTE}/${id}`, {
        method: "DELETE",
      });
      const res = await req.json();
      if (res.error) {
        console.log(res.mensaje);
      }

      setMostrarEditarClase(false);
      navigate("/clases");
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setClaseActualizada(claseSeleccionada);
  }, [claseSeleccionada]);

  useEffect(() => {
    console.log(claseActualizada);
  }, [claseActualizada]);

  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Editar clase</h2>
          <p className="mt-1 text-sm text-slate-500">
            Modifica los datos de la clase y guarda los cambios.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Nombre
                </span>

                <input
                  type="text"
                  name="nombre"
                  value={claseActualizada.nombre}
                  placeholder="Ej. Mi clase de Matemáticas de 3°B"
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Materia
                </span>

                <input
                  type="text"
                  name="materia"
                  value={claseActualizada.materia}
                  placeholder="Ej. Matemáticas"
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Grado
                </span>

                <select
                  name="grado"
                  value={claseActualizada.grado}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Selecciona un grado</option>
                  <option value="1">1°</option>
                  <option value="2">2°</option>
                  <option value="3">3°</option>
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Grupo
                </span>

                <input
                  type="text"
                  name="grupo"
                  placeholder="Ej. A"
                  value={claseActualizada.grupo}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-medium text-slate-700">
                  Salón(es)
                </span>

                <input
                  type="text"
                  name="salon"
                  placeholder="Ej. 110"
                  value={claseActualizada.salon}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            </div>

            <section className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    Horarios
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Agrega los días y horarios en los que se imparte la clase.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={agregarHorario}
                  className="rounded-lg border border-indigo-200 px-3 py-2 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                >
                  + Agregar
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {claseActualizada.horarios.map((horario, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-700">
                        Horario {index + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => eliminarHorario(index)}
                        className="text-xs font-medium text-red-500 transition hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <label className="block">
                        <span className="text-xs font-medium text-slate-500">
                          Día
                        </span>

                        <select
                          name="dia"
                          value={horario.dia}
                          onChange={(e) => handleChange(e, index)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        >
                          <option value="">Selecciona un día</option>
                          <option value="lunes">Lunes</option>
                          <option value="martes">Martes</option>
                          <option value="miercoles">Miércoles</option>
                          <option value="jueves">Jueves</option>
                          <option value="viernes">Viernes</option>
                        </select>
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-slate-500">
                          Hora de inicio
                        </span>

                        <input
                          type="time"
                          name="inicio"
                          value={horario.inicio}
                          onChange={(e) => handleChange(e, index)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </label>

                      <label className="block">
                        <span className="text-xs font-medium text-slate-500">
                          Hora de finalización
                        </span>

                        <input
                          type="time"
                          name="fin"
                          value={horario.fin}
                          onChange={(e) => handleChange(e, index)}
                          className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-200 pt-6">
              <h3 className="text-sm font-semibold text-slate-800">
                Periodo escolar
              </h3>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-medium text-slate-500">
                    Fecha de inicio
                  </span>

                  <input
                    type="date"
                    name="periodoInicio"
                    value={claseActualizada.periodoInicio}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-500">
                    Fecha de finalización
                  </span>

                  <input
                    type="date"
                    name="periodoFin"
                    value={claseActualizada.periodoFin}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  />
                </label>
              </div>
            </section>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-6">
              <button
                type="submit"
                disabled={cargando}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
              >
                Guardar cambios
              </button>

              <button
                type="button"
                disabled={cargando}
                onClick={eliminarClase}
                className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500 disabled:hover:bg-slate-300"
              >
                Eliminar clase
              </button>
            </div>
          </div>
        </form>
      </div>

      {cargando && <ModalCargando />}
    </>
  );
}

export default EditarClase;
