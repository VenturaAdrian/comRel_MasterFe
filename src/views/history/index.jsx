import axios from "axios";
import config from "config";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack
} from "@mui/material";

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [userPosition, setUserPosition] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((response) => {
        setHistoryData(response.data);
      })
      .catch((error) => {
        console.error("ERROR FETCHING FE:", error);
      });

    const empInfo = JSON.parse(localStorage.getItem("user"));
    setUserPosition(empInfo.emp_position);
  }, []);

  const handleView = (item) => {
    const params = new URLSearchParams({ id: item.request_id });
    window.location.replace(`/comrel/viewform?${params.toString()}`);
  };

  const handleReview = (item) => {
    const params = new URLSearchParams({ id: item.request_id });
    window.location.replace(`/comrel/review?${params.toString()}`);
  };

  // Filter
  let filteredData = filterStatus
    ? historyData.filter(item =>
        item.request_status.toLowerCase() === filterStatus.toLowerCase()
      )
    : [...historyData];

  // Sort
  filteredData.sort((a, b) => {
    const dateA = new Date(a.date_Time);
    const dateB = new Date(b.date_Time);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Helper to get 1 displayable file (image or first file)
  const getFirstFilePreview = (docsString = "", requestId) => {
    const files = docsString.split(",").map(f => f.trim()).filter(Boolean);
    if (!files.length) return null;

    const imageFile = files.find(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    const selectedFile = imageFile || files[0];

    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(selectedFile);
    const fileUrl = `${config.baseApi1}/files/${selectedFile}`;
    const fallbackUrl = `${config.baseApi1}/files/request_${requestId}/images/${selectedFile}`;
    const fileExt = selectedFile.split(".").pop().toUpperCase();

    return { isImage, fileUrl, fallbackUrl, fileExt };
  };

  return (
    <Box sx={{ p: 6, mt: 6, backgroundColor: "#f5f5f5" }}>
      {/* Filter & Sort Controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Request">Request</MenuItem>
            <MenuItem value="Reviewed">Reviewed</MenuItem>
            <MenuItem value="Declined">Declined</MenuItem>
            <MenuItem value="Accepted">Accepted</MenuItem>
            <MenuItem value="To-Post">To-Post</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By Date</InputLabel>
          <Select
            value={sortOrder}
            label="Sort By Date"
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <MenuItem value="newest">Newest First</MenuItem>
            <MenuItem value="oldest">Oldest First</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Card List */}
      <Grid container spacing={2}>
        {filteredData.map((item) => {
          const preview = getFirstFilePreview(item.comm_Docs, item.request_id);

          return (
            <Grid item xs={12} md={6} key={item.request_id}>
              <Card sx={{ display: "flex", backgroundColor: "#ddd", border: '2px solid #274e13' }}>
                <Box
                  sx={{
                    width: 150,
                    height: 150,
                    m: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#f0f0f0",
                    borderRadius: 1,
                    overflow: "hidden"
                  }}
                >
                  {preview ? (
                    preview.isImage ? (
                      <img
                        src={preview.fileUrl}
                        alt="Doc Preview"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = preview.fallbackUrl;
                        }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">{preview.fileExt} File</Typography>
                        <Button
                          href={preview.fileUrl}
                          target="_blank"
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          View
                        </Button>
                      </Box>
                    )
                  ) : (
                    <Typography variant="body2" color="text.secondary">No File</Typography>
                  )}
                </Box>

                <CardContent>
                  <Typography><strong>Request ID:</strong> {item.request_id}</Typography>
                  <Typography><strong>Status:</strong> {item.request_status}</Typography>
                  <Typography><strong>Community Area/Barangay:</strong> {item.comm_Area}</Typography>
                  <Typography><strong>Community Activity:</strong> {item.comm_Act}</Typography>
                  <Typography>
                    <strong>Date/Time:</strong>{" "}
                    {new Date(item.date_Time).toLocaleString("en-PH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      hour12: true
                    })}
                  </Typography>

                  <Box mt={1}>
                    {(userPosition !== "encoder" || item.request_status === "Reviewed") && (
                      <>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleView(item)}
                          sx={{ mr: 1 }}
                        >
                          View
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleReview(item)}
                        >
                          Review
                        </Button>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
