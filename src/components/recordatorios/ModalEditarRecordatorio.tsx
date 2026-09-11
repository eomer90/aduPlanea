import { useState } from "react";
import type { TypeNuevoRecordatorio } from "../../Types/TypeNuevoRecordatorio";
import ModalCargando from "../ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";

type TypeRecordatorio = TypeNuevoRecordatorio & {
  _id: string;
};

interface Props {
  setAbrirModalEditarRecordatorio: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  recordatorioSeleccionado: TypeRecordatorio;
  obtenerRecordatorios: () => Promise<void>;
}

function ModalEditarRecordatorio({
  setAbrirModalEditarRecordatorio,
  recordatorioSeleccionado,
  obtenerRecordatorios,
}: Props) {
  const [recordatorio, setRecordatorio] = useState<TypeNuevoRecordatorio>(
    recordatorioSeleccionado,
  );

  const [cargando, setCargando] = useState<boolean>(false);

  const [eliminando, setEliminando] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setRecordatorio({
      ...recordatorio,
      [name]: value,
    });
  };

  /*
   * Guardar cambios
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setCargando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${SERVER}/recordatorios/${recordatorioSeleccionado._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(recordatorio),
        },
      );

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAbrirModalEditarRecordatorio(false);

      await obtenerRecordatorios();
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  /*
   * Eliminar recordatorio
   */
  const eliminarRecordatorio = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este recordatorio?",
    );

    if (!confirmar) return;

    setEliminando(true);

    try {
      const token = localStorage.getItem("token");

      const req = await fetch(
        `${SERVER}/recordatorios/${recordatorioSeleccionado._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const res = await req.json();

      if (res.error) {
        console.log(res.mensaje);
        return;
      }

      setAbrirModalEditarRecordatorio(false);

      await obtenerRecordatorios();
    } catch (error) {
      console.log(error);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {(cargando || eliminando) && <ModalCargando />}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        {/* HEADER */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">
            Editar recordatorio
          </h2>

          <button
            type="button"
            onClick={() => setAbrirModalEditarRecordatorio(false)}
            className="text-xl text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* FORMULARIO */}
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Nombre
            </label>

            <input
              type="text"
              name="nombre"
              value={recordatorio.nombre}
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
              value={recordatorio.fecha}
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
              value={recordatorio.hora}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Descripción
            </label>

            <input
              type="text"
              name="descripcion"
              value={recordatorio.descripcion}
              onChange={handleChange}
              placeholder="Escribe los detalles del recordatorio..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* ACCIONES */}
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={eliminarRecordatorio}
            disabled={eliminando}
            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Eliminar
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAbrirModalEditarRecordatorio(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={cargando}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ModalEditarRecordatorio;
