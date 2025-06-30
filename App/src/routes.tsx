import { createBrowserRouter } from "react-router";
import { lazy } from "react";
// Lazy load pages for better performance
import App from "@/App.tsx";
const Dashboard = lazy(() => import("@/pages/dashboard"));
const JobDetail = lazy(() => import("@/pages/jobDetail"));
const CreateJob = lazy(() => import("@/pages/createJob"));
const NotFound = lazy(() => import("@/pages/notFound"));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "/jobs/:id",
        element: <JobDetail />,
      },
      {
        path: "/create",
        element: <CreateJob />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
