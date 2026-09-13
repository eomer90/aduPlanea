export type TypeNuevoUsuario = {
  nombreUsuario: string;
  correo: string;
  username: string;
  password: string;
  nivelEducativo: string;
  escuelaId: string;
};

const nuevoUsuarioInicial: TypeNuevoUsuario = {
  nombreUsuario: "",
  correo: "",
  username: "",
  password: "",
  nivelEducativo: "",
  escuelaId: "",
};

export default nuevoUsuarioInicial;
