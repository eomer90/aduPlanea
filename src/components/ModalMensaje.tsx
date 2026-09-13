type Props = {
  mensaje: string;
  cerrar: () => void;
};

function ModalMensaje({ mensaje, cerrar }: Props) {
  const mensajeExito =
    mensaje === "Inicio de sesión exitoso" ||
    mensaje === "Registro realizado con éxito";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-slate-900">Aviso</h2>

        <p className="mt-3 text-sm text-slate-600">{mensaje}</p>

        {!mensajeExito && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={cerrar}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              Aceptar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModalMensaje;
