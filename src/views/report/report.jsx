import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "config";
import Chart from "react-apexcharts";
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function Reports() {
  const [data, setData] = useState([]);
  const [xAxisOption, setXAxisOption] = useState("request_status");
  const [yAxisOption, setYAxisOption] = useState("comm_Act");
  const [dateMode, setDateMode] = useState("month");

  const [chartData, setChartData] = useState({
    options: { chart: { id: "summary" }, xaxis: { categories: [] } },
    series: [],
  });

  const formatDateKey = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const week = String(getWeekNumber(date)).padStart(2, "0");

    if (dateMode === "year") return `${year}`;
    if (dateMode === "month") return `${year}-${month}`;
    if (dateMode === "week") return `${year}-W${week}`;
    return dateStr;
  };

  const getWeekNumber = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    const week1 = new Date(d.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7
      )
    );
  };

  const getAxisLabel = (key) => {
    switch (key) {
      case "request_status":
        return "Request Status";
      case "comm_Act":
        return "Activity";
      case "comm_Area":
        return "Barangay";
      default:
        return key;
    }
  };

  const groupData = () => {
    const grouped = {};

    data.forEach((item) => {
      const dateKey = formatDateKey(item.date_Time);
      const xVal = item[xAxisOption] || "Unknown";
      const yVal = item[yAxisOption] || "Unknown";

      const groupKey = `${dateKey}_${xVal}`;

      if (!grouped[groupKey]) grouped[groupKey] = {};
      if (!grouped[groupKey][yVal]) grouped[groupKey][yVal] = 0;

      grouped[groupKey][yVal]++;
    });

    const categories = [...new Set(data.map((item) => {
      const dateKey = formatDateKey(item.date_Time);
      return `${dateKey}_${item[xAxisOption] || "Unknown"}`;
    }))].sort();

    const yKeys = new Set();
    Object.values(grouped).forEach(obj =>
      Object.keys(obj).forEach(k => yKeys.add(k))
    );

    const series = Array.from(yKeys).map(yVal => ({
      name: yVal,
      data: categories.map(cat => grouped[cat]?.[yVal] || 0),
    }));

    setChartData({
      options: {
        chart: {
          id: "summary",
          stacked: true,
        },
        xaxis: {
          categories,
          labels: {
            rotate: -45,
          },
        },
        title: {
          text: `Grouped by ${getAxisLabel(xAxisOption)} and ${getAxisLabel(yAxisOption)} (${dateMode})`,
          align: "center",
        },
        tooltip: {
          shared: true,
          intersect: false,
        },
        legend: {
          position: "bottom",
        },
      },
      series,
    });
  };

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((res) => setData(res.data || []))
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      groupData();
    }
  }, [data, xAxisOption, yAxisOption, dateMode]);

  return (
    <Box sx={{ p: 3 , mt:6}}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>X-Axis</InputLabel>
            <Select
              value={xAxisOption}
              onChange={(e) => setXAxisOption(e.target.value)}
              label="X-Axis"
            >
              <MenuItem value="request_status">Request Status</MenuItem>
              <MenuItem value="comm_Act">Activity</MenuItem>
              <MenuItem value="comm_Area">Barangay</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Y-Axis</InputLabel>
            <Select
              value={yAxisOption}
              onChange={(e) => setYAxisOption(e.target.value)}
              label="Y-Axis"
            >
              <MenuItem value="comm_Act">Activity</MenuItem>
              <MenuItem value="comm_Area">Barangay</MenuItem>
              <MenuItem value="request_status">Request Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Date Mode</InputLabel>
            <Select
              value={dateMode}
              onChange={(e) => setDateMode(e.target.value)}
              label="Date Mode"
            >
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={450}
      />
    </Box>
  );
}
