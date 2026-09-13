import type { TypeNuevoRecordatorio } from "../Types/TypeNuevoRecordatorio";

export type TypeRecordatorioMongo = TypeNuevoRecordatorio & {
  escuelaId: string;
  usuarioId: string;
  _id: string;
};

const inicialRecordatorioMongo: TypeRecordatorioMongo = {
  _id: "",
  nombre: "",
  fecha: "",
  hora: "",
  descripcion: "",
  escuelaId: "",
  usuarioId: "",
};

export default inicialRecordatorioMongo;
