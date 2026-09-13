export type TypeManifestacion = {
  pdaId: string;
  manifestacion: string;
};

export type TypeResultadoAlumno = {
  alumnoId: string;
  calificacion: string;
  nivelDesempeno: string;
  observaciones: string;
  manifestaciones: TypeManifestacion[];
};

export type TypeNuevaEvaluacion = {
  nombre: string;
  fecha: string;
  instrumento: string;
  cuantitativa: boolean;
  cualitativa: boolean;
  materia: string;
  claseId: string;
  contenidoId: string;
  pdaIds: string[];
  resultados: TypeResultadoAlumno[];
};

const evaluacionInicial: TypeNuevaEvaluacion = {
  nombre: "",
  fecha: "",
  materia: "",
  claseId: "",
  instrumento: "",
  cuantitativa: false,
  cualitativa: false,
  contenidoId: "",
  pdaIds: [],
  resultados: [],
};

export default evaluacionInicial;
