import { createBrowserRouter } from "react-router-dom";

import HomePage from "@/pages/HomePage";
import PlanningPage from "@/pages/PlanningPage";
import SavedPage from "@/pages/SavedPage";
import SavedPlanDetailPage from "@/pages/SavedPlanDetailPage";
import AutomationPage from "@/pages/AutomationPage";
import LoginPage from "@/pages/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
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
    path: "/login",
    element: <LoginPage />,
  },
]);
