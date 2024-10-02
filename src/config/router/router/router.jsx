import React, { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Login = lazy(() => import("../../../pages/login/login"));
const MainScreen = lazy(() => import("../../../screens/mainScreen"));

const Router = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Main Screen */}
          <Route path="/*" element={<MainScreen />} />

        </Routes>
      </BrowserRouter>
    </>
  );
};

export default Router;
