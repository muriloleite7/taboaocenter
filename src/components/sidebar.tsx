import { NavLink } from "react-router-dom";
import styles from "../sidebar.module.css";

export default function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>⌂</div>
        {/* <svg preserveAspectRatio="xMidYMid meet" data-bbox="7.767 51.693 183.51 85.375" viewBox="7.767 51.693 183.51 85.375" height="200" width="200" xmlns="http://www.w3.org/2000/svg" data-type="color" role="img" aria-label="Página inicial">…</svg> */}

        <div>
          <h2>Taboão Center</h2>
          <span>Imobiliária</span>
        </div>
      </div>

      <div className={styles.menu}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <span>⌂</span>
          Home
        </NavLink>
      </div>

      <div className={styles.menu}>
        <NavLink
          to="/inquilinos"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <span>⌂</span>
          Inquilinos
        </NavLink>
      </div>

      <div className={styles.menu}>
        <NavLink
          to="/cobrancas"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <span>⌂</span>
          Cobranças
        </NavLink>
      </div>

      <div className={styles.menu}>
        <NavLink
          to="/contratos"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <span>⌂</span>
          Contratos
        </NavLink>
      </div>

      <div className={styles.menu}>
        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <span>⌂</span>
          Configurações
        </NavLink>
      </div>

      <div className={styles.userArea}>
        <div className={styles.avatarUser}>M</div>

        <div className={styles.userInfo}>
          <strong>Murilo</strong>
          <span>Administrador</span>
        </div>
      </div>
    </div>
  );
}
