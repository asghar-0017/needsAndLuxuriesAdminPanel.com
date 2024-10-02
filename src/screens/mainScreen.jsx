import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import CssBaseline from '@mui/material/CssBaseline';
import { Box } from "@mui/material";

const Navbar = lazy(() => import("../components/navbar/navbar"));
const Sidebar = lazy(() => import("../components/sidebar/sidebar"));
const DashBoard = lazy(() => import("../pages/dashBoard/dashboard"));
const NotFound = lazy(() => import("../components/notFound/notFound"));
const AddProducts = lazy(() => import("../pages/addProducts/addProducts"));
const Body = lazy(() => import("../components/main/main"));
const AllProducts = lazy(() => import("../pages/allProducts/allProducts"));


import "../assets/styles/mainScreen.css";

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

            {/* Add Products Route */}
            <Route path="/add-products" element={<Body open={open} body={<AddProducts />}/>} />

            {/* All Products Route */}
            <Route path="/all-products" element={<Body open={open} body={<AllProducts />}/>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Box>
  );
};

export default MainScreen;
