import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Home from "./pages/home";
import Inquilinos from "./pages/inquilinos";
import Cobrancas from "./pages/cobrancas";
import Contratos from "./pages/contratos";
import Configuracoes from "./pages/config";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inquilinos" element={<Inquilinos />} />
          <Route path="/cobrancas" element={<Cobrancas />} />
          <Route path="/contratos" element={<Contratos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
        </Routes>
      </main>
    </div>
  );
}

