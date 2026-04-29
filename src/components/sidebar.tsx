import { NavLink } from "react-router-dom";
import styles from "../style/sidebar.module.css";
import { FiHome, FiUsers, FiCreditCard, FiFileText, FiSettings } from "react-icons/fi";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>
          <FiHome />
        </div>

        <div>
          <h2>Taboão Center</h2>
          <span>Imobiliária</span>
        </div>
      </div>

      <nav className={styles.menu}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <FiHome className={styles.menuIcon} />
          Home
        </NavLink>

        <NavLink
          to="/inquilinos"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <FiUsers className={styles.menuIcon} />
          Inquilinos
        </NavLink>

        <NavLink
          to="/cobrancas"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <FiCreditCard className={styles.menuIcon} />
          Cobranças
        </NavLink>

        <NavLink
          to="/contratos"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <FiFileText className={styles.menuIcon} />
          Contratos
        </NavLink>

        <NavLink
          to="/configuracoes"
          className={({ isActive }) =>
            isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
          }
        >
          <FiSettings className={styles.menuIcon} />
          Configurações
        </NavLink>
      </nav>

      <div className={styles.userArea}>
        <div className={styles.avatar}>M</div>

        <div className={styles.userInfo}>
          <strong>Murilo</strong>
          <span>Administrador</span>
        </div>
      </div>
    </aside>
  );
}