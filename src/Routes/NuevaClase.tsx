import { useState } from "react";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import defaultClaseNueva from "../Types/TypeClaseNueva";
import FormClases from "../components/FormClases";
import Header from "../components/Header";
import Panel from "../components/Panel";
import { useNavigate } from "react-router-dom";

function NuevaClase() {
  const [formClase, setFormClase] = useState<TypeClaseNueva>(defaultClaseNueva);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-3xl p-8">
          <div className="mb-8">
            <button
              type="button"
              onClick={() => navigate("/clases")}
              className="mb-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              ← Regresar a mis clases
            </button>

            <h2 className="text-3xl font-semibold text-slate-900">
              Crear una clase
            </h2>

            <p className="mt-2 text-slate-500">
              Completa la información para crear una nueva clase.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <FormClases formClase={formClase} setFormClase={setFormClase} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default NuevaClase;
