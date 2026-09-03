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
  salon: string;
  horarios: Horario[];
  periodoInicio: string;
  periodoFin: string;
};

const defaultClaseNueva: TypeClaseNueva = {
  nombre: "",
  materia: "",
  grado: "",
  grupo: "",
  salon: "",
  horarios: [],
  periodoInicio: "",
  periodoFin: "",
};
export default defaultClaseNueva;
