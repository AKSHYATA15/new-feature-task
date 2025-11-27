import { createBrowserRouter } from "react-router-dom"
import  HomePage  from "./pages/HomePage"
import { PreparationPage } from "./pages/PreparationPage"
import {DummyAppLayout} from "@/components/fixes/DummyAppLayout.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
    {
        path: "/prepration/content",
        element: <DummyAppLayout />,
    },
  {
    path: "/prepration/content/:documentId",
    element: <PreparationPage />,
  },
])