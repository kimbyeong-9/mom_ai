import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";
import PlanningPage from "@/pages/PlanningPage";
import SavedPage from "@/pages/SavedPage";
import SavedPlanDetailPage from "@/pages/SavedPlanDetailPage";
import AutomationPage from "@/pages/AutomationPage";
import MyPage from "@/pages/MyPage";
import LoginPage from "@/pages/LoginPage";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth-callback",
    element: <OAuthCallbackPage />,
  },
  {
    element: <AppLayout />,
    children: [
      // Planning Loop has no login gate by design — the goal is to let
      // users get to an AI result before asking anything of them. Only the
      // Save action (and everything past it) requires auth.
      {
        path: "/planning",
        element: <PlanningPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/saved",
            element: <SavedPage />,
          },
          {
            path: "/saved/:id",
            element: <SavedPlanDetailPage />,
          },
          {
            path: "/automation",
            element: <AutomationPage />,
          },
          {
            path: "/mypage",
            element: <MyPage />,
          },
        ],
      },
    ],
  },
]);
