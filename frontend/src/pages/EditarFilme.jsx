import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../services/api";
import "../styles/EditarFilme.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function EditarFilme() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || {});
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    titulo: "",
    ano: "",
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
    buscarFilme();
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
      setErro("");

      const response = await api.get(`/filmes/${id}/`);
      const filme = response.data;

      setForm({
        titulo: filme.titulo || "",
        ano: filme.ano || "",
        sinopse: filme.sinopse || "",
        poster: filme.poster || "",
        diretor: filme.diretor || "",
        produtora: filme.produtora || "",
        orcamento: filme.orcamento || "",
        pais: filme.pais || "",
        linguagem: filme.linguagem || "",
      });

      setGeneros(
        String(filme.genero || "")
          .split("/")
          .map((item) => item.trim())
          .filter(Boolean)
      );

      setAtores(
        String(filme.atores || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      );
    } catch (error) {
      console.log("Erro ao buscar filme:", error.response?.data);
      setErro("Erro ao carregar dados do filme.");
    } finally {
      setCarregando(false);
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

    if (!existe) setGeneros([...generos, genero]);
    setNovoGenero("");
  }

  function adicionarAtor() {
    const ator = novoAtor.trim();
    if (!ator) return;

    const existe = atores.some(
      (item) => item.toLowerCase() === ator.toLowerCase()
    );

    if (!existe) setAtores([...atores, ator]);
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

      if (user?.tipo === "admin") {
        await api.put(`/filmes/${id}/`, payload);
        alert("Filme atualizado com sucesso!");
      } else {
        await api.post(`/filmes/${id}/solicitar-edicao/`, payload);
        alert("Solicitação de alteração enviada para aprovação!");
      }

      navigate("/catalogo");
    } catch (error) {
      console.log("Erro ao salvar:", error.response?.data);
      alert(
        error.response?.data?.detail ||
          error.response?.data?.erro ||
          "Erro ao salvar alterações."
      );
    } finally {
      setSalvando(false);
    }
  }

  const isAdmin = user?.tipo === "admin";

  return (
    <div className="editar-page">
      <Navbar />

      <main className="editar-content">
        <div className="editar-container">
          <Link to="/catalogo" className="voltar">
            <ArrowLeft size={17} />
            Voltar
          </Link>

          <div className="editar-topo">
            <div>
              <h1>Editar Filme</h1>
              <p>
                {isAdmin
                  ? "Atualize as informações do filme"
                  : "Solicite uma alteração para aprovação"}
              </p>
            </div>
          </div>

          {carregando ? (
            <p className="loading">Carregando informações...</p>
          ) : erro ? (
            <p className="loading">{erro}</p>
          ) : (
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
                  <label>Diretor</label>
                  <input name="diretor" value={form.diretor} onChange={alterarCampo} />
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

              <div className="linha">
                <div>
                  <label>Estúdio</label>
                  <input name="produtora" value={form.produtora} onChange={alterarCampo} />
                </div>

                <div>
                  <label>Orçamento</label>
                  <input name="orcamento" value={form.orcamento} onChange={alterarCampo} />
                </div>
              </div>

              <div className="linha">
                <div>
                  <label>País</label>
                  <input name="pais" value={form.pais} onChange={alterarCampo} />
                </div>

                <div>
                  <label>Idioma</label>
                  <input name="linguagem" value={form.linguagem} onChange={alterarCampo} />
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
                  {salvando
                    ? "Enviando..."
                    : isAdmin
                    ? "Salvar"
                    : "Solicitar alteração"}
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}