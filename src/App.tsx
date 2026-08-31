import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import NuevaClase from "./Routes/NuevaClase";
import Clases from "./Routes/Clases";
import Detalles from "./Routes/Detalles";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nueva-clase" element={<NuevaClase />} />
        <Route path="/clases" element={<Clases />} />
        <Route path="/clases/:id" element={<Detalles />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
