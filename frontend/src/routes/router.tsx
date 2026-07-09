import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import HomePage from "@/pages/HomePage";
import PlanningPage from "@/pages/PlanningPage";
import SavedPage from "@/pages/SavedPage";
import SavedPlanDetailPage from "@/pages/SavedPlanDetailPage";
import AutomationPage from "@/pages/AutomationPage";
import MyPage from "@/pages/MyPage";
import LoginPage from "@/pages/LoginPage";
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
