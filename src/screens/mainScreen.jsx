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
const EditProductPage = lazy(() => import("../pages/editProduct/editProduct"));
const OrderDetails = lazy(() => import("../pages/orderDetails/orderDetails"));
const Orders = lazy(() => import("../components/orders/orders"));

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
    <Box sx={{ display: 'flex', width: "100%" }}>
      <CssBaseline />
      <Navbar open={open} handleDrawerOpen={handleDrawerOpen}/>
      <div style={{width: "95%", margin: "0 auto"}}>
        <div>
          <Sidebar open={open} handleDrawerClose={handleDrawerClose}/>
        </div>
        <div>
          <Routes>
            {/* DashBoard Route */}
            <Route path="/" element={<Body open={open} body={<DashBoard />}/>} />

            {/* Add Products Route */}
            <Route path="/add-products" element={<Body open={open} body={<AddProducts />}/>} />

            {/* All Products Route */}
            <Route path="/all-products" element={<Body open={open} body={<AllProducts />}/>} />

            {/* Order Details Route */}
            <Route path="/order-details" element={<Body open={open} body={<OrderDetails />}/>} />

            {/* Order Route */}
            <Route path="/order/:orderId" element={<Body open={open} body={<Orders />}/>} />

             {/* Edit Products Route */}
             <Route path="/edit-product/:_id" element={<Body open={open} body={<EditProductPage />}/>} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Box>
  );
};

export default MainScreen;
