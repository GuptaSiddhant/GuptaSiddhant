"use client";

import { useState } from "react";
import styles from "./OGForm.module.css";

const FIELDS = [
  { name: "title", label: "Title", required: true },
  { name: "subtitle", label: "Subtitle", required: false },
  { name: "caption", label: "Caption", required: false },
  { name: "authorName", label: "Author name", required: false },
  {
    name: "imageUrl",
    label: "Image URL (https, allowlisted hosts)",
    required: false,
  },
  { name: "authorImageUrl", label: "Author image URL", required: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

export default function OGForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    title: "Hello, playground",
    subtitle: "",
    caption: "",
    authorName: "",
    imageUrl: "",
    authorImageUrl: "",
  });

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value.trim()) params.set(key, value.trim());
  }
  const path = `/og?${params.toString()}`;

  return (
    <div>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        {FIELDS.map(({ name, label, required }) => (
          <label key={name} className={styles.field}>
            <span>{label}</span>
            <input
              name={name}
              value={values[name]}
              required={required}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [name]: e.target.value }))
              }
            />
          </label>
        ))}
      </form>
      <p>
        <code className={styles.url}>{path}</code>
      </p>
      {values.title.trim() ? (
        <img
          className={styles.preview}
          src={path}
          alt="Generated social card"
        />
      ) : (
        <p>Enter a title to preview.</p>
      )}
    </div>
  );
}
