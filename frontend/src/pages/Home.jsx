import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { Heart, LogOut, Play, Bell, ArrowRight } from "lucide-react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_URL = "http://127.0.0.1:8000";

export default function Home() {
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarUsuario();
    buscarFilmes();
    buscarFavoritos();
  }, []);

  async function buscarUsuario() {
    try {
      const response = await api.get("/perfil/");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  }

  async function buscarFilmes() {
    try {
      setCarregando(true);
      setErro("");

      const response = await api.get("/filmes/");
      const lista = Array.isArray(response.data) ? response.data : [];

      setFilmes(lista);
    } catch (error) {
      console.log("Erro ao buscar filmes:", error);
      setErro("Erro ao carregar os filmes.");
    } finally {
      setCarregando(false);
    }
  }

  async function buscarFavoritos() {
    try {
      const response = await api.get("/favoritos/");
      const lista = Array.isArray(response.data) ? response.data : [];

      const ids = lista
        .map((item) => item?.filme?.id)
        .filter(Boolean);

      setFavoritos(ids);
    } catch (error) {
      console.log("Erro ao buscar favoritos:", error);
    }
  }

  async function alternarFavorito(e, filmeId) {
    e.stopPropagation();

    try {
      if (favoritos.includes(filmeId)) {
        await api.delete(`/filmes/${filmeId}/desfavoritar/`);
        setFavoritos((atual) => atual.filter((id) => id !== filmeId));
      } else {
        await api.post(`/filmes/${filmeId}/favoritar/`);
        setFavoritos((atual) => [...atual, filmeId]);
      }
    } catch (error) {
      console.log("Erro ao favoritar:", error);
      alert("Não foi possível alterar o favorito.");
    }
  }

  function sair() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  function getPoster(filme) {
    if (!filme?.poster) return "/imagens/fundo_login.png";

    if (filme.poster.startsWith("http")) {
      return filme.poster;
    }

    return `${API_URL}${filme.poster}`;
  }

  function getUserImage() {
    if (!user?.foto) return "/imagens/user.png";

    if (user.foto.startsWith("http")) {
      return user.foto;
    }

    return `${API_URL}${user.foto}`;
  }

  const filmeDestaque = filmes[0];

  return (
    <div className="home-page">
      <Navbar/>
      {carregando && filmes.length === 0 ? (
        <main className="content">
          <p className="loading">Carregando filmes...</p>
        </main>
      ) : erro ? (
        <main className="content">
          <p className="loading">{erro}</p>
        </main>
      ) : (
        <>
          {filmeDestaque && (
            <section className="banner">
              <div className="banner-content">
                <img
                  src="/imagens/crepusculo_logo.png"
                  alt="Crepúsculo"
                  className="banner-logo"
                  loading="lazy"
                />

                <p className="banner-info">
                  {filmeDestaque.ano || "Ano não informado"} •{" "}
                  {filmeDestaque.genero || "Gênero não informado"}
                </p>

                <p className="banner-sinopse">
                  {filmeDestaque.sinopse
                    ? `${filmeDestaque.sinopse.slice(0, 180)}...`
                    : "Sinopse não informada."}
                </p>

                <div className="banner-buttons">
                  <button
                    className="btn-light"
                    onClick={() => navigate(`/filme/${filmeDestaque.id}`)}
                  >
                    <Play size={16} />
                    Informações
                  </button>

                  <button
                    className="btn-gold"
                    onClick={() => navigate("/catalogo")}
                  >
                    <ArrowRight size={16} />
                    Ver catálogo
                  </button>
                </div>
              </div>
            </section>
          )}

          <main className="content">
            <section className="movie-grid">
              {filmes.map((filme) => (
                <article
                  className="movie-card"
                  key={filme.id}
                  onClick={() => navigate(`/filme/${filme.id}`)}
                >
                  <div className="poster-box">
                    <img
                      src={getPoster(filme)}
                      alt={filme.titulo}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/imagens/fundo_login.png";
                      }}
                    />

                    <button
                      className="favorite-btn"
                      onClick={(e) => alternarFavorito(e, filme.id)}
                    >
                      <Heart
                        size={22}
                        fill={favoritos.includes(filme.id) ? "white" : "none"}
                      />
                    </button>
                  </div>

                  <h3>{filme.titulo || "Filme sem título"}</h3>

                  <p>
                    {filme.ano || "Ano não informado"} |{" "}
                    {filme.genero || "Sem gênero"}
                  </p>
                </article>
              ))}
            </section>
          </main>
        </>
      )}
      <Footer/>
    </div>
  );
}