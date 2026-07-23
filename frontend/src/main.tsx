import React from "react";
import ReactDOM from "react-dom/client";

import { RouterProvider } from "react-router-dom";

import { QueryClientProvider } from "@tanstack/react-query";

import { router } from "@/routes/router";
import { queryClient } from "@/lib/queryClient";
import DecorativeBackground from "@/components/DecorativeBackground";
import { Toast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/auth.store";

import "./index.css";

useAuthStore.subscribe((state, prevState) => {
  if (prevState.isAuthenticated && !state.isAuthenticated) {
    queryClient.clear();
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DecorativeBackground />
      <RouterProvider router={router} />
      <Toast />
    </QueryClientProvider>
  </React.StrictMode>
);
