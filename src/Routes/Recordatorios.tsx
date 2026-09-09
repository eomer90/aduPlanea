import { useState } from "react";
import Panel from "../components/Panel";
import Header from "../components/Header";
import type { TypeNuevoRecordatorio } from "../Types/TypeNuevoRecordatorio";
import ModalRecordatorio from "../components/recordatorios/ModalRecordatorio";
// import inicialRecordatorio from "../../Types/TypeNuevoRecordatorio";

type TypeRecordatorioBack = TypeNuevoRecordatorio & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

function Recordatorios() {
  const [recordatorios, setRecordatorios] = useState<TypeRecordatorioBack[]>(
    [],
  );
  const [modalRecordatorio, setModalRecordatorio] = useState<boolean>(false);

  //   const handleChange

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="ml-60 pt-16">
        <div className="p-6">
          {/* ENCABEZADO */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-900">
                Recordatorios
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Información y recordatorios importantes de tus clases.
              </p>
            </div>
          </div>

          {/* CONTENIDO */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {recordatorios.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <h2 className="text-lg font-semibold text-slate-800">
                  Aún no hay recordatorios
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Agrega un recordatorio para comenzar.
                </p>

                <button
                  type="button"
                  onClick={() => setModalRecordatorio(true)}
                  className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                >
                  + Agregar recordatorio
                </button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recordatorios.map((e) => (
                  <button
                    key={e._id}
                    type="button"
                    onClick={() => {
                      // setVerRecordatorio(true);
                      // setRecordatorioSeleccionado(e);
                    }}
                    className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* <h2 className="font-semibold text-slate-800">
                        {e.titulo}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {e.descripcion}
                      </p> */}
                      </div>

                      <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600">
                        Recordatorio
                      </span>
                    </div>

                    {/* <p className="mt-4 text-xs text-slate-400">
                    {e.fecha}
                  </p> */}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {modalRecordatorio && (
          <ModalRecordatorio setModalRecordatorio={setModalRecordatorio} />
        )}

        {/* 
      {EditarRecordatorio && (
        <ModalEditarRecordatorio
          setVerRecordatorio={setVerRecordatorio}
          recordatorioSeleccionado={recordatorioSeleccionado}
          obtenerRecordatorios={obtenerRecordatorios}
        />
      )}
      */}
      </main>
    </div>
  );
}

export default Recordatorios;
