import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Pencil,
  Trash2,
  Calendar,
  Globe2,
  DollarSign,
  Bell,
  LogOut,
  Film,
} from "lucide-react";
import api from "../services/api";
import "../styles/DetalhesFilme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function DetalhesFilme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [filme, setFilme] = useState(null);
  const [favoritado, setFavoritado] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarUsuario();
    buscarFilme();
    verificarFavorito();
  }, [id]);

  async function buscarUsuario() {
    try {
      const response = await api.get("/perfil/");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log("Erro ao buscar usuário:", error.response?.data);
    }
  }

  async function buscarFilme() {
    try {
      setCarregando(true);

      const response = await api.get(`/filmes/${id}/`);
      setFilme(response.data);
    } catch (error) {
      console.log("Erro ao buscar filme:", error.response?.data);
      alert("Erro ao carregar detalhes do filme.");
      navigate("/home");
    } finally {
      setCarregando(false);
    }
  }

  async function verificarFavorito() {
    try {
      const response = await api.get("/favoritos/");
      const lista = Array.isArray(response.data) ? response.data : [];

      const existe = lista.some((item) => String(item?.filme?.id) === String(id));
      setFavoritado(existe);
    } catch (error) {
      console.log("Erro ao verificar favorito:", error.response?.data);
    }
  }

  async function alternarFavorito() {
    try {
      if (favoritado) {
        await api.delete(`/filmes/${id}/desfavoritar/`);
        setFavoritado(false);
      } else {
        await api.post(`/filmes/${id}/favoritar/`);
        setFavoritado(true);
      }
    } catch (error) {
      console.log("Erro ao favoritar:", error.response?.data);
      alert("Não foi possível alterar favorito.");
    }
  }

  async function deletarFilme() {
    const confirmar = confirm("Deseja realmente deletar este filme?");
    if (!confirmar) return;

    try {
      await api.delete(`/filmes/${id}/`);
      alert("Filme deletado com sucesso!");
      navigate("/catalogo");
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

  function getTitulo() {
    return filme?.titulo || "Filme sem título";
  }

  function getPoster() {
    return filme?.poster || "/imagens/fundo_login.png";
  }

  function getGeneroLista() {
    return String(filme?.genero || "Sem gênero")
      .split("/")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function getAtoresLista() {
    return String(filme?.atores || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function formatarOrcamento(valor) {
    if (!valor) return "Não informado";

    const numero = Number(valor);

    if (Number.isNaN(numero)) {
      return valor;
    }

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  const imagemUsuario = user?.foto || "/imagens/user.png";
  const isAdmin = user?.tipo === "admin";

  if (carregando) {
    return (
      <div className="detalhes-page">
        <p className="loading">Carregando filme...</p>
      </div>
    );
  }

  return (
    <div className="detalhes-page">
      <Navbar/>
      <section
        className="detalhes-banner"
        style={{ backgroundImage: `url(${getPoster()})` }}
      >
        <div className="detalhes-hero-layout">
          <img src={getPoster()} alt={getTitulo()} className="detalhes-poster" />

          <div className="detalhes-hero">
            <Link to="/catalogo" className="detalhes-voltar">
              <ArrowLeft size={20} />
              Voltar
            </Link>

            <h1>{getTitulo()}</h1>

            <p>
              {filme?.ano || "Ano não informado"} •{" "}
              {filme?.genero || "Gênero não informado"}
            </p>

            <p className="detalhes-sinopse">
              {filme?.sinopse || "Sinopse não informada."}
            </p>

            <div className="detalhes-acoes">
              <button className="btn-favoritar" onClick={alternarFavorito}>
                <Heart size={18} fill={favoritado ? "white" : "none"} />
                {favoritado ? "Favoritado" : "Favoritar"}
              </button>

              <button
                className="btn-editar"
                onClick={() => navigate(`/editar-filme/${id}`)}
              >
                <Pencil size={18} />
                {isAdmin ? "Editar" : "Solicitar alteração"}
              </button>

              {isAdmin && (
                <button className="btn-deletar" onClick={deletarFilme}>
                  <Trash2 size={18} />
                  Deletar
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="detalhes-content">
        <section className="detalhes-grid">
          <div className="detalhes-box">
            <h2>Informações</h2>

            <p>
              <Calendar size={22} />
              <span>Ano lançamento</span>
              <strong>{filme?.ano || "Não informado"}</strong>
            </p>

            <p>
              <Film size={22} />
              <span>Gênero</span>
              <strong>{filme?.genero || "Não informado"}</strong>
            </p>

            <p>
              <Globe2 size={22} />
              <span>País / Linguagem</span>
              <strong>
                {filme?.pais || "País não informado"} /{" "}
                {filme?.linguagem || "Linguagem não informada"}
              </strong>
            </p>

            <p>
              <DollarSign size={22} />
              <span>Orçamento</span>
              <strong>{formatarOrcamento(filme?.orcamento)}</strong>
            </p>
          </div>

          <div className="detalhes-box">
            <h2>Produção</h2>

            <div className="producao-item">
              <span>Diretor</span>
              <strong>{filme?.diretor || "Diretor não informado"}</strong>
            </div>

            <div className="producao-item">
              <span>Produtora</span>
              <strong>{filme?.produtora || "Produtora não informada"}</strong>
            </div>

            <div className="producao-item">
              <span>Gênero</span>

              <div className="tags">
                {getGeneroLista().map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="elenco">
          <h2>Elenco Principal</h2>

          <div className="tags">
            {getAtoresLista().length > 0 ? (
              getAtoresLista().map((ator) => <span key={ator}>{ator}</span>)
            ) : (
              <span>Elenco não informado</span>
            )}
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}