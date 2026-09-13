import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Tarjetas from "../components/clases/Tarjetas";
import Header from "../components/Header";
import Panel from "../components/Panel";
import ModalCargando from "../components/ModalCargando";
import type { TypeClaseMongo } from "../Types/TypeClaseMongo";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";

function Clases() {
  const [clases, setClases] = useState<TypeClaseMongo[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const obtenerClases = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(`${SERVER}/clases`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      setClases(res.clases);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClases();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="pb-20 pt-16 md:ml-60 md:pb-0">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
                Mis clases
              </h2>

              <p className="mt-1 text-slate-500">
                Administra tus clases y planeaciones.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/nueva-clase")}
              className="w-full rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md sm:w-auto"
            >
              + Crear clase
            </button>
          </div>

          <Tarjetas clases={clases} />
        </div>
      </main>

      {cargando && <ModalCargando />}
    </div>
  );
}

export default Clases;
