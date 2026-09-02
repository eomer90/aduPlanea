function ModalCargando() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="rounded-xl bg-white px-6 py-5 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600"></div>
          <span className="text-sm font-medium text-slate-700">
            Cargando...
          </span>
        </div>
      </div>
    </div>
  );
}
export default ModalCargando;
