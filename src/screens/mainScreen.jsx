import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';

const Navbar = lazy(() => import("../components/navbar/navbar"));
const Sidebar = lazy(() => import("../components/sidebar/sidebar"));
const DashBoard = lazy(() => import("../pages/dashBoard/dashboard"));
const NotFound = lazy(() => import("../components/notFound/notFound"));

import "../assets/styles/mainScreen.css";
import { Box } from "@mui/material";
import Body from "../components/main/main";

const MainScreen = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen}/>
      <div className="main-cont">
        <div className="left">
          <Sidebar open={open} handleDrawerClose={handleDrawerClose}/>
        </div>
        <div className="right">
          <Routes>
            {/* DashBoard Route */}
            <Route path="/" element={<Body open={open} body={<DashBoard />}/>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Box>
  );
};

export default MainScreen;
