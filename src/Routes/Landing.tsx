import Header from "../components/Header";

function Landing() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 text-slate-800">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Bienvenido a EduPlanea
            </p>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Organiza tu trabajo docente de una manera sencilla
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              EduPlanea es una herramienta para ayudarte a organizar tus clases,
              alumnos, evaluaciones, asistencia y recordatorios desde un solo
              lugar.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/registro"
                className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Crear una cuenta
              </a>

              <a
                href="/login"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Iniciar sesión
              </a>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-slate-900">
              Todo lo que necesitas para organizar tus clases
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              EduPlanea busca facilitar la organización de tu trabajo docente,
              permitiéndote concentrar en un solo espacio la información que
              necesitas durante el ciclo escolar.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Organiza tus clases
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Registra tus clases, materias, grupos, salones, horarios y
                periodos escolares para tener toda tu información organizada.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Administra a tus alumnos
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Mantén organizada la información de tus alumnos y consulta su
                desempeño y asistencia de acuerdo con cada materia.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">
                Lleva el seguimiento
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Registra asistencia, evaluaciones y diferentes aspectos del
                trabajo de tus alumnos durante el ciclo escolar.
              </p>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900">
                Comienza en pocos pasos
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                Crea tu cuenta y empieza a organizar tu información docente.
              </p>
            </div>

            <div className="mt-10 grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                  1
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Crea tu cuenta
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Registra tus datos y la información de tu escuela.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-600">
                  2
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Registra tus clases
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Agrega tus materias, grupos, horarios y periodos escolares.
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 font-bold text-slate-900">
                  3
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Organiza tu trabajo
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Administra alumnos, asistencia, evaluaciones y recordatorios.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-2xl bg-slate-800 px-8 py-12 text-center text-white">
            <h2 className="text-3xl font-bold">
              Tu trabajo docente, organizado en un solo lugar
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-300">
              Consulta y administra la información de tus clases sin tener que
              depender de diferentes herramientas para cada tarea.
            </p>

            <a
              href="/registro"
              className="mt-8 inline-block rounded-lg bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Comenzar con EduPlanea
            </a>
          </div>
        </section>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-slate-500">
            © 2026 EduPlanea. Una herramienta para la organización docente.
          </div>
        </footer>
      </main>
    </>
  );
}

export default Landing;
