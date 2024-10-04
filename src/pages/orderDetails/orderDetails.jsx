import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardContent,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { AccessTime, Pending, CheckCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchData, updateData } from "../../config/apiServices/apiServices";
import Loader from "../../components/loader/loader";
import { showSuccessToast } from "../../components/toast/toast";
import CancelIcon from "@mui/icons-material/Cancel";
import { ContentCopy } from "@mui/icons-material";

const OrderDetailsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("All");
  const [tooltipText, setTooltipText] = useState("Copy order ID");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);
      try {
        const response = await fetchData("billing-details");
        if (!response || !response.result) {
          throw new Error("No data found");
        }
        setProducts(response.result);
        console.log(response.result);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  const totalOrders = products.length;
  const pendingOrders = products.filter(
    (order) => order.orderStatus === "Pending"
  ).length;
  const dispatchedOrders = products.filter(
    (order) => order.orderStatus === "Dispatched"
  ).length;
  const cancelledOrders = products.filter(
    (order) => order.orderStatus === "Cancelled"
  ).length;

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const filteredProducts = products.filter((product) => {
    const statusMatch = status === "All" || product.orderStatus === status;
    return statusMatch;
  });

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const orderToUpdate = products.find((order) => order._id === orderId);
      if (orderToUpdate) {
        const updatedOrder = { ...orderToUpdate, newStatus: newStatus };

        let response = await updateData(
          `billing-status/${updatedOrder._id}`,
          updatedOrder
        );
        console.log(response);

        if (response) {
          setProducts((prevProducts) =>
            prevProducts.map((order) =>
              order._id === updatedOrder._id
                ? { ...order, orderStatus: newStatus }
                : order
            )
          );
          showSuccessToast(`Product ${newStatus.toLowerCase()} successfully.`);
        }
      }
    } catch (error) {
      console.error(`Error updating product status to ${newStatus}:`, error);
    }
  };

  const copyToClipboard = (orderId) => {
    navigator.clipboard.writeText(orderId)
      .then(() => {
        setTooltipText("Copied!");
        setTimeout(() => {
          setTooltipText("Copy order ID");
        }, 2000);
      })
      .catch((error) => {
        console.error("Failed to copy: ", error);
      });
  };

  return (
    <>
      {loading && <Loader open={loading} />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          <Container maxWidth="lg">
            <Box
              sx={{
                my: 2,
                textAlign: "center",
                bgcolor: "#fff3cd",
                p: 1,
                borderRadius: 2,
              }}
            >
              <Typography variant="body1" color="textSecondary">
                You have {pendingOrders} pending orders
              </Typography>
            </Box>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CardContent>
                    <AccessTime sx={{ fontSize: 40, color: "#3f51b5" }} />
                    <Typography variant="h6">Total Orders</Typography>
                    <Typography variant="h4">{totalOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CardContent>
                    <Pending sx={{ fontSize: 40, color: "yellow" }} />
                    <Typography variant="h6">Pending Orders</Typography>
                    <Typography variant="h4">{pendingOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CardContent>
                    <CheckCircle sx={{ fontSize: 40, color: "#4caf50" }} />
                    <Typography variant="h6">Dispatched Orders</Typography>
                    <Typography variant="h4">{dispatchedOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card sx={{ textAlign: "center", p: 2 }}>
                  <CardContent>
                    <CancelIcon sx={{ fontSize: 40, color: "red" }} />
                    <Typography variant="h6">Cancelled Orders</Typography>
                    <Typography variant="h4">{cancelledOrders}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <FormControl sx={{ minWidth: 250 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Dispatched">Dispatched</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography
                          onClick={() => navigate(`/order/${order.orderId}`)}
                          sx={{
                            cursor: "pointer",
                            color: "#3f51b5",
                            textDecoration: "underline",
                            marginRight: 1,
                          }}
                        >
                          {order.orderId}
                        </Typography>
                        
                        <Tooltip
                          title={
                            <Typography
                              sx={{
                                fontSize: "10px"
                              }}
                            >
                              {tooltipText}
                            </Typography>
                          }
                        >
                          <ContentCopy
                            onClick={() => copyToClipboard(order.orderId)}
                            sx={{ cursor: "pointer", color: "#3f51b5", fontSize: "20px" }}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>

                      <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                      <TableCell>{`${order.address}, ${order.apartment}, ${order.postCode}`}</TableCell>
                      <TableCell>{order.orderStatus}</TableCell>
                      <TableCell>
                        <Box
                          display="flex"
                          flexDirection="row"
                          flexWrap="nowrap"
                        >
                          <Button
                            style={{ marginRight: "10px" }}
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleOrderStatusChange(order._id, "Dispatched")
                            }
                          >
                            Dispatch
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() =>
                              handleOrderStatusChange(order._id, "Cancelled")
                            }
                          >
                            Cancel
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;
