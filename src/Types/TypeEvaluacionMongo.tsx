import type { TypeNuevaEvaluacion } from "../Types/TypeNuevaEvaluacion";

import evaluacionInicial from "../Types/TypeNuevaEvaluacion";

export type TypeEvaluacionMongo = TypeNuevaEvaluacion & {
  claseId: string;
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

const inicialEvaluacionMongo: TypeEvaluacionMongo = {
  ...evaluacionInicial,
  claseId: "",
  escuelaId: "",
  usuarioId: "",
  _id: "",
};

export default inicialEvaluacionMongo;
