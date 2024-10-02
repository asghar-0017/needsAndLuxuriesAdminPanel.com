import React, { lazy } from "react";
import { ToastNotification } from "./components/toast/toast";

const Router = lazy(() => import("./config/router/router"));

const App = () => {
  return (
    <>
      <ToastNotification />
      <Router />
    </>
  );
};

export default App;
