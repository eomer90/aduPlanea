import { useState, useEffect } from "react";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";

type TypeClase = TypeClaseNueva & {
  _id: string;
};

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE = "/clases";

interface Prop {
  setModalImportar: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModalImportar({ setModalImportar }: Prop) {
  const [clasesImportar, setClasesImportar] = useState<TypeClase[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const obtenerClases = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(SERVER + ROUTE, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!req.ok) {
        throw new Error(`Error: ${req.status}`);
      }
      const res = await req.json();
      setClasesImportar(res.clases);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Importar alumnos
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            ¿De qué grupo te gustaría importar a los alumnos?
          </p>
        </div>

        {cargando ? (
          <p className="py-4 text-center text-sm text-slate-500">
            Cargando clases...
          </p>
        ) : (
          <select
            defaultValue=""
            className="w-full cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="" disabled>
              Selecciona una clase
            </option>

            {clasesImportar.map((c) => (
              <option key={c._id} value={c._id}>
                {c.materia} · {c.grado}° {c.grupo}
              </option>
            ))}
          </select>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setModalImportar(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={cargando}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Importar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalImportar;
