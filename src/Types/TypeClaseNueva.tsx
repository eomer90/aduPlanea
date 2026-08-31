type Horario = {
  dia: string;
  inicio: string;
  fin: string;
};

export type TypeClaseNueva = {
  nombre: string;
  materia: string;
  grado: string;
  grupo: string;
  horarios: Horario[];
  periodoInicio: string;
  periodoFin: string;
};

const defaultClaseNueva: TypeClaseNueva = {
  nombre: "",
  materia: "",
  grado: "",
  grupo: "",
  horarios: [],
  periodoInicio: "",
  periodoFin: "",
};
export default defaultClaseNueva;
