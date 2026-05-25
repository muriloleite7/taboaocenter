import { useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "../style/sidebar.module.css";
import {
  FiHome,
  FiUsers,
  FiCreditCard,
  FiFileText,
  FiSettings,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../auth/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const fecharSidebar = () => {
    setSidebarAberta(false);
  };

  const abrirSidebar = () => {
    setSidebarAberta(true);
  };

  return (
    <>
      <button
        type="button"
        className={styles.mobileMenuButton}
        onClick={abrirSidebar}
        aria-label="Abrir menu"
      >
        <FiMenu />
      </button>

      {sidebarAberta && (
        <div className={styles.overlay} onClick={fecharSidebar}></div>
      )}

      <aside
        className={
          sidebarAberta
            ? `${styles.sidebar} ${styles.sidebarAberta}`
            : styles.sidebar
        }
      >
        <div className={styles.mobileSidebarHeader}>
          <span>Menu</span>

          <button
            type="button"
            className={styles.closeButton}
            onClick={fecharSidebar}
            aria-label="Fechar menu"
          >
            <FiX />
          </button>
        </div>

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
            onClick={fecharSidebar}
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <FiHome className={styles.menuIcon} />
            Home
          </NavLink>

          <NavLink
            to="/inquilinos"
            onClick={fecharSidebar}
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <FiUsers className={styles.menuIcon} />
            Inquilinos
          </NavLink>

          <NavLink
            to="/cobrancas"
            onClick={fecharSidebar}
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <FiCreditCard className={styles.menuIcon} />
            Cobranças
          </NavLink>

          <NavLink
            to="/contratos"
            onClick={fecharSidebar}
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <FiFileText className={styles.menuIcon} />
            Contratos
          </NavLink>

          <NavLink
            to="/configuracoes"
            onClick={fecharSidebar}
            className={({ isActive }) =>
              isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem
            }
          >
            <FiSettings className={styles.menuIcon} />
            Configurações
          </NavLink>
        </nav>

        <div className={styles.userArea}>
          <div className={styles.avatarUser}>M</div>

          <div className={styles.userInfo}>
            <strong>Murilo</strong>
            <span>Administrador</span>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={logout}
            title="Sair"
          >
            <FiLogOut />
          </button>
        </div>
      </aside>
    </>
  );
}