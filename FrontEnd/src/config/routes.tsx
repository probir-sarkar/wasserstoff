import type { RouteObject } from "react-router-dom";
import App from "@/App";
import ProjectDetails from "@/routes/ProjectDetails";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/:id",
    element: <ProjectDetails />,
  },
];
