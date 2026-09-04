export type TypeNuevoUsuario = {
  nombreEscuela: string;
  nivelEducativo: string;
  nombreUsuario: string;
  correo: string;
  username: string;
  password: string;
};

const nuevoUsuarioInicial: TypeNuevoUsuario = {
  nombreEscuela: "",
  nivelEducativo: "",
  nombreUsuario: "",
  correo: "",
  username: "",
  password: "",
};

export default nuevoUsuarioInicial;
