import Link from "next/link";
import styles from "./page.module.css";

const experiments = [
  {
    href: "/experiments/og",
    title: "OG image generator",
    description: "Build an /og URL from a form and preview the image.",
  },
];

export default function Page() {
  return (
    <main className={styles.main}>
      <h1>GS Playground</h1>
      <p className={styles.subtitle}>A collection of tech experiments.</p>
      <ul className={styles.list}>
        {experiments.map(({ href, title, description }) => (
          <li key={href}>
            <Link href={href} className={styles.card}>
              <h2>{title}</h2>
              <p>{description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
