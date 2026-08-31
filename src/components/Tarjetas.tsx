import { useNavigate } from "react-router-dom";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";

type TypeClase = TypeClaseNueva & {
  _id: string;
};

interface ClasesProps {
  clases: TypeClase[];
}
function Tarjetas({ clases }: ClasesProps) {
  const navigate = useNavigate();
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {clases.map((c) => (
        <button
          key={c._id}
          type="button"
          onClick={() => navigate(`/clases/${c._id}`)}
          className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
        >
          <div className="h-2 bg-indigo-600" />

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  {c.materia}
                </h2>

                <p className="mt-1 text-sm text-slate-500">{c.nombre}</p>
              </div>

              <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
                {c.grupo}
              </span>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Grado</span>
                <span className="font-medium text-slate-700">{c.grado}°</span>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Horarios
                </p>

                <div className="space-y-1.5">
                  {c.horarios.map((horario, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="capitalize text-slate-600">
                        {horario.dia}
                      </span>

                      <span className="font-medium text-slate-700">
                        {horario.inicio} - {horario.fin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                  Periodo
                </p>

                <p className="text-sm text-slate-600">
                  {c.periodoInicio} — {c.periodoFin}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-indigo-600 transition group-hover:text-indigo-700">
                Ver clase →
              </span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

export default Tarjetas;
