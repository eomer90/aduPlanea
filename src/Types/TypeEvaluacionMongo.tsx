import type { TypeNuevaEvaluacion } from "../Types/TypeNuevaEvaluacion";

export type TypeEvaluacionMongo = TypeNuevaEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};
