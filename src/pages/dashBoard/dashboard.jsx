import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  // PieChart,
  // Pie,
  // Cell,
} from "recharts";
import { fetchData } from "../../config/apiServices/apiServices";
import Loader from "../../components/loader/loader";
import { MdAttachMoney } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CheckCircle, Cancel, AccessTime, MonetizationOn } from "@mui/icons-material";
import FullCalendarComponent from "../../components/calendar/calendar";
import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [barChartData, setBarChartData] = useState([]);
  const [dailyOrderData, setDailyOrderData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [dispatchedOrders, setDispatchedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);
  const [totalSales, setTotalSales] = useState();

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetchData("billing-details");

        const respons2 = await fetchData("total-sales/fulfilled");
        const products = response.result;
        setTotalSales(respons2.totalSales);
        

        const total = products.length;
        const pending = products.filter(
          (order) => order.orderStatus === "Pending"
        ).length;
        const dispatched = products.filter(
          (order) => order.orderStatus === "Dispatched"
        ).length;
        const cancelled = products.filter(
          (order) => order.orderStatus === "Cancelled"
        ).length;

        setTotalOrders(total);
        setPendingOrders(pending);
        setDispatchedOrders(dispatched);
        setCancelledOrders(cancelled);

        setOrders(products);

        const formattedData = [
          { name: "Pending", value: pending },
          { name: "Dispatched", value: dispatched },
          { name: "Cancelled", value: cancelled },
        ];

        setBarChartData(formattedData);

        const dailyData = products.reduce((acc, order) => {
          const orderDate = parseISO(order.orderDate);
          const dayOfMonth = format(orderDate, "d");
          if (["1", "5", "10", "15", "20", "25", "30"].includes(dayOfMonth)) {
            if (!acc[dayOfMonth]) {
              acc[dayOfMonth] = 0;
            }
            acc[dayOfMonth] += 1;
          }
          return acc;
        }, {});

        const days = ["1", "5", "10", "15", "20", "25", "30"];
        const dailyOrderArray = days.map((day) => ({
          name: `Day ${day}`,
          value: dailyData[day] || 0,
        }));

        setDailyOrderData(dailyOrderArray);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  const handleCardClick = (status) => {
    navigate("/order-details", { state: { orderStatus: status || "All" } }); 
  };

  const toggleCalendarVisibility = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <>
      <div
        className="container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        {loading && <Loader open={loading} />}
        {!loading && (
          <>
            <Box
              sx={{
                my: 2,
                textAlign: "center",
                bgcolor: "#fff3cd",
                p: 1,
                borderRadius: 2,
                width: "100%",
              }}
            >
              <Typography variant="body1" color="textSecondary">
                You have <b>{pendingOrders}</b> pending orders
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
  <Grid item xs={12} sm={6} md={2.4}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "#e0f7fa",
        cursor: "pointer",
        height: '100px', 
      }}
      // onClick={() => handleCardClick("TotalSales")}
    >
      <FaMoneyBillWave style={{ fontSize: 50, color: "white", marginRight: 10 }} />
      <CardContent >
        <Typography variant="body2" color="text.secondary">Total Sales</Typography>
        <Typography variant="h6" color="text.primary">{totalSales}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={2.4}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "#f3e5f5",
        cursor: "pointer",
        height: '100px',
      }}
      onClick={() => handleCardClick("All")}
    >
      <AccessTime style={{ fontSize: 50, color: "white", marginRight: 10 }} />
      <CardContent >
        <Typography variant="body2" color="text.secondary">Total Orders</Typography>
        <Typography variant="h6" color="text.primary">{totalOrders}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={2.4}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "#fff9c4",
        cursor: "pointer",
        height: '100px', // Adjust height to create smaller cards
      }}
      onClick={() => handleCardClick("Pending")}
    >
      <AccessTime style={{ fontSize: 50, color: "white", marginRight: 10 }} />
      <CardContent>
        <Typography variant="body2" color="text.secondary">Pending Orders</Typography>
        <Typography variant="h6" color="text.primary">{pendingOrders}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={2.4}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "#e8f5e9",
        cursor: "pointer",
        height: '100px', // Adjust height to create smaller cards
      }}
      onClick={() => handleCardClick("Dispatched")}
    >
      <CheckCircle style={{ fontSize: 50, color: "white", marginRight: 10 }} />
      <CardContent >
        <Typography variant="body2" color="text.secondary">Dispatched Orders</Typography>
        <Typography variant="h6" color="text.primary">{dispatchedOrders}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12} sm={6} md={2.4}>
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1,
        backgroundColor: "#ffebee",
        cursor: "pointer",
        height: '100px', // Adjust height to create smaller cards
      }}
      onClick={() => handleCardClick("Cancelled")}
    >
      <Cancel style={{ fontSize: 50, color: "white", marginRight: 10 }} />
      <CardContent >
        <Typography variant="body2" color="text.secondary">Cancelled Orders</Typography>
        <Typography variant="h6" color="text.primary">{cancelledOrders}</Typography>
      </CardContent>
    </Card>
  </Grid>
  <Grid item xs={12}>
    <Divider />
  </Grid>
</Grid>

            <Grid container spacing={5}>
              <Grid item xs={12} md={7}>
                <Typography variant="h6" align="center" gutterBottom>
                  Orders by Day
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={dailyOrderData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="h6" align="center" gutterBottom>
                  Orders Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={barChartData}
                    margin={{
                      top: 5,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      fill="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>

              </Grid>

              <Grid item xs={12} md={12} style={{ display: "flex", justifyContent: "flex-end", flexDirection: "column"}}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={toggleCalendarVisibility}
                  sx={{ mb: 2 }}
                >
                  {showCalendar ? "Hide Calendar" : "Show Calendar"}
                </Button>
                {showCalendar && <FullCalendarComponent orders={orders} />}
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
