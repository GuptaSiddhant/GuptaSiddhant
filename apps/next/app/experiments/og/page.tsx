import type { Metadata } from "next";
import Link from "next/link";
import OGForm from "./OGForm";
import styles from "../../page.module.css";

export const metadata: Metadata = {
  title: "OG image generator",
  description: "Build an /og URL from a form and preview the image.",
};

export default function Page() {
  return (
    <main className={styles.main}>
      <p>
        <Link href="/">&larr; Playground</Link>
      </p>
      <h1>OG image generator</h1>
      <OGForm />
    </main>
  );
}
