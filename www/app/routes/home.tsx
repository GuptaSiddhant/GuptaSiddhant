import { DatabaseSync } from "node:sqlite";
import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { cwd } from "node:process";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  console.log("CWD", cwd());
  const database = new DatabaseSync("./data/db.sqlite");

  try {
    database.exec(`
        CREATE TABLE IF NOT EXISTS data(
          key INTEGER PRIMARY KEY,
          value TEXT
          ) STRICT
          `);

    const insert = database.prepare(
      "INSERT INTO data (key, value) VALUES (?, ?)"
    );
    insert.run(Date.now(), new Date().toLocaleString());
  } catch (e) {
    console.error("Error", e);
  }

  const query = database.prepare("SELECT * FROM data ORDER BY key");
  const results = query.all();
  return results;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <Welcome />
      <pre>{JSON.stringify(loaderData, null, 2)}</pre>
    </>
  );
}
