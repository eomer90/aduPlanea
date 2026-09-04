import Header from "../components/Header";
import Panel from "../components/Panel";
import FormEscuela from "../components/FormEscuela";

function Registro() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <Panel />

      <main className="ml-60 pt-16">
        <FormEscuela />
      </main>
    </div>
  );
}

export default Registro;
