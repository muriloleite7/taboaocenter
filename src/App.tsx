import { Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";
import Home from "./pages/home";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

