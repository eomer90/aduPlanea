import ClasesDelDia from "../components/ClasesDelDia";
import Header from "../components/Header";
import Panel from "../components/Panel";
import Recordatorios from "../components/Recordatorios";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-7xl p-8">
          <div className="mb-6 border-b border-slate-200 pb-4">
            <h2 className="text-3xl font-semibold text-slate-900">¡Hola! 👋</h2>

            <p className="mt-2 text-slate-500">Bienvenido a EduPlanea.</p>

            <p className="mt-6 text-slate-600">
              Organiza tus clases y planeaciones de manera sencilla desde un
              solo lugar.
            </p>
          </div>

          <section className="mb-8">
            <ClasesDelDia />
          </section>

          <section>
            <Recordatorios />
          </section>
        </div>
      </main>

      <footer />
    </div>
  );
}

export default Home;
