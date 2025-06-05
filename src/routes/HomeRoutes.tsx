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
import CarDetails from "../pages/companies/sekaiCars";
import InsuranceCompaniesList from "../pages/insurance/companies/companiesList";
import AddInsuranceCompany from "../pages/insurance/companies/addCompany";
import AddAgent from "../pages/insurance/agents/addAgent";
import AgentsList from "../pages/insurance/agents/agentsList";
import UsersList from "../pages/users/usersList";
import AddCar from "../pages/cars/addCar";
import CarsList from "../pages/cars/carsList";

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
          path="/users"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <UsersList />
              </ProtectedRoute>
            </Suspense>
          }
        />
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
          path="/cars"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <CarsList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/cars/:id"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddCar />
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
        <Route
          path="/companies/car-sales"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <CarDetails />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/insurance-company"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <InsuranceCompaniesList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/insurance-company/:id"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddInsuranceCompany />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/insurance-agent"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AgentsList />
              </ProtectedRoute>
            </Suspense>
          }
        />
        <Route
          path="/insurance-agent/:id"
          element={
            <Suspense fallback={<Spin className="app-loading-wrapper" />}>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AddAgent />
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
