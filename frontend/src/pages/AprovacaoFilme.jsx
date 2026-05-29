import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bell,
  LogOut,
  CheckCircle,
  XCircle,
  Eye,
  PlusCircle,
  Pencil,
} from "lucide-react";
import api from "../services/api";
import "../styles/AprovacaoFilme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AprovacaoFilmes() {
  const navigate = useNavigate();

  const [aba, setAba] = useState("adicoes");
  const [filmesPendentes, setFilmesPendentes] = useState([]);
  const [edicoesPendentes, setEdicoesPendentes] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [tipoSelecionado, setTipoSelecionado] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    buscarUsuario();
    buscarPendencias();
  }, []);

  async function buscarUsuario() {
    try {
      const response = await api.get("/perfil/");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));

      if (response.data?.tipo !== "admin") {
        alert("Acesso permitido apenas para administradores.");
        navigate("/home");
      }
    } catch {
      navigate("/");
    }
  }

  async function buscarPendencias() {
    try {
      setCarregando(true);
      setErro("");

      let filmes = [];
      let edicoes = [];

      try {
        const filmesResponse = await api.get("/filmes/pendentes/");
        filmes = Array.isArray(filmesResponse.data) ? filmesResponse.data : [];
      } catch (error) {
        console.log("Erro ao buscar filmes pendentes:", error.response?.data);
      }

      try {
        const edicoesResponse = await api.get("/edicoes/pendentes/");
        edicoes = Array.isArray(edicoesResponse.data) ? edicoesResponse.data : [];
      } catch (error) {
        console.log("Erro ao buscar edições pendentes:", error.response?.data);
      }

      setFilmesPendentes(filmes);
      setEdicoesPendentes(edicoes);
    } catch (error) {
      console.log("Erro geral:", error.response?.data);
      setErro("Erro ao carregar solicitações.");
    } finally {
      setCarregando(false);
    }
  }

  async function aprovarFilme(id) {
    try {
      await api.post(`/filmes/${id}/aprovar/`);
      setFilmesPendentes((lista) => lista.filter((item) => item.id !== id));
      setSelecionado(null);
      alert("Filme aprovado com sucesso!");
    } catch (error) {
      console.log(error.response?.data);
      alert("Erro ao aprovar filme.");
    }
  }

  async function recusarFilme(id) {
    if (!confirm("Deseja realmente recusar este filme?")) return;

    try {
      await api.post(`/filmes/${id}/recusar/`);
      setFilmesPendentes((lista) => lista.filter((item) => item.id !== id));
      setSelecionado(null);
      alert("Filme recusado.");
    } catch (error) {
      console.log(error.response?.data);
      alert("Erro ao recusar filme.");
    }
  }

  async function aprovarEdicao(id) {
    try {
      await api.post(`/edicoes/${id}/aprovar/`);
      setEdicoesPendentes((lista) => lista.filter((item) => item.id !== id));
      setSelecionado(null);
      alert("Edição aprovada com sucesso!");
    } catch (error) {
      console.log(error.response?.data);
      alert("Erro ao aprovar edição.");
    }
  }

  async function recusarEdicao(id) {
    if (!confirm("Deseja realmente recusar esta edição?")) return;

    try {
      await api.post(`/edicoes/${id}/recusar/`);
      setEdicoesPendentes((lista) => lista.filter((item) => item.id !== id));
      setSelecionado(null);
      alert("Edição recusada.");
    } catch (error) {
      console.log(error.response?.data);
      alert("Erro ao recusar edição.");
    }
  }

  function abrirDetalhes(item, tipo) {
    setSelecionado(item);
    setTipoSelecionado(tipo);
  }

  function sair() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  function getPoster(item) {
    return (
      item?.poster ||
      item?.dados_depois?.poster ||
      item?.dados_antes?.poster ||
      "/imagens/fundo_login.png"
    );
  }

  function campoAntes(campo) {
    return selecionado?.dados_antes?.[campo] || "Não informado";
  }

  function campoDepois(campo) {
    return selecionado?.dados_depois?.[campo] || "Não informado";
  }

  const listaAtual = aba === "adicoes" ? filmesPendentes : edicoesPendentes;

  return (
    <div className="aprovacao-page">
      <Navbar />
      <main className="aprovacao-dashboard">
        <Link to="/home" className="voltar">
          <ArrowLeft size={18} />
          Voltar
        </Link>

        <div className="dashboard-topo">
          <div>
            <h1>Dashboard de Aprovações</h1>
            <p>Gerencie solicitações de cadastro e edição de filmes</p>
          </div>

          <div className="dashboard-resumo">
            <div>
              <strong>{filmesPendentes.length}</strong>
              <span>Adições</span>
            </div>

            <div>
              <strong>{edicoesPendentes.length}</strong>
              <span>Edições</span>
            </div>
          </div>
        </div>

        <div className="abas-aprovacao">
          <button
            className={aba === "adicoes" ? "aba ativa" : "aba"}
            onClick={() => {
              setAba("adicoes");
              setSelecionado(null);
            }}
          >
            <div className="aba-conteudo">
              <PlusCircle size={17} />
              Solicitações para adicionar

              {filmesPendentes.length > 0 && (
                <span className="badge-notificacao">
                  {filmesPendentes.length}
                </span>
              )}
            </div>
          </button>

          <button
            className={aba === "edicoes" ? "aba ativa" : "aba"}
            onClick={() => {
              setAba("edicoes");
              setSelecionado(null);
            }}
          >
            <div className="aba-conteudo">
              <Pencil size={17} />
              Solicitações para editar

              {edicoesPendentes.length > 0 && (
                <span className="badge-notificacao">
                  {edicoesPendentes.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {erro && <p className="loading">{erro}</p>}

        {carregando ? (
          <p className="loading">Carregando solicitações...</p>
        ) : (
          <section className="dashboard-grid">
            <div className="painel-lista">
              {listaAtual.length === 0 ? (
                <p className="sem-solicitacao">
                  Nenhuma solicitação nesta categoria.
                </p>
              ) : (
                listaAtual.map((item) => (
                  <article
                    key={item.id}
                    className={`solicitacao-card ${selecionado?.id === item.id ? "selecionado" : ""
                      }`}
                    onClick={() =>
                      abrirDetalhes(item, aba === "adicoes" ? "adicao" : "edicao")
                    }
                  >
                    <img
                      src={getPoster(item)}
                      alt={item.titulo || item.filme_titulo}
                      onError={(e) => {
                        e.currentTarget.src = "/imagens/fundo_login.png";
                      }}
                    />

                    <div>
                      <h2>{item.titulo || item.filme_titulo || "Filme sem título"}</h2>
                      <p>
                        {aba === "adicoes"
                          ? "Nova adição de filme"
                          : "Pedido de alteração"}
                      </p>
                      <button type="button">
                        <Eye size={14} />
                        Ver detalhes
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            <div className="painel-detalhes">
              {!selecionado ? (
                <div className="detalhes-vazio">
                  <Eye size={42} />
                  <h2>Selecione uma solicitação</h2>
                  <p>Clique em um item da lista para ver os detalhes.</p>
                </div>
              ) : tipoSelecionado === "adicao" ? (
                <div className="detalhe-box">
                  <h2>Solicitação de Adição</h2>

                  <img
                    src={getPoster(selecionado)}
                    alt={selecionado.titulo}
                    className="detalhe-poster"
                  />

                  <div className="detalhe-info">
                    <p><span>Título</span><strong>{selecionado.titulo}</strong></p>
                    <p><span>Ano</span><strong>{selecionado.ano}</strong></p>
                    <p><span>Gênero</span><strong>{selecionado.genero}</strong></p>
                    <p><span>Diretor</span><strong>{selecionado.diretor}</strong></p>
                    <p><span>Atores</span><strong>{selecionado.atores}</strong></p>
                    <p><span>Produtora</span><strong>{selecionado.produtora}</strong></p>
                    <p><span>País</span><strong>{selecionado.pais}</strong></p>
                    <p><span>Linguagem</span><strong>{selecionado.linguagem}</strong></p>
                    <p className="sinopse-detalhe">
                      <span>Sinopse</span>
                      <strong>{selecionado.sinopse}</strong>
                    </p>
                  </div>

                  <div className="aprovacao-acoes">
                    <button
                      className="btn-aprovar"
                      onClick={() => aprovarFilme(selecionado.id)}
                    >
                      <CheckCircle size={15} />
                      Aprovar
                    </button>

                    <button
                      className="btn-rejeitar"
                      onClick={() => recusarFilme(selecionado.id)}
                    >
                      <XCircle size={15} />
                      Rejeitar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="detalhe-box">
                  <h2>Solicitação de Edição</h2>

                  <div className="comparacao-grid">
                    <div className="comparacao-col antes">
                      <h3>Antes</h3>
                      <p><span>Título</span><strong>{campoAntes("titulo")}</strong></p>
                      <p><span>Ano</span><strong>{campoAntes("ano")}</strong></p>
                      <p><span>Gênero</span><strong>{campoAntes("genero")}</strong></p>
                      <p><span>Diretor</span><strong>{campoAntes("diretor")}</strong></p>
                      <p><span>Atores</span><strong>{campoAntes("atores")}</strong></p>
                      <p><span>Produtora</span><strong>{campoAntes("produtora")}</strong></p>
                      <p><span>País</span><strong>{campoAntes("pais")}</strong></p>
                      <p><span>Linguagem</span><strong>{campoAntes("linguagem")}</strong></p>
                    </div>

                    <div className="comparacao-col depois">
                      <h3>Depois</h3>
                      <p><span>Título</span><strong>{campoDepois("titulo")}</strong></p>
                      <p><span>Ano</span><strong>{campoDepois("ano")}</strong></p>
                      <p><span>Gênero</span><strong>{campoDepois("genero")}</strong></p>
                      <p><span>Diretor</span><strong>{campoDepois("diretor")}</strong></p>
                      <p><span>Atores</span><strong>{campoDepois("atores")}</strong></p>
                      <p><span>Produtora</span><strong>{campoDepois("produtora")}</strong></p>
                      <p><span>País</span><strong>{campoDepois("pais")}</strong></p>
                      <p><span>Linguagem</span><strong>{campoDepois("linguagem")}</strong></p>
                    </div>
                  </div>

                  <div className="sinopse-comparacao">
                    <h3>Sinopse</h3>
                    <p><span>Antes</span>{campoAntes("sinopse")}</p>
                    <p><span>Depois</span>{campoDepois("sinopse")}</p>
                  </div>

                  <div className="aprovacao-acoes">
                    <button
                      className="btn-aprovar"
                      onClick={() => aprovarEdicao(selecionado.id)}
                    >
                      <CheckCircle size={15} />
                      Aprovar edição
                    </button>

                    <button
                      className="btn-rejeitar"
                      onClick={() => recusarEdicao(selecionado.id)}
                    >
                      <XCircle size={15} />
                      Rejeitar edição
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}