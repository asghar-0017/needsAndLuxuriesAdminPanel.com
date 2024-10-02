import React, { lazy, Suspense, useState } from "react";
import { ToastNotification } from "./components/toast/toast";
import Loader from "./components/loader/loader";

const Router = lazy(() => import("./config/router/router"));

const App = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Suspense fallback={<Loader open={loading} />}>
        <ToastNotification />
        <Router />
      </Suspense>
    </>
  );
};

export default App;
