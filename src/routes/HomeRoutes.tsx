import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import ErrorPage from "../pages/ErrorPage";
import { Suspense } from "react";
import { Spin } from "antd";
import { getUserFromLocalStorage } from "../utils/getUser";

const HomeRoutes = () => {
  const user = getUserFromLocalStorage();
  return (
    <>
      <Routes>
        {user?.role === "admin" && (
          <Route
            index
            element={
              <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                <ProtectedRoute allowedRoles={["admin"]}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
        )}
        {user?.role === "agent" && (
          <Route
            index
            element={
              <Suspense fallback={<Spin className="app-loading-wrapper" />}>
                <ProtectedRoute allowedRoles={["agent"]}>
                  <Dashboard />
                </ProtectedRoute>
              </Suspense>
            }
          />
        )}
        <Route path="/unauthorized" element={<ErrorPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;
