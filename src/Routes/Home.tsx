import Header from "../components/Header";
import Panel from "../components/Panel";

function Home() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />

      <Panel />

      <main className="ml-60 pt-16">
        <div className="mx-auto max-w-7xl p-8">
          <h2 className="text-3xl font-semibold text-slate-900">¡Hola! 👋</h2>

          <p className="mt-2 text-slate-500">Bienvenido a EduPlanea.</p>

          <p className="mt-6 text-slate-600">
            Organiza tus clases y planeaciones de manera sencilla desde un solo
            lugar.
          </p>
        </div>
      </main>

      <footer />
    </div>
  );
}

export default Home;
