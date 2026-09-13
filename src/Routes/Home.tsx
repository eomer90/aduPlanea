import { useEffect, useState } from "react";
import ClasesDelDia from "../components/inicio/ClasesDelDia";
import Header from "../components/Header";
import Panel from "../components/Panel";
import InicioRecordatorios from "../components/inicio/InicioRecordatorios";

const SERVER = import.meta.env.VITE_API_URL;

function Home() {
  const [cantidadRecordatorios, setCantidadRecordatorios] = useState<number>(0);
  const [cantidadClasesHoy, setCantidadClasesHoy] = useState<number>(0);
  const [cantidadAlumnos, setCantidadAlumnos] = useState<number>(0);

  const username = localStorage.getItem("username");

  const obtenerAlumnos = async () => {
    try {
      const token = localStorage.getItem("token");
      const req = await fetch(SERVER + "/alumnos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      setCantidadAlumnos(res.alumnos.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    obtenerAlumnos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="pt-16 md:ml-60">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
              {username ? `¡Hola, ${username}! 👋` : "¡Hola! 👋"}
            </h2>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Bienvenido a EduPlanea.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Organiza tus clases y planeaciones de manera sencilla desde un
              solo lugar.
            </p>
          </div>

          <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-slate-500">
                Clases de hoy
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {cantidadClasesHoy}
              </p>

              <p className="mt-1 text-sm text-slate-400">
                Programadas para hoy
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-slate-500">Alumnos</p>

              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {cantidadAlumnos}
              </p>

              <p className="mt-1 text-sm text-slate-400">Alumnos registrados</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-slate-500">
                Recordatorios
              </p>

              <p className="mt-2 text-3xl font-bold text-indigo-600">
                {cantidadRecordatorios}
              </p>

              <p className="mt-1 text-sm text-slate-400">Pendientes</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm font-medium text-slate-500">Anotaciones</p>

              <p className="mt-2 text-3xl font-bold text-indigo-600">3</p>

              <p className="mt-1 text-sm text-slate-400">
                Anotaciones registradas
              </p>
            </div>
          </section>

          <section className="mb-8 border-b border-slate-200 pb-8">
            <ClasesDelDia setCantidadClasesHoy={setCantidadClasesHoy} />
          </section>

          <section className="mb-8 border-b border-slate-200 pb-8">
            <InicioRecordatorios
              setCantidadRecordatorios={setCantidadRecordatorios}
            />
          </section>

          <section>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Anotaciones
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Consulta tus anotaciones y observaciones.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    Reunión con padres
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Revisar los acuerdos establecidos durante la reunión.
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    10 de septiembre de 2026
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    Planeación semanal
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Preparar los contenidos y actividades de la próxima semana.
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    9 de septiembre de 2026
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-800">
                    Material pendiente
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Revisar material necesario para las próximas clases.
                  </p>

                  <p className="mt-3 text-xs text-slate-400">
                    8 de septiembre de 2026
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer />
    </div>
  );
}

export default Home;
