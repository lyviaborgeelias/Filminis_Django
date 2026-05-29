import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Catalogo from "./pages/Catalogo";
import EditarFilme from "./pages/EditarFilme";
import DetalhesFilme from "./pages/DetalhesFilme";
import AdicionarFilme from "./pages/AdicionarFilme";
import AprovacaoFilmes from "./pages/AprovacaoFilme";
import Perfil from "./pages/Perfil";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/filme/:id" element={<DetalhesFilme />} />
        <Route path="/editar-filme/:id" element={<EditarFilme />} />
        <Route path="/adicionar" element={<AdicionarFilme />} />
        <Route path="/aprovacao" element={<AprovacaoFilmes />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </BrowserRouter>
  );
}