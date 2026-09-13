import { useEffect, useState } from "react";
import Header from "../components/Header";
import Panel from "../components/Panel";
import ModalCargando from "../components/ModalCargando";
import ModalRecordatorio from "../components/recordatorios/ModalRecordatorio";
import ModalEditarRecordatorio from "../components/recordatorios/ModalEditarRecordatorio";
import inicialRecordatorioMongo from "../Types/TypeRecordatorioMongo";
import type { TypeRecordatorioMongo } from "../Types/TypeRecordatorioMongo";

const SERVER = import.meta.env.VITE_API_URL;

const Recordatorios = () => {
  const [recordatorios, setRecordatorios] = useState<TypeRecordatorioMongo[]>(
    [],
  );
  const [modalRecordatorio, setModalRecordatorio] = useState(false);
  const [abrirModalEditarRecordatorio, setAbrirModalEditarRecordatorio] =
    useState(false);
  const [recordatorioSeleccionado, setRecordatorioSeleccionado] =
    useState<TypeRecordatorioMongo>(inicialRecordatorioMongo);
  const [cargando, setCargando] = useState(false);

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
      if (!req.ok) {
        console.log(res.mensaje);
        return;
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

  const hoyString = [
    hoy.getFullYear(),
    String(hoy.getMonth() + 1).padStart(2, "0"),
    String(hoy.getDate()).padStart(2, "0"),
  ].join("-");

  const haceSieteDias = new Date(hoy);
  haceSieteDias.setDate(haceSieteDias.getDate() - 7);

  const haceSieteDiasString = [
    haceSieteDias.getFullYear(),
    String(haceSieteDias.getMonth() + 1).padStart(2, "0"),
    String(haceSieteDias.getDate()).padStart(2, "0"),
  ].join("-");

  const recordatoriosPasados = recordatorios
    .filter((e) => {
      const fecha = e.fecha.split("T")[0];
      return fecha < hoyString && fecha >= haceSieteDiasString;
    })
    .sort((a, b) => {
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
    });

  const recordatoriosHoy = recordatorios.filter((e) => {
    const fecha = e.fecha.split("T")[0];
    return fecha === hoyString;
  });

  const recordatoriosFuturos = recordatorios
    .filter((e) => {
      const fecha = e.fecha.split("T")[0];
      return fecha > hoyString;
    })
    .sort((a, b) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });

  const formatoFecha = (fecha: string) => {
    const [anio, mes, dia] = fecha.split("T")[0].split("-");
    return `${dia}/${mes}/${anio}`;
  };

  const abrirRecordatorio = (recordatorio: TypeRecordatorioMongo) => {
    setRecordatorioSeleccionado(recordatorio);
    setAbrirModalEditarRecordatorio(true);
  };

  return (
    <>
      <Header />
      <Panel />
      <main className="min-h-screen bg-slate-50 pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 md:p-6">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Recordatorios
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Organiza tus pendientes y actividades importantes.
              </p>
            </div>

            <button
              onClick={() => setModalRecordatorio(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              + Agregar recordatorio
            </button>
          </div>

          <div className="space-y-6">
            {recordatoriosPasados.length > 0 && (
              <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-600">
                      Pasados recientemente
                    </h2>

                    <p className="text-xs text-slate-400">
                      Recordatorios de los últimos 7 días
                    </p>
                  </div>

                  <span className="text-xs text-slate-400">
                    {recordatoriosPasados.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {recordatoriosPasados.map((recordatorio) => (
                    <button
                      key={recordatorio._id}
                      onClick={() => abrirRecordatorio(recordatorio)}
                      className="group flex w-full items-center justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-left transition hover:border-slate-200 hover:bg-white"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-500">
                          ✓
                        </div>

                        <p className="truncate text-sm font-medium text-slate-600 group-hover:text-slate-800">
                          {recordatorio.nombre}
                        </p>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-xs text-slate-400">
                          {formatoFecha(recordatorio.fecha)}
                        </span>

                        <span className="text-slate-300 transition group-hover:text-slate-500">
                          →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {recordatoriosHoy.length > 0 && (
              <section className="rounded-xl border border-indigo-200 bg-indigo-50 p-5 shadow-sm">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-indigo-900">Hoy</h2>

                    <span className="rounded-full bg-indigo-200 px-2 py-0.5 text-xs font-semibold text-indigo-700">
                      {recordatoriosHoy.length}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-indigo-600">
                    Recordatorios que requieren tu atención hoy.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recordatoriosHoy.map((recordatorio) => (
                    <button
                      key={recordatorio._id}
                      onClick={() => abrirRecordatorio(recordatorio)}
                      className="group rounded-xl border border-indigo-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-400 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                          📌
                        </div>

                        <span className="text-xs font-semibold text-indigo-500">
                          HOY
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-800">
                        {recordatorio.nombre}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {recordatorio.descripcion}
                      </p>

                      <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                        <span>📅 {formatoFecha(recordatorio.fecha)}</span>

                        <span>🕐 {recordatorio.hora}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-slate-800">Futuros</h2>

                <p className="mt-1 text-sm text-slate-500">
                  Próximos recordatorios y actividades.
                </p>
              </div>

              {recordatoriosFuturos.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center">
                  <div className="mb-2 text-2xl">📅</div>

                  <p className="text-sm font-medium text-slate-500">
                    No tienes recordatorios próximos.
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Agrega uno para organizar tus próximas actividades.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recordatoriosFuturos.map((recordatorio) => (
                    <button
                      key={recordatorio._id}
                      onClick={() => abrirRecordatorio(recordatorio)}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                          📅
                        </div>

                        <span className="text-xs text-slate-400">
                          {formatoFecha(recordatorio.fecha)}
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">
                        {recordatorio.nombre}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {recordatorio.descripcion}
                      </p>

                      <div className="mt-4 flex items-center text-xs text-slate-400">
                        <span>🕐 {recordatorio.hora}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {modalRecordatorio && (
        <ModalRecordatorio
          setModalRecordatorio={setModalRecordatorio}
          obtenerRecordatorios={obtenerRecordatorios}
        />
      )}

      {abrirModalEditarRecordatorio && (
        <ModalEditarRecordatorio
          recordatorioSeleccionado={recordatorioSeleccionado}
          setAbrirModalEditarRecordatorio={setAbrirModalEditarRecordatorio}
          obtenerRecordatorios={obtenerRecordatorios}
        />
      )}

      {cargando && <ModalCargando />}
    </>
  );
};

export default Recordatorios;
