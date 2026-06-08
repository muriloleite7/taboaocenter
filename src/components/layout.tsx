import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar";
import styles from "../style/layout.module.css";

export default function Layout() {
  return (
    <div className={styles.containerPai}>
      <Sidebar />

      <main className={styles.conteudoPrincipal}>
        <Outlet />
      </main>
    </div>
  );
}