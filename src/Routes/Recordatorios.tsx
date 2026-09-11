import { useEffect, useState } from "react";
import Panel from "../components/Panel";
import Header from "../components/Header";
import type { TypeNuevoRecordatorio } from "../Types/TypeNuevoRecordatorio";
import ModalRecordatorio from "../components/recordatorios/ModalRecordatorio";
import ModalCargando from "../components/ModalCargando";
import inicialRecordatorio from "../Types/TypeNuevoRecordatorio";
import ModalEditarRecordatorio from "../components/recordatorios/ModalEditarRecordatorio";

const SERVER = import.meta.env.VITE_API_URL;

type TypeRecordatorioBack = TypeNuevoRecordatorio & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

const inicialRecordatorioBack: TypeRecordatorioBack = {
  ...inicialRecordatorio,
  escuelaId: "",
  usuarioId: "",
  _id: "",
};

function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<TypeRecordatorioBack[]>(
    [],
  );
  const [modalRecordatorio, setModalRecordatorio] = useState<boolean>(false);
  const [abrirModalEditarRecordatorio, setAbrirModalEditarRecordatorio] =
    useState<boolean>(false);
  const [recordatorioSeleccionado, setRecordatorioSeleccionado] =
    useState<TypeRecordatorioBack>(inicialRecordatorioBack);
  const [cargando, setCargando] = useState<boolean>(false);

  const obtenerRecordatorios = async () => {
    setCargando(true);
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
      }

      setRecordatorios(res.recordatoriosEncontrados);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerRecordatorios();
  }, []);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const recordatoriosPasados = recordatorios.filter((e) => {
    const fecha = new Date(e.fecha);
    fecha.setHours(0, 0, 0, 0);
    return fecha < hoy;
  });

  const recordatoriosHoy = recordatorios.filter((e) => {
    const fecha = new Date(e.fecha);
    fecha.setHours(0, 0, 0, 0);
    return fecha.getTime() === hoy.getTime();
  });

  const recordatoriosFuturos = recordatorios.filter((e) => {
    const fecha = new Date(e.fecha);
    fecha.setHours(0, 0, 0, 0);
    return fecha > hoy;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* ENCABEZADO */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Recordatorios
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Información y recordatorios importantes de tus clases.
              </p>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            {recordatorios.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center sm:p-10">
                <h2 className="text-lg font-semibold text-slate-800">
                  Aún no hay recordatorios
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Agrega un recordatorio para comenzar.
                </p>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10">
                {/* PASADOS */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Pasados
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Recordatorios que ya han pasado.
                    </p>
                  </div>

                  {recordatoriosPasados.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-400">
                        No hay recordatorios pasados.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {recordatoriosPasados.map((e) => (
                        <button
                          key={e._id}
                          type="button"
                          onClick={() => {
                            setAbrirModalEditarRecordatorio(true);
                            setRecordatorioSeleccionado(e);
                          }}
                          className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5"
                        >
                          {/* ENCABEZADO */}
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11">
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
                                <h2 className="truncate font-semibold text-slate-800 group-hover:text-indigo-700">
                                  {e.nombre}
                                </h2>

                                <span className="text-xs text-slate-400">
                                  Recordatorio
                                </span>
                              </div>
                            </div>

                            <div className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m9 5 7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* DESCRIPCIÓN */}
                          {e.descripcion && (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {e.descripcion}
                            </p>
                          )}

                          {/* FECHA Y HORA */}
                          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3.75 9.75h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                                />
                              </svg>

                              <span>
                                {new Date(e.fecha).toLocaleDateString("es-MX")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v6l4 2"
                                />
                                <circle cx="12" cy="12" r="9" />
                              </svg>

                              <span>{e.hora}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>

                {/* HOY */}
                {recordatoriosHoy.length > 0 && (
                  <section>
                    <div className="mb-4">
                      <h2 className="text-lg font-semibold text-indigo-700">
                        Hoy
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Recordatorios programados para hoy.
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {recordatoriosHoy.map((e) => (
                        <button
                          key={e._id}
                          type="button"
                          onClick={() => {
                            setAbrirModalEditarRecordatorio(true);
                            setRecordatorioSeleccionado(e);
                          }}
                          className="group w-full rounded-2xl border border-indigo-200 bg-indigo-50/30 p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md sm:p-5"
                        >
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 sm:h-11 sm:w-11">
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
                                <h2 className="truncate font-semibold text-slate-800 group-hover:text-indigo-700">
                                  {e.nombre}
                                </h2>

                                <span className="text-xs font-medium text-indigo-500">
                                  Hoy
                                </span>
                              </div>
                            </div>

                            <div className="mt-1 shrink-0 text-indigo-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m9 5 7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>

                          {e.descripcion && (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {e.descripcion}
                            </p>
                          )}

                          <div className="mt-5 flex flex-col gap-3 border-t border-indigo-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3.75 9.75h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                                />
                              </svg>

                              <span>
                                {new Date(e.fecha).toLocaleDateString("es-MX")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v6l4 2"
                                />
                                <circle cx="12" cy="12" r="9" />
                              </svg>

                              <span>{e.hora}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                {/* FUTUROS */}
                <section>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                      Futuros
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Próximos recordatorios.
                    </p>
                  </div>

                  {recordatoriosFuturos.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm text-slate-400">
                        No hay próximos recordatorios.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {recordatoriosFuturos.map((e) => (
                        <button
                          key={e._id}
                          type="button"
                          onClick={() => {
                            setAbrirModalEditarRecordatorio(true);
                            setRecordatorioSeleccionado(e);
                          }}
                          className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-5"
                        >
                          {/* ENCABEZADO */}
                          <div className="flex items-start justify-between gap-3 sm:gap-4">
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 sm:h-11 sm:w-11">
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
                                <h2 className="truncate font-semibold text-slate-800 group-hover:text-indigo-700">
                                  {e.nombre}
                                </h2>

                                <span className="text-xs text-slate-400">
                                  Recordatorio
                                </span>
                              </div>
                            </div>

                            <div className="mt-1 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m9 5 7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>

                          {/* DESCRIPCIÓN */}
                          {e.descripcion && (
                            <p className="mt-4 text-sm leading-6 text-slate-500">
                              {e.descripcion}
                            </p>
                          )}

                          {/* FECHA Y HORA */}
                          <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.75 3v2.25M17.25 3v2.25M3.75 9.75h16.5M5.25 5.25h13.5A1.5 1.5 0 0 1 20.25 6.75v12A1.5 1.5 0 0 1 18.75 20.25H5.25a1.5 1.5 0 0 1-1.5-1.5v-12a1.5 1.5 0 0 1 1.5-1.5Z"
                                />
                              </svg>

                              <span>
                                {new Date(e.fecha).toLocaleDateString("es-MX")}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.8}
                                stroke="currentColor"
                                className="h-4 w-4 shrink-0 text-indigo-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M12 6v6l4 2"
                                />
                                <circle cx="12" cy="12" r="9" />
                              </svg>

                              <span>{e.hora}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* BOTÓN AGREGAR */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setModalRecordatorio(true)}
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
              >
                + Agregar recordatorio
              </button>
            </div>
          </div>
        </div>

        {/* MODAL NUEVO */}
        {modalRecordatorio && (
          <ModalRecordatorio
            setModalRecordatorio={setModalRecordatorio}
            obtenerRecordatorios={obtenerRecordatorios}
          />
        )}

        {/* MODAL EDITAR */}
        {abrirModalEditarRecordatorio && (
          <ModalEditarRecordatorio
            setAbrirModalEditarRecordatorio={setAbrirModalEditarRecordatorio}
            recordatorioSeleccionado={recordatorioSeleccionado}
            obtenerRecordatorios={obtenerRecordatorios}
          />
        )}

        {cargando && <ModalCargando />}
      </main>
    </div>
  );
}

export default Recordatorios;
