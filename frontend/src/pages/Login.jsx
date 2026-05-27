import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Login.css";

import logo from "../../imagens/crepusculo_logo.png";
import fundo from "../../imagens/fundo_login.png";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("/token/", {
        username: email,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      navigate("/home");
    } catch {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-left">
        <div className="login-content">
          <div className="brand-area">
            <img src={logo} alt="Filminis" className="brand-logo" />

            <div>
              <h1>Filminis</h1>
              <p>Bem-vindo de volta.</p>
              <span>Estamos felizes em revê-lo(a)</span>
            </div>
          </div>

          <h2>Login</h2>

          <form onSubmit={handleLogin} className="login-form">
            <label>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="button" className="forgot-button">
              Esqueceu sua senha?
            </button>

            {erro && <p className="erro">{erro}</p>}

            <button type="submit" className="login-button">
              ENTRAR
            </button>

            <p className="register-text">
              Não possui uma conta? <Link to="/cadastro">Cadastrar</Link>
            </p>
          </form>
        </div>
      </section>

      <section
        className="login-right"
        style={{ backgroundImage: `url(${fundo})` }}
      />
    </main>
  );
}