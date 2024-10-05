import React, { lazy } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

const Login = lazy(() =>
  import("../../pages/login/login")
);
const Protected = lazy(() =>
  import("../../components/protected/protected")
);
const MainScreen = lazy(() =>
  import("../../screens/mainScreen")
);

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login page */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* Main Screen */}
          <Route
            path="/*"
            element={
              <Protected
                Component={MainScreen}
                allowedRoles={["admin"]}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
