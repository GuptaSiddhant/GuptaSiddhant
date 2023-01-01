import { createContext, useContext } from "react";

interface EditorFormContextValue {
  itemId: string;
  newItem: boolean;
  prefix?: string;
}

const EditorFormContext = createContext<EditorFormContextValue>({
  itemId: "new",
  newItem: true,
});

export function useEditorForm(): EditorFormContextValue & {
  addPrefix: (name: string) => string;
} {
  const context = useContext(EditorFormContext);

  const addPrefix = (name: string) =>
    [context.prefix, name].filter(Boolean).join(".");

  return { ...context, addPrefix };
}

export function EditorFormContextProvider({
  children,
  ...value
}: EditorFormContextValue & {
  children: React.ReactNode;
}) {
  const parentValue = useEditorForm();
  const prefix = [parentValue.prefix, value.prefix].filter(Boolean).join(".");

  return (
    <EditorFormContext.Provider value={{ ...parentValue, ...value, prefix }}>
      {children}
    </EditorFormContext.Provider>
  );
}
