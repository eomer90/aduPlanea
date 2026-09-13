export type TypeEscuelaMongo = {
  _id: string;
  nombreEscuela: string;
  nivelEducativo: string;
};

const inicialEscuelaMongo: TypeEscuelaMongo = {
  _id: "",
  nombreEscuela: "",
  nivelEducativo: "",
};

export default inicialEscuelaMongo;
