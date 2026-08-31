export interface TypeAsistencia {
  fecha: string;
  estado: "presente" | "falta" | "retardo" | "justificado";
  observaciones: string;
}

export interface TypeEstado {
  id: string;
  estado: "presente" | "falta" | "retardo" | "justificado";
}

export interface TypeObservaciones {
  id: string;
  observaciones: string;
}

export interface TypeNuevoAlumno {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  grado: string;
  grupo: string;
  asistencias: TypeAsistencia[];
  calificacion: string;
}

const nuevoAlumno: TypeNuevoAlumno = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  grado: "",
  grupo: "",
  asistencias: [],
  calificacion: "",
};

export default nuevoAlumno;
