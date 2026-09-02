import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { TypeClaseNueva } from "../Types/TypeClaseNueva";
import ModalCargando from "./ModalCargando";

const SERVER = import.meta.env.VITE_API_URL;
// const SERVER = "http://localhost:3000";
const ROUTE = "/clases";

type TypeClase = TypeClaseNueva & {
  _id: string;
};

const fecha = new Date();
const diaSemana = fecha.getDay();

const semana = [
  "domingo",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
];

function ClasesDelDia() {
  const [clasesDia, setClasesDia] = useState<TypeClase[]>([]);
  const [cargando, setCargando] = useState<boolean>(false);

  const navigate = useNavigate();

  const obtenerClasesDelDia = async () => {
    setCargando(true);
    try {
      const req = await fetch(SERVER + ROUTE);
      const res = await req.json();

      const clases = res.clases.filter((c: TypeClaseNueva) => {
        return c.horarios.some((h) => h.dia === semana[diaSemana]);
      });
      setClasesDia(clases);
      console.log(clases);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerClasesDelDia();
  }, []);

  return (
    <div>
      {cargando && <ModalCargando />}

      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Tus clases programadas para el día de hoy
        </h2>
      </div>

      {clasesDia.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">No tienes clases para hoy.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...clasesDia]
            .sort((a, b) => {
              const horarioA = a.horarios.find(
                (h) => h.dia === semana[diaSemana],
              );

              const horarioB = b.horarios.find(
                (h) => h.dia === semana[diaSemana],
              );

              return horarioA!.inicio.localeCompare(horarioB!.inicio);
            })
            .map((clase) => {
              const horarioHoy = clase.horarios.filter(
                (h) => h.dia === semana[diaSemana],
              );
              return (
                <button
                  type="button"
                  onClick={() => navigate(`/clases/${clase._id}`)}
                  key={clase._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                >
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800">
                      {clase.nombre}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {clase.materia} · {clase.grado}° {clase.grupo}
                    </p>

                    <div className="mt-3 border-b border-slate-200 pb-3">
                      <p className="text-sm text-slate-500">
                        Salón: Por asignar
                      </p>
                    </div>

                    <div className="mt-3">
                      {horarioHoy.map((horario, index) => (
                        <p
                          key={index}
                          className="text-sm font-medium text-indigo-600"
                        >
                          Horario: {horario.inicio} - {horario.fin}
                        </p>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
        </div>
      )}
    </div>
  );
}

export default ClasesDelDia;
