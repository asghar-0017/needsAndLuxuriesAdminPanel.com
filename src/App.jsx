import React, { lazy } from 'react'

const Router = lazy(() => import("./config/router/router/router"));

const App = () => {
  return (
    <>
      <Router />
    </>
  )
}

export default App
