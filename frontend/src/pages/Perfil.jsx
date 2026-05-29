import { useEffect, useState } from "react";
import { Heart, Mail, User, Film, Shield, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/Perfil.css";

const API_URL = "http://127.0.0.1:8000";

export default function Perfil() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

  useEffect(() => {
    buscarDados();
  }, []);

  async function buscarDados() {
    try {
      setCarregando(true);

      const [perfilResponse, favoritosResponse] = await Promise.all([
        api.get("/perfil/"),
        api.get("/favoritos/"),
      ]);

      setUser(perfilResponse.data);
      localStorage.setItem("user", JSON.stringify(perfilResponse.data));

      setFavoritos(
        Array.isArray(favoritosResponse.data) ? favoritosResponse.data : []
      );
    } catch (error) {
      console.log("Erro ao buscar perfil:", error.response?.data);
    } finally {
      setCarregando(false);
    }
  }

  async function uploadFoto(e) {
    const arquivo = e.target.files[0];
    if (!arquivo) return;

    try {
      setEnviandoFoto(true);

      const formData = new FormData();
      formData.append("foto", arquivo);

      await api.post("/perfil/foto/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const perfilAtualizado = await api.get("/perfil/");

      setUser(perfilAtualizado.data);
      localStorage.setItem("user", JSON.stringify(perfilAtualizado.data));
      window.dispatchEvent(new Event("userUpdated"));

      alert("Foto atualizada com sucesso!");
    } catch (error) {
      console.log("Erro ao atualizar foto:", error.response?.data);
      alert(
        error.response?.data?.erro ||
          error.response?.data?.detail ||
          "Erro ao atualizar foto."
      );
    } finally {
      setEnviandoFoto(false);
      e.target.value = "";
    }
  }

  function getFotoUsuario() {
    if (!user?.foto) return "/imagens/user.png";

    if (user.foto.startsWith("http")) {
      return user.foto;
    }

    return `${API_URL}${user.foto}`;
  }

  function getPoster(filme) {
    return filme?.poster || "/imagens/fundo_login.png";
  }

  const tipoConta = user?.tipo === "admin" ? "Administrador" : "Usuário Comum";

  if (carregando) {
    return (
      <div className="perfil-page">
        <Navbar />
        <main className="perfil-container">
          <p className="loading">Carregando perfil...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Navbar />

      <main className="perfil-container">
        <section className="perfil-card">
          <div className="perfil-topo">
            <div className="perfil-avatar-area">
              <img
                src={getFotoUsuario()}
                alt="Foto do usuário"
                className="perfil-avatar"
                onError={(e) => {
                  e.currentTarget.src = "/imagens/user.png";
                }}
              />

              <label className="btn-trocar-foto">
                <Camera size={15} />
                {enviandoFoto ? "Enviando..." : "Alterar foto"}

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadFoto}
                  hidden
                  disabled={enviandoFoto}
                />
              </label>
            </div>

            <div>
              <div className="perfil-nome-area">
                <h1>{user?.nome || "Usuário"}</h1>

                <span className="perfil-badge">
                  <Shield size={13} />
                  {user?.tipo === "admin" ? "Admin" : "Comum"}
                </span>
              </div>

              <p>
                <Mail size={16} />
                {user?.email || "E-mail não informado"}
              </p>
            </div>
          </div>

          <div className="perfil-stats">
            <div>
              <Heart size={20} />
              <strong>{favoritos.length}</strong>
              <span>Favoritos</span>
            </div>

            <div>
              <Film size={20} />
              <strong>{user?.id || 0}</strong>
              <span>ID do Usuário</span>
            </div>

            <div>
              <User size={20} />
              <strong>{user?.tipo === "admin" ? "Admin" : "Comum"}</strong>
              <span>Tipo de Conta</span>
            </div>
          </div>
        </section>

        <section className="dados-card">
          <h2>Dados Pessoais</h2>

          <div className="dados-grid">
            <div>
              <label>Nome Completo</label>
              <input value={user?.nome || ""} readOnly />
            </div>

            <div>
              <label>Email</label>
              <input value={user?.email || ""} readOnly />
            </div>

            <div>
              <label>Tipo de Conta</label>
              <input value={tipoConta} readOnly />
            </div>

            <div>
              <label>ID do Usuário</label>
              <input value={user?.id || ""} readOnly />
            </div>
          </div>
        </section>

        <section className="favoritos-section">
          <div className="favoritos-titulo">
            <Heart size={26} />
            <h2>Filmes Favoritos</h2>
          </div>

          {favoritos.length === 0 ? (
            <p className="sem-favoritos">Nenhum filme favoritado ainda.</p>
          ) : (
            <div className="favoritos-grid">
              {favoritos.map((item) => {
                const filme = item.filme;

                return (
                  <article
                    key={item.id}
                    className="favorito-card"
                    onClick={() => navigate(`/filme/${filme.id}`)}
                  >
                    <img
                      src={getPoster(filme)}
                      alt={filme.titulo}
                      onError={(e) => {
                        e.currentTarget.src = "/imagens/fundo_login.png";
                      }}
                    />

                    <h3>{filme.titulo}</h3>
                    <p>{filme.ano}</p>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}