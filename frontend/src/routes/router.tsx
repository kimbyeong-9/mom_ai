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
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/planning",
            element: <PlanningPage />,
          },
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
