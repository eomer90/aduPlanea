import { useEffect, useState } from "react";
import type { TypeNuevoRecordatorio } from "../../Types/TypeNuevoRecordatorio";

const SERVER = import.meta.env.VITE_API_URL;

type TypeRecordatorioBack = TypeNuevoRecordatorio & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

interface Props {
  setCantidadRecordatorios: React.Dispatch<React.SetStateAction<number>>;
}

function InicioRecordatorios({ setCantidadRecordatorios }: Props) {
  const [recordatorios, setRecordatorios] = useState<TypeRecordatorioBack[]>(
    [],
  );

  const formatearFecha = (fecha: string) => {
    const fechaFormateada = new Date(fecha);

    return fechaFormateada.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

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

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const limite = new Date(hoy);
      limite.setDate(limite.getDate() + 6);
      limite.setHours(23, 59, 59, 999);

      const recordatoriosPendientes = res.recordatoriosEncontrados.filter(
        (recordatorio: TypeRecordatorioBack) => {
          const fecha = new Date(recordatorio.fecha);

          return fecha >= hoy && fecha <= limite;
        },
      );

      setRecordatorios(recordatoriosPendientes);
      setCantidadRecordatorios(recordatoriosPendientes.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerRecordatorios();
  }, []);

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const recordatoriosPorDia = recordatorios.reduce(
    (grupos: Record<string, TypeRecordatorioBack[]>, recordatorio) => {
      const fecha = new Date(recordatorio.fecha);
      fecha.setHours(0, 0, 0, 0);

      const clave = fecha.toISOString().split("T")[0];

      if (!grupos[clave]) {
        grupos[clave] = [];
      }

      grupos[clave].push(recordatorio);

      return grupos;
    },
    {},
  );

  const fechasOrdenadas = Object.keys(recordatoriosPorDia).sort();

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-900 sm:text-2xl">
        Recordatorios
      </h2>

      <div className="space-y-5">
        {recordatorios.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center sm:p-8">
            <p className="text-sm text-slate-500">
              No tienes recordatorios próximos.
            </p>
          </div>
        ) : (
          fechasOrdenadas.map((fecha) => {
            const fechaActual = new Date(`${fecha}T00:00:00`);

            return (
              <div key={fecha}>
                <h3 className="mb-2 text-sm font-semibold text-slate-500">
                  {diasSemana[fechaActual.getDay()]}
                </h3>

                <div className="space-y-3">
                  {recordatoriosPorDia[fecha]
                    .sort((a, b) => a.hora.localeCompare(b.hora))
                    .map((e) => (
                      <button
                        key={e._id}
                        type="button"
                        className="flex w-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:px-5"
                      >
                        <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
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

                          <div className="min-w-0">
                            <h4 className="break-words font-medium text-slate-800">
                              {e.nombre}
                            </h4>

                            {e.descripcion && (
                              <p className="mt-1 break-words text-sm text-slate-500">
                                {e.descripcion}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="ml-13 shrink-0 border-t border-slate-100 pt-3 text-left sm:ml-4 sm:border-t-0 sm:pt-0 sm:text-right">
                          <p className="text-sm font-medium text-slate-700">
                            {formatearFecha(e.fecha)}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {e.hora}
                          </p>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default InicioRecordatorios;
