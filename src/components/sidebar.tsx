import { NavLink } from "react-router-dom";
import styles from "../sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoArea}>
        <div className={styles.logoIcon}>⌂</div>

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
          <span>⌂</span>
          Home
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
