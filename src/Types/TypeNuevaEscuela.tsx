export type TypeRegistro = {
  nombreEscuela: string;
  nivelEducativo: string;
  nombreUsuario: string;
  correo: string;
  username: string;
  password: string;
};

const registroInicial: TypeRegistro = {
  nombreEscuela: "",
  nivelEducativo: "",
  nombreUsuario: "",
  correo: "",
  username: "",
  password: "",
};

export default registroInicial;
