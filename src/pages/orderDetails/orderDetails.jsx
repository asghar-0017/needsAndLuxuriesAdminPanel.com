import React, { useContext, useEffect, useMemo, useState } from "react";
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
  TablePagination,
} from "@mui/material";
import { AccessTime, CheckCircle, Cancel } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import {
  deleteDataById,
  fetchData,
  updateData,
} from "../../config/apiServices/apiServices";
import Loader from "../../components/loader/loader";
import { showSuccessToast } from "../../components/toast/toast";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [disabledButtons, setDisabledButtons] = useState({});
  const location = useLocation();
  const { selectedDateByCalendar, orderStatus } = location.state || status;

  const navigate = useNavigate();
  const { searchQuery, selectedDate } = useContext(SearchContext);

  useEffect(() => {
    const orderStatusFromState = location.state?.orderStatus;
    if (orderStatusFromState) {
      setStatus(orderStatusFromState);
    }
  }, [location.state]);

  const formattedDate = useMemo(() => {
    if (!selectedDateByCalendar) return null;

    const date = new Date(selectedDateByCalendar);

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    const time = date.toTimeString().split(" ")[0];
    const gmt = "GMT";

    return `${dayOfWeek}, ${day} ${month} ${year} ${time} ${gmt}`;
  }, [selectedDateByCalendar]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
            Fullfilled: order.orderStatus === "Fullfilled",
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

    return () => {
      setProducts([]);
      setFilteredData([]);
      setError(null);
      setLoading(false);
    };
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
      } else if (formattedDate) {
        const selectedDateStringByCalendar = new Date(
          selectedDateByCalendar
        ).toLocaleDateString();

        const productDateString = new Date(
          product.orderDate
        ).toLocaleDateString();
        dateMatch = selectedDateStringByCalendar === productDateString;
      }

      return statusMatch && orderIdMatch && dateMatch;
    });

    setFilteredData(filteredProducts);
    console.log(filteredProducts);
  }, [status, searchQuery, selectedDate, products, formattedDate, orderStatus]);

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
            orderStatus: newStatus,
          };

          setDisabledButtons((prev) => ({
            ...prev,
            [orderId]: {
              Fullfilled: true,
              Dispatched: true,
              Cancelled: true,
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
                  ? { ...order, orderStatus: newStatus }
                  : order
              )
            );
            showSuccessToast(`Order ${newStatus.toLowerCase()} successfully.`);

            setDisabledButtons((prev) => ({
              ...prev,
              [orderId]: {
                Fullfilled: newStatus === "Fullfilled", 
                Dispatched:
                  newStatus === "Dispatched" || newStatus === "Fullfilled", 
                Cancelled: newStatus === "Cancelled",
              },
            }));
          }
        }
      } catch (error) {
        console.error(`Error updating order status to ${newStatus}:`, error);
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you want to delete this order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, Order Deleted successfully!`,
      cancelButtonText: "Back",
    });
    if (result.isConfirmed) {
      try {
        let response = await deleteDataById("billing-details", id);
        setProducts((prevProducts) =>
          prevProducts.filter((order) => order.orderId !== id)
        );

        setFilteredData((prevFilteredData) =>
          prevFilteredData.filter((order) => order.orderId !== id)
        );
        showSuccessToast("Order deleted successfully.");
      } catch (error) {
        console.error(`Error deleting`, error);
      }
    }
  };

  return (
    <>
      {loading && <Loader open={loading} />}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
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
                  <MenuItem value="Fullfilled">Fullfilled</MenuItem>
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
                {paginatedData.map((order) => (
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
                        <Tooltip title={tooltipText}>
                          <ContentCopy
                            onClick={() => copyToClipboard(order.orderId)}
                            sx={{
                              cursor: "pointer",
                              color: "#3f51b5",
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
                    <TableCell>{`${order?.address}, ${order?.apartment}, ${order?.postCode}`}</TableCell>
                    <TableCell>{order.orderStatus}</TableCell>
                    <TableCell>
                      <Box display="flex" flexDirection="row" flexWrap="nowrap">
                        <Button
                          style={{
                            marginRight: "10px",
                            backgroundColor: "#00C49F",
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleOrderStatusChange(order._id, "Fullfilled")
                          }
                          disabled={disabledButtons[order._id]?.Fullfilled}
                        >
                          Fullfilled
                        </Button>
                        <Button
                          style={{
                            marginRight: "10px",
                            backgroundColor: "#2196F3",
                          }}
                          variant="contained"
                          color="primary"
                          onClick={() =>
                            handleOrderStatusChange(order._id, "Dispatched")
                          }
                          disabled={disabledButtons[order._id]?.Dispatched}
                        >
                          Dispatch
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          style={{
                            marginRight: "10px",
                            backgroundColor: "#F44336",
                          }}
                          onClick={() =>
                            handleOrderStatusChange(order._id, "Cancelled")
                          }
                          disabled={disabledButtons[order._id]?.Cancelled}
                        >
                          Cancel
                        </Button>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onClick={() => handleDelete(order.orderId)}
                        >
                          <DeleteIcon
                            sx={{
                              color: "red",
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
    </>
  );
};

export default OrderDetailsPage;
