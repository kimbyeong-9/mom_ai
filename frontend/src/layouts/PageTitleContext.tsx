import { useState, type ReactNode } from "react";

import { PageTitleContext } from "./pageTitleCtx";

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState("LifeFlow AI");
  return (
    <PageTitleContext.Provider value={{ title, setTitle }}>{children}</PageTitleContext.Provider>
  );
}
