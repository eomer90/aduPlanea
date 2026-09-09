import { useState } from "react";
import type { TypeNuevoRecordatorio } from "../../Types/TypeNuevoRecordatorio";
import inicialRecordatorio from "../../Types/TypeNuevoRecordatorio";

interface Props {
  setModalRecordatorio: React.Dispatch<React.SetStateAction<boolean>>;
}
function ModalRecordatorio({ setModalRecordatorio }: Props) {
  const [nuevoRecordatorio, setNuevoRecordatorio] =
    useState<TypeNuevoRecordatorio>(inicialRecordatorio);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNuevoRecordatorio({
      ...nuevoRecordatorio,
      [name]: value,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Nuevo recordatorio
          </h2>

          <button
            type="button"
            onClick={() => setModalRecordatorio(false)}
            className="text-xl text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={nuevoRecordatorio.nombre}
              onChange={handleChange}
              placeholder="Ej. Entrega de proyectos"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Fecha
            </label>

            <input
              type="date"
              name="fecha"
              value={nuevoRecordatorio.fecha}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Hora
            </label>

            <input
              type="time"
              name="hora"
              value={nuevoRecordatorio.hora}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>

            <input
              name="descripcion"
              value={nuevoRecordatorio.descripcion}
              onChange={handleChange}
              placeholder="Escribe los detalles del recordatorio..."
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setModalRecordatorio(false)}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalRecordatorio;
