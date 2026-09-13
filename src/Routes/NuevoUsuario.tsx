import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import nuevoUsuarioInicial from "../Types/TypeNuevoUsuario";
import ModalCargando from "../components/ModalCargando";
import ModalMensaje from "../components/ModalMensaje";
import type { TypeNuevoUsuario } from "../Types/TypeNuevoUsuario";
import type { TypeEscuelaMongo } from "../Types/TypeEscuelaMongo";

const SERVER = import.meta.env.VITE_API_URL;

function NuevoUsuario() {
  const [formUsuario, setFormUsuario] =
    useState<TypeNuevoUsuario>(nuevoUsuarioInicial);
  const [escuelas, setEscuelas] = useState<TypeEscuelaMongo[]>([]);
  const [usuarios, setUsuarios] = useState<TypeNuevoUsuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>("");

  const navigate = useNavigate();

  const obtenerEscuelas = async (nivel: string) => {
    if (!nivel) {
      setEscuelas([]);
      return;
    }
    setCargando(true);
    try {
      const req = await fetch(`${SERVER}/escuelas/nivel/${nivel}`);
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        setEscuelas([]);
        return;
      }
      setEscuelas(res.escuelasEncontradas);
    } catch (error) {
      console.log(error);
      setEscuelas([]);
    } finally {
      setCargando(false);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const req = await fetch(`${SERVER}/usuarios`);
      const res = await req.json();
      if (!req.ok) {
        console.log(res.mensaje);
        return;
      }
      console.log(res.usuariosEncontrados);
      setUsuarios(res.usuariosEncontrados);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "nivelEducativo") {
      setFormUsuario({
        ...formUsuario,
        nivelEducativo: value,
        escuelaId: "",
      });
      obtenerEscuelas(value);
      return;
    }
    setFormUsuario({
      ...formUsuario,
      [name]: value,
    });
  };

  const usernames = usuarios.map((u) => u.username.toLowerCase());

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const passwordCorrecta = formUsuario.password.length >= 8;
    const usernameCorrecto = !usernames.includes(
      formUsuario.username.toLowerCase(),
    );
    if (!passwordCorrecta) {
      setMensaje("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (!usernameCorrecto) {
      setMensaje("El nombre de usuario ya existe");
      return;
    }
    setCargando(true);
    setMensaje("");
    try {
      const req = await fetch(`${SERVER}/registro/usuario`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formUsuario),
      });
      const res = await req.json();
      if (!req.ok) {
        setMensaje(res.mensaje);
        return;
      }
      setMensaje(res.mensaje);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Crear cuenta
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Regístrate y crea tu cuenta de EduPlanea.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nivel educativo
            </span>

            <select
              name="nivelEducativo"
              value={formUsuario.nivelEducativo}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">Selecciona un nivel</option>
              <option value="Preescolar">Preescolar</option>
              <option value="Primaria">Primaria</option>
              <option value="Secundaria">Secundaria</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Escuela</span>

            <select
              name="escuelaId"
              value={formUsuario.escuelaId}
              onChange={handleChange}
              disabled={!formUsuario.nivelEducativo}
              required
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">
                {!formUsuario.nivelEducativo
                  ? "Primero selecciona un nivel"
                  : escuelas.length === 0
                    ? "No hay escuelas registradas"
                    : "Selecciona una escuela"}
              </option>

              {escuelas.map((escuela) => (
                <option key={escuela._id} value={escuela._id}>
                  {escuela.nombreEscuela}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre completo
            </span>

            <input
              type="text"
              name="nombreUsuario"
              value={formUsuario.nombreUsuario}
              onChange={handleChange}
              placeholder="Ej. Juan Pérez"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Correo electrónico
            </span>

            <input
              type="email"
              name="correo"
              value={formUsuario.correo}
              onChange={handleChange}
              placeholder="Ej. juanperez@email.com"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Nombre de usuario
            </span>

            <input
              type="text"
              name="username"
              value={formUsuario.username}
              onChange={handleChange}
              placeholder="Ej. juanperez"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">
              Contraseña
            </span>

            <input
              type="password"
              name="password"
              value={formUsuario.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <button
            type="submit"
            disabled={cargando}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:bg-slate-400"
          >
            Crear cuenta
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={cargando}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Regresar
          </button>
        </form>

        {cargando && <ModalCargando />}
        {mensaje && (
          <ModalMensaje mensaje={mensaje} cerrar={() => setMensaje("")} />
        )}
      </div>
    </div>
  );
}

export default NuevoUsuario;
