import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchData } from "../../config/apiServices/apiServices";
import Loader from "../../components/loader/loader";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material";
import FullCalendarComponent from "../../components/calendar/calendar";

const Dashboard = () => {
  const [barChartData, setBarChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [totalOrders, setTotalOrders] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [dispatchedOrders, setDispatchedOrders] = useState(0);
  const [cancelledOrders, setCancelledOrders] = useState(0);

  const [orders, setOrders] = useState([]);

  const COLORS = ["#FFBB28", "#00C49F", "#0088FE"];

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const response = await fetchData("billing-details");
        const products = response.result;

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
          {
            name: "Dispatched",
            value: dispatched,
          },
          { name: "Cancelled", value: cancelled },
        ];

        setBarChartData(formattedData);
        setPieChartData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
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

            <Grid container spacing={5}>
              <Grid item xs={12} md={8}>
                <FullCalendarComponent orders={orders} />
              </Grid>

              <Grid item xs={12} md={4}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={barChartData}
                    margin={{
                      top: 5,
                      // right: 30,
                      // left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value">
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
