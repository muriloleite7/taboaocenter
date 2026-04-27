import styles from "../style/cards.module.css";

type CardProps = {
  title: string;
  value: string | number;
  description: string;
};

export default function Card({ title, value, description }: CardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      <h2 className={styles.cardValue}>{value}</h2>
      <span className={styles.cardDescription}>{description}</span>
    </div>
  );
}