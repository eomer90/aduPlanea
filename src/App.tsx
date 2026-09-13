import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Landing from "./Routes/Landing";
import NuevaClase from "./Routes/NuevaClase";
import Clases from "./Routes/Clases";
import Detalles from "./Routes/Detalles";
import Login from "./Routes/Login";
import Registro from "./Routes/Registro";
import NuevoUsuario from "./Routes/NuevoUsuario";
import RutaProtegida from "./components/RutaProtegida";
import Recordatorios from "./Routes/Recordatorios";
import RecuperarContrasena from "./Routes/RecuperarContrasena";
import RestablecerContrasena from ".//Routes/RestablecerContrasena";
import CambiarContrasena from "./Routes/CambiarContrasena";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
        <Route path="/recuperar-contrasena" element={<RecuperarContrasena />} />
        <Route
          path="/restablecer-contrasena/:token"
          element={<RestablecerContrasena />}
        />

        <Route element={<RutaProtegida />}>
          <Route path="/inicio" element={<Home />} />
          <Route path="/clases" element={<Clases />} />
          <Route path="/nueva-clase" element={<NuevaClase />} />
          <Route path="/clases/:id" element={<Detalles />} />
          <Route path="/recordatorios" element={<Recordatorios />} />
          <Route path="/cambiar-contrasena" element={<CambiarContrasena />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
