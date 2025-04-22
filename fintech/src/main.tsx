import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {RegistrationPage, SignInPage, PricingPage, DashboardPage} from "./routes/pages.tsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import ProtectedRoute from './components/ProtectedRoute.tsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: SignInPage,
      },
      {
        path: "/registration",
        element: RegistrationPage,
      },
      {
        path: "/pricing",
        element: PricingPage
      },
      {
        path: "/dashboard",
        element: DashboardPage // add the protected route back
      }
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>
);
