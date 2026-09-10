import { useEffect, useState } from "react";
import type { TypeNuevoRecordatorio } from "../../Types/TypeNuevoRecordatorio";

const SERVER = import.meta.env.VITE_API_URL;

type TypeRecordatorioBack = TypeNuevoRecordatorio & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<TypeRecordatorioBack[]>(
    [],
  );

  const obtenerRecordatorios = async () => {
    try {
      const token = localStorage.getItem("token");

      const req = await fetch(`${SERVER}/recordatorios`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setRecordatorios(res.recordatoriosEncontrados);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerRecordatorios();
  }, []);

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Recordatorios
      </h2>

      <div className="space-y-3">
        {recordatorios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              No tienes recordatorios pendientes.
            </p>
          </div>
        ) : (
          recordatorios.map((e) => (
            <button
              key={e._id}
              type="button"
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 0 1-5.714 0M12 3a6 6 0 0 0-6 6c0 3.75-1.5 5.25-1.5 5.25h15S18 12.75 18 9a6 6 0 0 0-6-6Zm0 0V1.5"
                    />
                  </svg>
                </div>

                <div>
                  <h3 className="font-medium text-slate-800">{e.nombre}</h3>

                  {e.descripcion && (
                    <p className="mt-1 text-sm text-slate-500">
                      {e.descripcion}
                    </p>
                  )}
                </div>
              </div>

              <div className="ml-4 shrink-0 text-right">
                <p className="text-sm font-medium text-slate-700">{e.fecha}</p>

                <p className="mt-1 text-xs text-slate-400">{e.hora}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default Recordatorios;
