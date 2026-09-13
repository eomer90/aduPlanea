import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const SERVER = import.meta.env.VITE_API_URL;

function RutaProtegida() {
  const [verificando, setVerificando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setVerificando(false);
        return;
      }

      try {
        const req = await fetch(`${SERVER}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!req.ok) {
          localStorage.removeItem("token");
          setAutorizado(false);
          return;
        }

        setAutorizado(true);
      } catch (error) {
        console.log(error);
        localStorage.removeItem("token");
        setAutorizado(false);
      } finally {
        setVerificando(false);
      }
    };

    verificarToken();
  }, []);

  if (verificando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!autorizado) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
