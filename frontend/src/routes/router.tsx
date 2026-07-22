import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";
import PlanningPage from "@/pages/PlanningPage";
import StartPage from "@/pages/StartPage";
import SavedPage from "@/pages/SavedPage";
import SavedPlanDetailPage from "@/pages/SavedPlanDetailPage";
import AutomationPage from "@/pages/AutomationPage";
import MetricsPage from "@/pages/MetricsPage";
import MyPage from "@/pages/MyPage";
import LoginPage from "@/pages/LoginPage";
import OAuthCallbackPage from "@/pages/OAuthCallbackPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/oauth-callback",
    element: <OAuthCallbackPage />,
  },
  // Goal Input wizard lives outside AppLayout on purpose — it's the entry
  // flow from the homepage CTAs, not a page reached via the sidebar nav.
  // Planning Loop has no login gate by design — the goal is to let users
  // get to an AI result before asking anything of them. Only the Save
  // action (and everything past it) requires auth.
  {
    path: "/start",
    element: <StartPage />,
  },
  // Homepage is a standalone landing page (own header/footer, no sidebar) —
  // same reasoning as /start above, it's the entry point, not an in-app page.
  {
    path: "/",
    element: <HomePage />,
  },
  {
    element: <AppLayout />,
    children: [
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
          // Founder-only Loop metrics dashboard — not in NAV_ITEMS on
          // purpose (backend gates it to ADMIN_EMAIL anyway), reached by
          // direct URL only.
          {
            path: "/metrics",
            element: <MetricsPage />,
          },
        ],
      },
    ],
  },
]);
