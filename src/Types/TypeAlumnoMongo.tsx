import type { TypeNuevoAlumno } from "../Types/TypeNuevoAlumno";

export type TypeAlumnoMongo = TypeNuevoAlumno & {
  _id: string;
  escuelaId: string;
  usuarioId: string;
};
