import { ProtectedRoute } from "@/features/protectedRoute/ProtectedRoute"
import LayoutIndex from "@/layouts"
import AddLOT from "@/views/addLOT"
import AddPatients from "@/views/addPatients"
import Analytics from "@/views/analytics"
import Login from "@/views/login"
import Patients from "@/views/patients"
import Settings from "@/views/settings"
import UpdateLOT from "@/views/updateLOT"
import UpdatePatients from "@/views/updatePatients"
import Users from "@/views/users"
import { RouteObject, useRoutes } from "react-router-dom"

export const routesConfig: RouteObject[] = [
  {
    path: "/",
    element: <LayoutIndex />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/patients",
    element: <LayoutIndex />,
    children: [
      {
        path: "/patients/",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Patients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/add-patient",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddPatients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/:id/add-lot",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <AddLOT />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/:id/update-patient",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UpdatePatients />
          </ProtectedRoute>
        ),
      },
      {
        path: "/patients/:id/update-lot/:lotId",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <UpdateLOT />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/analytics",
    element: <LayoutIndex />,
    children: [
      {
        path: "/analytics/",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Analytics />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/users",
    element: <LayoutIndex />,
    children: [
      {
        path: "/users/",
        element: (
          <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/settings",
    element: <LayoutIndex />,
    children: [
      {
        path: "/settings/",
        element: <Settings />,
      },
    ],
  },
  {
    path: "*",
    element: <LayoutIndex />,
    children: [
      {
        path: "*",
        element: <div>404</div>,
      },
    ],
  },
]

const Router = () => {
  const router = useRoutes(routesConfig)

  return router
}

export default Router
