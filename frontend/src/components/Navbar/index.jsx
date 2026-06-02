import { Link, useNavigate } from "react-router-dom";
import { Bell, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../services/api";
import "./styles.css";

const API_URL = "http://127.0.0.1:8000";

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {}
  );

  const [totalPendencias, setTotalPendencias] = useState(0);

  useEffect(() => {
    buscarUsuario();

    window.addEventListener("userUpdated", buscarUsuario);
    window.addEventListener("storage", buscarUsuario);

    return () => {
      window.removeEventListener("userUpdated", buscarUsuario);
      window.removeEventListener("storage", buscarUsuario);
    };
  }, []);

  async function buscarUsuario() {
    try {
      const response = await api.get("/perfil/");
      const perfil = response.data;

      setUser(perfil);
      localStorage.setItem("user", JSON.stringify(perfil));

      if (perfil?.tipo === "admin") {
        await buscarPendencias();
      } else {
        setTotalPendencias(0);
      }
    } catch (error) {
      console.log("Erro ao buscar usuário:", error.response?.data);
    }
  }

  async function buscarPendencias() {
    try {
      const [filmes, edicoes] = await Promise.all([
        api.get("/filmes/pendentes/"),
        api.get("/edicoes/pendentes/"),
      ]);

      const total =
        (Array.isArray(filmes.data) ? filmes.data.length : 0) +
        (Array.isArray(edicoes.data) ? edicoes.data.length : 0);

      setTotalPendencias(total);
    } catch (error) {
      console.log("Erro ao buscar pendências:", error.response?.data);
      setTotalPendencias(0);
    }
  }

  function getFotoUsuario() {
    if (!user?.foto) return "/imagens/user.jpg";

    if (user.foto.startsWith("http")) {
      return `${user.foto}?v=${Date.now()}`;
    }

    return `${API_URL}${user.foto}?v=${Date.now()}`;
  }

  function sair() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  const isAdmin = user?.tipo === "admin";

  return (
    <header className="navbar">
      <nav>
        <Link to="/home">Home</Link>
        <Link to="/catalogo">Catálogo</Link>
        <Link to="/adicionar">+ Adicionar</Link>
      </nav>

      <div className="user-area">
        {isAdmin && (
          <div
            className="notification-wrapper"
            onClick={() => navigate("/aprovacao")}
            title="Aprovações pendentes"
          >
            <Bell size={18} />

            {totalPendencias > 0 && (
              <span className="notification-badge">{totalPendencias}</span>
            )}
          </div>
        )}

        <div className="user-info" onClick={() => navigate("/perfil")}>
          <img
            key={user?.foto || "default-user"}
            src={getFotoUsuario()}
            alt="Usuário"
            className="user-avatar"
            onError={(e) => {
              e.currentTarget.src = "/imagens/user.png";
            }}
          />

          <span>{user?.nome || "Usuário"}</span>
        </div>

        <button onClick={sair} className="logout-btn">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}