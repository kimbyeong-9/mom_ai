import { useContext, useEffect } from "react";

import { PageTitleContext } from "./pageTitleCtx";

export function usePageTitle(title: string) {
  const context = useContext(PageTitleContext);
  useEffect(() => {
    context?.setTitle(title);
  }, [context, title]);
}

export function usePageTitleValue(): string {
  const context = useContext(PageTitleContext);
  return context?.title ?? "LifeFlow AI";
}
