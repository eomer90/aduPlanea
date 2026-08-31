import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import Tarjetas from "../components/Tarjetas";
import Header from "../components/Header";
import Panel from "../components/Panel";

type TypeClase = TypeClaseNueva & {
  _id: string;
};

const SERVER = "http://localhost:3000";
const ROUTE = "/clases";

function Clases() {
  const [clases, setClases] = useState<TypeClase[]>([]);

  const navigate = useNavigate();

  const obtenerClases = async () => {
    try {
      const req = await fetch(SERVER + ROUTE);

      if (!req.ok) {
        throw new Error(`Error: ${req.status}`);
      }
      const res = await req.json();
      setClases(res.clases);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-semibold text-slate-900">
                Mis clases
              </h2>

              <p className="mt-1 text-slate-500">
                Administra tus clases y planeaciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/nueva-clase")}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              + Crear clase
            </button>
          </div>

          <Tarjetas clases={clases} />
        </div>
      </main>
    </div>
  );
}

export default Clases;
