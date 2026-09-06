export type TypeAsistencia = {
  fecha: string;
  estado: "presente" | "falta" | "retardo" | "justificado";
  observaciones: string;
};

export type TypeMaterias = {
  nombre: string;
  asistencias: TypeAsistencia[];
};

export interface TypeNuevoAlumno {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  materias: TypeMaterias[];
}

const estadoInicial: TypeNuevoAlumno = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  grado: "",
  grupo: "",
  materias: [],
};

export default estadoInicial;
