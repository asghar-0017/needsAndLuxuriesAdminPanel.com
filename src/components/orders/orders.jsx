import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Divider,
  CardMedia,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { fetchData } from "../../config/apiServices/apiServices";
import Loader from "../loader/loader";
import Back from "../button/back";
import COD from "../../assets/images/cod.jpg"

const getStatusColor = (status) => {
  switch (status) {
    case "Pending":
      return { color: "#FFC107", text: "Pending" };
    case "Dispatched":
      return { color: "#4CAF50", text: "Dispatched" };
    case "Cancelled":
      return { color: "#F44336", text: "Cancelled" };
    default:
      return { color: "#000", text: status };
  }
};

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const response = await fetchData(`get-order-by-orderId/${orderId}`);
        setOrderDetails(response.order);
        console.log(response.order);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const calculateTotalPrice = () => {
    if (!orderDetails) return 0;
    return orderDetails.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  };

  const totalPrice = calculateTotalPrice();

  return (
    <>
      {loading && <Loader open={loading} />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && orderDetails && (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            <Box display="flex" alignItems="center">
              <Back />
              <Typography variant="h4" sx={{ ml: 1 }}>
                Order Details
              </Typography>
            </Box>
          </Typography>

          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={3}>
            <Grid container spacing={3}>
              {/* First column: Order Details */}
              <Grid item xs={12} sm={8} md={8}>
                <Grid container spacing={2}>
                  {orderDetails.orderId && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Order ID</Typography>
                      <Typography variant="body1">
                        {orderDetails.orderId}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.orderDate && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Order Date</Typography>
                      <Typography variant="body1">
                        {new Date(orderDetails.orderDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.firstName && orderDetails.lastName && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Customer Name</Typography>
                      <Typography variant="body1">
                        {`${orderDetails.firstName} ${orderDetails.lastName}`}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.email && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Email</Typography>
                      <Typography variant="body1">
                        {orderDetails.email}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.phone && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Phone</Typography>
                      <Typography variant="body1">
                        {orderDetails.phone}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.orderStatus && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Status</Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: getStatusColor(orderDetails.orderStatus).color,
                          fontWeight: "bold",
                        }}
                      >
                        {getStatusColor(orderDetails.orderStatus).text}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.address && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Address</Typography>
                      <Typography variant="body1">
                        {orderDetails.address}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.apartment && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Apartment</Typography>
                      <Typography variant="body1">
                        {orderDetails.apartment}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.postCode && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">Post Code</Typography>
                      <Typography variant="body1">
                        {orderDetails.postCode}
                      </Typography>
                    </Grid>
                  )}
                  {orderDetails.additionalInformation && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6">
                        Additional Information
                      </Typography>
                      <Typography variant="body1">
                        {orderDetails.additionalInformation}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {orderDetails.cashOnDelivery == true && (
                <Grid item sm={4} md={4}>
                  <Typography variant="h6">Payment Method</Typography>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={COD}
                    alt="COD"
                    sx={{ objectFit: "cover", borderRadius: 1 }}
                  />
                </Grid>
              )}
              {orderDetails.cashOnDelivery == false && (
                <Grid item xs={12} sm={4} md={4}>
                  <Typography marginBottom={"10px"} variant="h6">
                    Payment Proof
                  </Typography>
                  <CardMedia
                    component="img"
                    height="auto"
                    image={orderDetails?.image}
                    alt="Order Image"
                    sx={{ objectFit: "cover", borderRadius: 1 }}
                  />
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Products:</Typography>
            {orderDetails.products.map((product) => (
             <Box
             key={product.productId}
             display="flex"
             alignItems="flex-start"
             sx={{
               mb: 2,
               padding: 2,
             }}
           >
             <Avatar
               src={product.Imageurl}
               alt="Product"
               sx={{ width: 64, height: 64, mr: 2 }}
             />
             <Box>
               <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                {`Product Name: ${product.title}`}
               </Typography>
               <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                 {`Product ID: ${product.productId}`}
               </Typography>
               <Typography variant="body2" sx={{ mb: 0.5 }}>
                 {`Quantity: ${product.quantity}`}
               </Typography>
               <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                 {`Price: Rs ${product.price.toFixed(2)}`}
               </Typography>
             </Box>
           </Box>
           
            ))}

            <Box display="flex" justifyContent="flex-end" sx={{ mt: 3, mr: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {`Total Price: Rs ${totalPrice.toFixed(2)}`}
              </Typography>
            </Box>
          </Paper>
        </Container>
      )}
    </>
  );
};

export default OrderDetailPage;
