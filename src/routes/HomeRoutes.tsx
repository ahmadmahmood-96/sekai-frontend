import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import PageNotFound from "../pages/PageNotFound";
import ProtectedRoute from "./ProtectedRoute"; // Import the ProtectedRoute component
import ErrorPage from "../pages/ErrorPage";
import { Suspense } from "react";
import { Spin } from "antd";
import { getUserFromLocalStorage } from "../utils/getUser";
import AddUsers from "../pages/users/AddUsers";
import CompaniesList from "../pages/companies";

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
        <Route
          path="/users/:id"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddUsers />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/companies"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <CompaniesList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route path="/unauthorized" element={<ErrorPage />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </>
  );
};

export default HomeRoutes;
