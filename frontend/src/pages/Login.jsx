import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import "../styles/Login.css";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    const email = form.email.trim().toLowerCase();

    if (!email || !form.password) {
      setErro("Preencha e-mail e senha.");
      return;
    }

    setCarregando(true);

    try {
      localStorage.clear();

      const response = await api.post("/login/", {
        email,
        password: form.password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;
      const usuario = response.data.user;

      if (!accessToken) {
        setErro("Token não recebido do backend.");
        return;
      }

      saveAuth(accessToken, refreshToken, usuario);

      if (onLogin) {
        onLogin();
      }

      navigate("/home", { replace: true });
    } catch (error) {
      console.log("Erro no login:", error.response?.data);

      setErro(
        error.response?.data?.erro ||
          error.response?.data?.detail ||
          "E-mail ou senha inválidos."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-area">
          <img src="/imagens/mascote.png" alt="mascote" className="mascote" />

          <div>
            <h1>Filminis</h1>
            <p>Bem-vindo de volta.</p>
            <span>Estamos felizes em revê-lo(a)</span>
          </div>
        </div>

        <div className="login-content">
          <h2>Login</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>E-mail</label>
              <input
                type="email"
                name="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="input-group">
              <label>Senha</label>
              <input
                type="password"
                name="password"
                placeholder="Digite sua senha"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
                required
              />
            </div>

            <p className="forgot">Esqueceu sua senha?</p>

            {erro && <span className="erro">{erro}</span>}

            <button type="submit" disabled={carregando}>
              {carregando ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </form>

          <p className="register">
            Não possui uma conta?{" "}
            <span onClick={() => navigate("/cadastro")}>Cadastrar</span>
          </p>
        </div>
      </div>

      <div className="login-right">
        <img src="/imagens/fundo_login.png" alt="filmes" />
      </div>
    </div>
  );
}