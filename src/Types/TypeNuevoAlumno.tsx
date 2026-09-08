export type TypeAsistencia = {
  fecha: string;
  estado: "presente" | "falta" | "retardo" | "justificado";
  observaciones: string;
};

export type TypeMaterias = {
  nombre: string;
  asistencias: TypeAsistencia[];
};

export type TypeActividad = {
  alumnoId: string;
  titulo: string;
  fecha: string;
  estado: string;
  observaciones: string;
};

export interface TypeNuevoAlumno {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  materias: TypeMaterias[];
  actividades: TypeActividad[];
}

const estadoInicial: TypeNuevoAlumno = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  grado: "",
  grupo: "",
  materias: [],
  actividades: [],
};

export default estadoInicial;
