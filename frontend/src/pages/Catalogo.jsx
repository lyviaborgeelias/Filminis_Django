import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  LogOut,
  ArrowLeft,
  SlidersHorizontal,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import api from "../services/api";
import "../styles/Catalogo.css";

export default function Catalogo() {
  const navigate = useNavigate();

  const [filmes, setFilmes] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});

  const [busca, setBusca] = useState("");
  const [genero, setGenero] = useState("");
  const [ano, setAno] = useState("");
  const [diretor, setDiretor] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarUsuario();
    buscarFilmes();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      buscarFilmes();
    }, 400);

    return () => clearTimeout(delay);
  }, [busca, ano, diretor]);

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

      const params = {};

      if (busca) params.titulo = busca;
      if (ano) params.ano = ano;
      if (diretor) params.diretor = diretor;

      const response = await api.get("/filmes/", { params });
      setFilmes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.log("Erro ao buscar filmes:", error);
      setErro("Erro ao carregar os filmes.");
    } finally {
      setCarregando(false);
    }
  }

  async function deletarFilme(id) {
    const confirmar = confirm("Deseja realmente deletar este filme?");
    if (!confirmar) return;

    try {
      await api.delete(`/filmes/${id}/`);

      setFilmes((listaAtual) =>
        listaAtual.filter((filme) => String(filme.id) !== String(id))
      );

      alert("Filme deletado com sucesso!");
    } catch (error) {
      console.log("Erro ao deletar filme:", error.response?.data);
      alert(
        error.response?.data?.erro ||
          error.response?.data?.detail ||
          "Erro ao deletar filme."
      );
    }
  }

  function sair() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  function getPoster(filme) {
    return filme?.poster || "/imagens/fundo_login.png";
  }

  function getUserImage() {
    return user?.foto || "/imagens/user.png";
  }

  function separarGeneros(valor) {
    return String(valor || "")
      .split("/")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const generos = useMemo(() => {
    return [
      ...new Set(
        filmes
          .flatMap((filme) => separarGeneros(filme.genero))
          .filter(Boolean)
          .sort()
      ),
    ];
  }, [filmes]);

  const anos = useMemo(() => {
    return [
      ...new Set(filmes.map((filme) => filme.ano).filter(Boolean)),
    ].sort((a, b) => Number(b) - Number(a));
  }, [filmes]);

  const diretores = useMemo(() => {
    return [
      ...new Set(
        filmes
          .map((filme) => filme.diretor)
          .filter(Boolean)
          .sort()
      ),
    ];
  }, [filmes]);

  const filmesFiltrados = useMemo(() => {
    return filmes.filter((filme) => {
      const generosFilme = separarGeneros(filme.genero);
      return !genero || generosFilme.includes(genero);
    });
  }, [filmes, genero]);

  const isAdmin = user?.tipo === "admin";

  return (
    <div className="catalogo-page">
      <header className="navbar">
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/catalogo" className="ativo">
            Catálogo
          </Link>
          <Link to="/favoritos">Favoritos</Link>
          <Link to="/adicionar">+ Adicionar</Link>
        </nav>

        <div className="user-area">
          {isAdmin && (
            <Bell size={18} onClick={() => navigate("/aprovacao")} />
          )}

          <div className="user-info" onClick={() => navigate("/perfil")}>
            <img
              src={getUserImage()}
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

      <main className="catalogo-content">
        <Link to="/home" className="voltar">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <h1>Catálogo de Filmes</h1>
        <p className="subtitulo">Explore nossa coleção</p>

        <div className="barra-busca">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar por título..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="filtros">
          <span>
            <SlidersHorizontal size={15} />
            Filtros:
          </span>

          <select value={genero} onChange={(e) => setGenero(e.target.value)}>
            <option value="">Todos os gêneros</option>
            {generos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={ano} onChange={(e) => setAno(e.target.value)}>
            <option value="">Todos os anos</option>
            {anos.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <select value={diretor} onChange={(e) => setDiretor(e.target.value)}>
            <option value="">Todos os diretores</option>
            {diretores.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {erro && <p className="loading">{erro}</p>}

        {carregando && filmes.length === 0 ? (
          <p className="loading">Carregando filmes...</p>
        ) : (
          <section className="lista-filmes">
            {filmesFiltrados.length === 0 ? (
              <p className="loading">Nenhum filme encontrado.</p>
            ) : (
              filmesFiltrados.map((filme) => (
                <article key={filme.id} className="catalogo-card">
                  <img
                    src={getPoster(filme)}
                    alt={filme.titulo}
                    className="poster-filme"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/imagens/fundo_login.png";
                    }}
                  />

                  <div className="catalogo-info">
                    <h2>{filme.titulo || "Filme sem título"}</h2>

                    <p className="info-filme">
                      {filme.ano || "Ano não informado"} •{" "}
                      {filme.genero || "Gênero não informado"} •{" "}
                      {filme.diretor || "Diretor não informado"}
                    </p>

                    <p className="sinopse">
                      {filme.sinopse || "Sinopse não informada."}
                    </p>
                  </div>

                  <div className="card-acoes">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/filme/${filme.id}`)}
                    >
                      <Eye size={21} />
                      Ver
                    </button>

                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/editar-filme/${filme.id}`)}
                    >
                      <Pencil size={21} />
                      {isAdmin ? "Editar" : "Solicitar alteração"}
                    </button>

                    {isAdmin && (
                      <button
                        className="btn-deletar"
                        onClick={() => deletarFilme(filme.id)}
                      >
                        <Trash2 size={21} />
                        Deletar
                      </button>
                    )}
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>

      <footer className="catalogo-footer">
        <div className="footer-logo">
          <img src="/imagens/mascote.png" alt="mascote" />
          <strong>Filminis</strong>
        </div>

        <span>© 2026 Copyright - Lyvia Borges</span>
      </footer>
    </div>
  );
}