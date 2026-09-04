import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import NuevaClase from "./Routes/NuevaClase";
import Clases from "./Routes/Clases";
import Detalles from "./Routes/Detalles";
import Login from "./Routes/Login";
import Registro from "./Routes/Registro";
import NuevoUsuario from "./Routes/NuevoUsuario";
import RutaProtegida from "./components/RutaProtegida";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nuevo-usuario" element={<NuevoUsuario />} />
        <Route path="/" element={<Home />} />

        <Route element={<RutaProtegida />}>
          <Route path="/clases" element={<Clases />} />
          <Route path="/nueva-clase" element={<NuevaClase />} />
          <Route path="/clases/:id" element={<Detalles />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
