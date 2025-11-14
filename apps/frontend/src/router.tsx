import { createBrowserRouter } from "react-router-dom"
import  HomePage  from "./pages/HomePage"
import { PreparationPage } from "./pages/PreparationPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/prepration/content/:documentId",
    element: <PreparationPage />,
  },
])