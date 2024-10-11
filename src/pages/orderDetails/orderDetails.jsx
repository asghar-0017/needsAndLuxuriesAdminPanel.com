import React, { useContext, useEffect, useState } from "react";
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
import { AccessTime, CheckCircle, Cancel } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchData, updateData } from "../../config/apiServices/apiServices";
import Loader from "../../components/loader/loader";
import { showSuccessToast } from "../../components/toast/toast";
import Swal from "sweetalert2";
import { ContentCopy } from "@mui/icons-material";
import { SearchContext } from "../../context/context";
import DatePickerComp from "../../components/datePicker/datePicker";

const OrderDetailsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("All");
  const [filteredData, setFilteredData] = useState([]);
  const [tooltipText, setTooltipText] = useState("Copy order ID");
  const [disabledButtons, setDisabledButtons] = useState({});

  const navigate = useNavigate();
  const { searchQuery, selectedDate } = useContext(SearchContext);

  useEffect(() => {
    const fetchDataFromApi = async () => {
      setLoading(true);
      try {
        const response = await fetchData("billing-details");
        if (!response || !response.result) {
          throw new Error("No data found");
        }

        console.log(response);

        const initialDisabledButtons = response.result.reduce((acc, order) => {
          acc[order._id] = {
            Dispatched: order.orderStatus === "Dispatched",
            Cancelled: order.orderStatus === "Cancelled",
          };
          return acc;
        }, {});

        setDisabledButtons(initialDisabledButtons);
        setProducts(response.result);
        setFilteredData(response.result);
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

  useEffect(() => {
    if (products.length === 0) {
      setFilteredData([]);
      return;
    }

    const filteredProducts = products.filter((product) => {
      const statusMatch = status === "All" || product.orderStatus === status;

      const orderIdMatch =
        searchQuery === "" || product.orderId.toString().includes(searchQuery);

      let dateMatch = true;
      if (selectedDate) {
        const selectedDateString = new Date(
          selectedDate.$d
        ).toLocaleDateString();
        const productDateString = new Date(
          product.orderDate
        ).toLocaleDateString();
        dateMatch = selectedDateString === productDateString;
      }

      return statusMatch && orderIdMatch && dateMatch;
    });

    setFilteredData(filteredProducts);
    console.log(filteredProducts);
  }, [status, searchQuery, selectedDate, products]);

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${newStatus} successfully!`,
      cancelButtonText: "Back",
    });

    if (result.isConfirmed) {
      try {
        const orderToUpdate = products.find((order) => order._id === orderId);
        if (orderToUpdate) {
          const updatedOrder = {
            ...orderToUpdate,
            newStatus: newStatus,
          };

          setDisabledButtons((prev) => ({
            ...prev,
            [orderId]: {
              ...prev[orderId],
              [newStatus]: true,
            },
          }));

          let response = await updateData(
            `billing-status/${updatedOrder._id}`,
            updatedOrder
          );

          if (response) {
            setProducts((prevProducts) =>
              prevProducts.map((order) =>
                order._id === updatedOrder._id
                  ? {
                      ...order,
                      orderStatus: newStatus,
                    }
                  : order
              )
            );
            showSuccessToast(
              `Product ${newStatus.toLowerCase()} successfully.`
            );

            setDisabledButtons((prev) => ({
              ...prev,
              [orderId]: {
                Dispatched: newStatus === "Dispatched",
                Cancelled: newStatus === "Cancelled",
              },
            }));
          }
        }
      } catch (error) {
        console.error(`Error updating product status to ${newStatus}:`, error);
      }
    }
  };

  const copyToClipboard = (orderId) => {
    navigator.clipboard
      .writeText(orderId)
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
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <AccessTime
                    sx={{
                      fontSize: 40,
                      color: "#3f51b5",
                    }}
                  />
                  <Typography variant="h6">Total Orders</Typography>
                  <Typography variant="h4">{totalOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <AccessTime
                    sx={{
                      fontSize: 40,
                      color: "yellow",
                    }}
                  />
                  <Typography variant="h6">Pending Orders</Typography>
                  <Typography variant="h4">{pendingOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <CheckCircle
                    sx={{
                      fontSize: 40,
                      color: "#4caf50",
                    }}
                  />
                  <Typography variant="h6">Dispatched Orders</Typography>
                  <Typography variant="h4">{dispatchedOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  textAlign: "center",
                  p: 2,
                }}
              >
                <CardContent>
                  <Cancel
                    sx={{
                      fontSize: 40,
                      color: "red",
                    }}
                  />
                  <Typography variant="h6">Cancelled Orders</Typography>
                  <Typography variant="h4">{cancelledOrders}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormControl sx={{ minWidth: 250 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="All">Total</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Dispatched">Dispatched</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <DatePickerComp />
            </Grid>
          </Grid>

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Order Date</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Typography
                          onClick={() => navigate(`/order/${order.orderId}`)}
                          sx={{
                            cursor: "pointer",
                            color: "#00203F",
                            textDecoration: "underline",
                            marginRight: 1,
                          }}
                        >
                          {order.orderId}
                        </Typography>
                        <Tooltip title={tooltipText}>
                          <ContentCopy
                            onClick={() => copyToClipboard(order.orderId)}
                            sx={{
                              cursor: "pointer",
                              color: "#00203F",
                              fontSize: "20px",
                            }}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>

                    <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{`${order.address}, ${order.apartment}, ${order.postCode}`}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="row" flexWrap="nowrap">
                        <Button
                          style={{
                            marginRight: "10px",
                            backgroundColor: "#ADF0D1",
                          }}
                          variant="contained"
                          color="#00203F"
                          onClick={() =>
                            handleOrderStatusChange(order._id, "Dispatched")
                          }
                          disabled={
                            disabledButtons[order._id]?.Dispatched ||
                            disabledButtons[order._id]?.Cancelled
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
                          disabled={disabledButtons[order._id]?.Cancelled}
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
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;
