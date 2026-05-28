import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, LogOut } from "lucide-react";
import api from "../services/api";
import "../styles/EditarFilme.css";

export default function AdicionarFilme() {
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [salvando, setSalvando] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    ano: "",
    duracao: "",
    sinopse: "",
    poster: "",
    diretor: "",
    produtora: "",
    orcamento: "",
    pais: "",
    linguagem: "",
  });

  const [generos, setGeneros] = useState([]);
  const [atores, setAtores] = useState([]);
  const [novoGenero, setNovoGenero] = useState("");
  const [novoAtor, setNovoAtor] = useState("");

  useEffect(() => {
    buscarUsuario();
  }, []);

  async function buscarUsuario() {
    try {
      const response = await api.get("/perfil/");
      setUser(response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (error) {
      console.log("Erro ao buscar usuário:", error.response?.data);
    }
  }

  function alterarCampo(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function adicionarGenero() {
    const genero = novoGenero.trim();
    if (!genero) return;

    const existe = generos.some(
      (item) => item.toLowerCase() === genero.toLowerCase()
    );

    if (!existe) {
      setGeneros([...generos, genero]);
    }

    setNovoGenero("");
  }

  function adicionarAtor() {
    const ator = novoAtor.trim();
    if (!ator) return;

    const existe = atores.some(
      (item) => item.toLowerCase() === ator.toLowerCase()
    );

    if (!existe) {
      setAtores([...atores, ator]);
    }

    setNovoAtor("");
  }

  function removerGenero(genero) {
    setGeneros(generos.filter((item) => item !== genero));
  }

  function removerAtor(ator) {
    setAtores(atores.filter((item) => item !== ator));
  }

  function validarCampos() {
    if (!form.titulo.trim()) return "Preencha o título.";
    if (!form.ano) return "Preencha o ano.";
    if (generos.length === 0) return "Adicione pelo menos um gênero.";
    if (!form.sinopse.trim()) return "Preencha a sinopse.";
    if (!form.poster.trim()) return "Preencha a URL do poster.";
    if (!form.diretor.trim()) return "Preencha o diretor.";
    if (atores.length === 0) return "Adicione pelo menos um ator.";
    if (!form.produtora.trim()) return "Preencha a produtora.";
    if (!form.pais.trim()) return "Preencha o país.";
    if (!form.linguagem.trim()) return "Preencha a linguagem.";
    return "";
  }

  async function salvar(e) {
    e.preventDefault();

    const erroValidacao = validarCampos();

    if (erroValidacao) {
      alert(erroValidacao);
      return;
    }

    try {
      setSalvando(true);

      const payload = {
        titulo: form.titulo.trim(),
        ano: Number(form.ano),
        genero: generos.join(" / "),
        sinopse: form.sinopse.trim(),
        poster: form.poster.trim(),
        diretor: form.diretor.trim(),
        atores: atores.join(", "),
        produtora: form.produtora.trim(),
        orcamento: form.orcamento ? String(form.orcamento) : "0.00",
        pais: form.pais.trim(),
        linguagem: form.linguagem.trim(),
      };

      await api.post("/filmes/", payload);

      alert(
        user?.tipo === "admin"
          ? "Filme cadastrado com sucesso!"
          : "Filme enviado para aprovação do administrador!"
      );

      navigate("/catalogo");
    } catch (error) {
      console.log("Erro ao cadastrar filme:", error.response?.data);
      alert("Erro ao cadastrar filme.");
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    localStorage.clear();
    navigate("/", { replace: true });
  }

  const imagemUsuario = user?.foto || "/imagens/user.png";
  const isAdmin = user?.tipo === "admin";

  return (
    <div className="editar-page">
      <header className="editar-header">
        <nav>
          <Link to="/home">Home</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/favoritos">Favoritos</Link>
          <Link to="/adicionar">+ Adicionar</Link>
        </nav>

        <div className="header-user">
          {isAdmin && <Bell size={18} onClick={() => navigate("/aprovacao")} />}

          <div className="user-info" onClick={() => navigate("/perfil")}>
            <img
              src={imagemUsuario}
              alt="Usuário"
              className="header-avatar"
              onError={(e) => {
                e.currentTarget.src = "/imagens/user.png";
              }}
            />

            <span>{user?.nome || "Usuário"}</span>
          </div>

          <button className="logout-btn" onClick={sair}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="editar-content">
        <div className="editar-container">
          <Link to="/catalogo" className="voltar">
            <ArrowLeft size={17} />
            Voltar
          </Link>

          <div className="editar-topo">
            <div>
              <h1>Adicionar Novo Filme</h1>
              <p>Preencha as informações do filme.</p>
            </div>
          </div>

          <form onSubmit={salvar} className="editar-form">
            <h2>Informações</h2>

            <label>Título</label>
            <input name="titulo" value={form.titulo} onChange={alterarCampo} />

            <div className="linha">
              <div>
                <label>Ano</label>
                <input name="ano" value={form.ano} onChange={alterarCampo} />
              </div>

              <div>
                <label>Duração</label>
                <input name="duracao" value={form.duracao} onChange={alterarCampo} />
              </div>
            </div>

            <label>Gêneros</label>
            <div className="input-add">
              <input
                value={novoGenero}
                onChange={(e) => setNovoGenero(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    adicionarGenero();
                  }
                }}
              />

              <button type="button" onClick={adicionarGenero}>
                + Adicionar
              </button>
            </div>

            <div className="tags">
              {generos.map((genero) => (
                <span key={genero} onClick={() => removerGenero(genero)}>
                  {genero}
                </span>
              ))}
            </div>

            <label>Sinopse</label>
            <textarea name="sinopse" value={form.sinopse} onChange={alterarCampo} />

            <label>Diretor</label>
            <input name="diretor" value={form.diretor} onChange={alterarCampo} />

            <div className="linha">
              <div>
                <label>Estúdio</label>
                <input
                  name="produtora"
                  value={form.produtora}
                  onChange={alterarCampo}
                />
              </div>

              <div>
                <label>Orçamento</label>
                <input
                  name="orcamento"
                  value={form.orcamento}
                  onChange={alterarCampo}
                />
              </div>
            </div>

            <div className="linha">
              <div>
                <label>País</label>
                <input name="pais" value={form.pais} onChange={alterarCampo} />
              </div>

              <div>
                <label>Idioma</label>
                <input
                  name="linguagem"
                  value={form.linguagem}
                  onChange={alterarCampo}
                />
              </div>
            </div>

            <label>Atores</label>
            <div className="input-add">
              <input
                value={novoAtor}
                onChange={(e) => setNovoAtor(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    adicionarAtor();
                  }
                }}
              />

              <button type="button" onClick={adicionarAtor}>
                + Adicionar
              </button>
            </div>

            <div className="tags">
              {atores.map((ator) => (
                <span key={ator} onClick={() => removerAtor(ator)}>
                  {ator}
                </span>
              ))}
            </div>

            <label>URL do poster</label>
            <input name="poster" value={form.poster} onChange={alterarCampo} />

            <div className="botoes-form">
              <button type="submit" className="btn-salvar" disabled={salvando}>
                {salvando ? "Salvando..." : "Salvar"}
              </button>

              <button
                type="button"
                className="btn-cancelar"
                onClick={() => navigate("/catalogo")}
                disabled={salvando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="editar-footer">
        <div className="footer-logo">
          <img src="/imagens/mascote.png" alt="logo" />
          <strong>Filminis</strong>
        </div>

        <span>© 2026 Copyright - Lyvia Borges</span>
      </footer>
    </div>
  );
}