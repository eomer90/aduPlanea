import type { TypeClaseNueva } from "./TypeClaseNueva";
import defaultClaseNueva from "./TypeClaseNueva";

export type TypeClaseMongo = TypeClaseNueva & {
  _id: string;
  usuarioId: string;
  escuelaId: string;
};

const inicialClaseMongo: TypeClaseMongo = {
  ...defaultClaseNueva,
  escuelaId: "",
  usuarioId: "",
  _id: "",
};

export default inicialClaseMongo;
