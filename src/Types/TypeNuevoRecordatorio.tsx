export interface TypeNuevoRecordatorio {
  nombre: string;
  fecha: string;
  hora: string;
  descripcion: string;
}

const inicialRecordatorio: TypeNuevoRecordatorio = {
  nombre: "",
  fecha: "",
  hora: "",
  descripcion: "",
};

export default inicialRecordatorio;
