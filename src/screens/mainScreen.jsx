import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Navbar = lazy(() => import("../components/navbar/navbar"));
const Sidebar = lazy(() => import("../components/sidebar/sidebar"));
const DashBoard = lazy(() => import("../pages/dashBoard/dashboard"));
const NotFound = lazy(() => import("../components/notFound/notFound"));

import "../assets/styles/mainScreen.css";

const MainScreen = () => {
  return (
    <>
      <Navbar />
      <div className="main-cont">
        <div className="left">
          <Sidebar />
        </div>
        <div className="right">
          <Routes>
            {/* DashBoard Route */}
            <Route path="/" element={<DashBoard />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default MainScreen;
