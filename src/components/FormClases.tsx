import { useNavigate } from "react-router-dom";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import defaultClaseNueva from "../Types/TypeClaseNueva";

const SERVER = "http://localhost:3000";
const ROUTE = "/clases";

interface FormProp {
  formClase: typeof defaultClaseNueva;
  setFormClase: React.Dispatch<React.SetStateAction<TypeClaseNueva>>;
}

function FormClases({ formClase, setFormClase }: FormProp) {
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
      const nuevosHorarios = [...formClase.horarios];

      nuevosHorarios[index] = {
        ...nuevosHorarios[index],
        [name]: value,
      };

      setFormClase({
        ...formClase,
        horarios: nuevosHorarios,
      });

      return;
    }

    setFormClase({
      ...formClase,
      [name]: value,
    });
  };

  const agregarHorario = () => {
    setFormClase({
      ...formClase,
      horarios: [
        ...formClase.horarios,
        {
          dia: "",
          inicio: "",
          fin: "",
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = {
      ...formClase,
      nombre: formClase.nombre.trim(),
      materia: formClase.materia.trim(),
      grado: formClase.grado.trim(),
      grupo: formClase.grupo.trim().toUpperCase(),
      horarios: formClase.horarios,
      periodoInicio: formClase.periodoInicio,
      periodoFin: formClase.periodoFin,
    };

    try {
      const req = await fetch(SERVER + ROUTE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!req.ok) {
        throw new Error(`Error: ${req.status}`);
      }

      const res = await req.json();
      console.log(res);

      setFormClase(defaultClaseNueva);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="block">
        <span className="text-sm font-medium text-slate-700">Nombre</span>

        <input
          type="text"
          name="nombre"
          value={formClase.nombre}
          placeholder="Ej. Mi clase de Matemáticas de 3°B"
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">Materia</span>

        <input
          type="text"
          name="materia"
          value={formClase.materia}
          placeholder="Ej. Matemáticas"
          onChange={handleChange}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Grado</span>

          <select
            name="grado"
            value={formClase.grado}
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
          <span className="text-sm font-medium text-slate-700">Grupo</span>

          <input
            type="text"
            name="grupo"
            placeholder="Ej. A"
            value={formClase.grupo}
            onChange={handleChange}
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Horarios</h3>

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
          {formClase.horarios.map((horario, index) => (
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
      </div>

      <div>
        <span className="text-sm font-medium text-slate-700">Periodo</span>

        <div className="mt-2 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-slate-500">
              Fecha de inicio
            </span>

            <input
              type="date"
              name="periodoInicio"
              value={formClase.periodoInicio}
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
              value={formClase.periodoFin}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-6">
        <button
          type="submit"
          className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
        >
          Crear clase
        </button>
      </div>
    </form>
  );
}

export default FormClases;
