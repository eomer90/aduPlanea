export type TypeManifestacion = {
  pdaId: string;
  manifestacion: string;
};

export type TypeResultadoAlumno = {
  alumnoId: string;
  realizoEvaluacion: boolean | null;
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
  observacionesGenerales: string;
  materia: string;
  claseId: string;
  contenidoId: string;
  pdaIds: string[];
  resultados: TypeResultadoAlumno[];
};

const evaluacionInicial: TypeNuevaEvaluacion = {
  nombre: "",
  fecha: "",
  instrumento: "",
  cuantitativa: false,
  cualitativa: false,
  observacionesGenerales: "",
  materia: "",
  claseId: "",
  contenidoId: "",
  pdaIds: [],
  resultados: [],
};

export default evaluacionInicial;
