function Recordatorios() {
  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-slate-900">
        Recordatorios
      </h2>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h3 className="font-medium text-slate-800">Entregar planeación</h3>
            <p className="mt-1 text-sm text-slate-500">
              Planeación de Matemáticas · 1° A
            </p>
          </div>

          <span className="text-sm text-slate-500">Mañana</span>
        </div>

        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <div>
            <h3 className="font-medium text-slate-800">Evaluación</h3>
            <p className="mt-1 text-sm text-slate-500">
              Evaluación de Español · 2° B
            </p>
          </div>

          <span className="text-sm text-slate-500">Viernes</span>
        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <h3 className="font-medium text-slate-800">
              Registrar calificaciones
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Calificaciones pendientes · 3° A
            </p>
          </div>

          <span className="text-sm text-slate-500">10 Sep</span>
        </div>
      </div>
    </section>
  );
}

export default Recordatorios;
