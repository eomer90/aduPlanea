import { useState } from "react";
import defaultClaseNueva from "../Types/TypeClaseNueva";
import FormClases from "../components/clases/FormClases";
import Header from "../components/Header";
import Panel from "../components/Panel";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";

function NuevaClase() {
  const [formClase, setFormClase] = useState<TypeClaseNueva>(defaultClaseNueva);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <Panel />
      <main className="pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              Crear una clase
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Completa la información para crear una nueva clase.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
            <FormClases formClase={formClase} setFormClase={setFormClase} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default NuevaClase;
