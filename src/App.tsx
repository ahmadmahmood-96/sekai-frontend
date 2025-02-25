import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Home from "./pages/home";
import WarningMessage from "./components/ui/WarningMessage";
import { NotificationModal } from "./components/ui/NotificationModal";
import { Spin, message } from "antd";
const Login = lazy(() => import("./pages/login"));
const Signup = lazy(() => import("./pages/signup"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

message.config({
  duration: 2,
  maxCount: 1,
});

const App = () => {
  const logError = (error: any) => {
    console.log("data error", error.response);
    const token = localStorage.getItem("token");
    if (error.response.code === 401 || token == null || token == "null") {
      NotificationModal({
        description: "Your session is expired. Please login again",
        type: "error",
      });
      localStorage.clear();
      window.location.reload();
    } else if (error.response.code === 500 || error.response.code === 404) {
      NotificationModal({
        description:
          "An error occurred. Please report it to the system administrator",
        type: "error",
      });
    }
  };
  return (
    <>
      <ErrorBoundary fallback={<WarningMessage />} onError={logError}>
        <Suspense fallback={<Spin className="app-loading-wrapper" />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home/*" element={<Home />} />
            <Route path="/error-page" element={<ErrorPage />} />
            <Route path="/unauthorized" element={<ErrorPage />} />
            <Route path="/*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
};

export default App;
