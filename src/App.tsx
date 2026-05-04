import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import Inquilinos from "./pages/inquilinos";
import Cobrancas from "./pages/cobrancas";
import Contratos from "./pages/contratos";
import Configuracoes from "./pages/config";

import "./App.css";
import NovoInquilino from "./pages/novoInquilino";
import LancarDespesas from "./pages/lancarDespesas";
import DetalheInquilino from "./pages/detalheInquilino";
import EditarInquilino from "./pages/editarInquilino";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro";
import Layout from "./components/layout";
import EditarCobranca from "./pages/editarCobranca";


export default function App() {
  return (
    
      <Routes>
        {/* - ROTAS PÚBLICAS (Sem Sidebar) - */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* - ROTAS PRIVADAS (Com Sidebar) - */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/inquilinos" element={<Inquilinos />} />
          <Route path="/inquilinos/:id" element={<DetalheInquilino />} />
          <Route path="/inquilinos/:id/editar" element={<EditarInquilino />} />
          <Route path="/cobrancas" element={<Cobrancas />} />
          <Route path="/cobrancas/:id/editar" element={<EditarCobranca />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/novo-inquilino" element={<NovoInquilino />} />
          <Route path="/lancar-despesas" element={<LancarDespesas />} /> 
        </Route>
      </Routes>
    
  );
}
          
          
       

