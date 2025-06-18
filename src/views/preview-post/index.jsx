import { useEffect, useState } from "react";
import axios from "axios";
import config from "config";

// MUI Components
import {
  Box,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import PublicIcon from "@mui/icons-material/Public";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

export default function ToBePosted() {
  const [historyData, setHistoryData] = useState([]);
  const [userPosition, setUserPosition] = useState("");

  useEffect(() => {
    axios
      .get(`${config.baseApi1}/request/history`)
      .then((response) => setHistoryData(response.data))
      .catch((error) => console.error("ERROR FETCHING FE:", error));

    const empInfo = JSON.parse(localStorage.getItem("user"));
    setUserPosition(empInfo?.emp_position || "");
  }, []);

  const handleEdit = (id) => {
    window.location.replace(`/comrel/editform?id=${id}`);
  };

  const handleView = (id) => {
    window.location.replace(`/comrel/viewform?id=${id}`);
  };

  const handleReview = (id) => {
    window.location.replace(`/comrel/review?id=${id}`);
  };

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 2, px: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">📄 Request Feed</Typography>
        <Button variant="contained" onClick={handleBack}>
          ← Back
        </Button>
      </Stack>

      {historyData.map((item) => (
        <Card key={item.request_id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ pb: 1 }}>
            {/* Header Section */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#1877F2" }}>G</Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.created_by || "Gideon Villanueva Galinato"}{" "}
                  <Typography component="span" sx={{ fontWeight: 400 }}>
                    is with{" "}
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      Ryan Garcia
                    </Typography>{" "}
                    at{" "}
                    <Typography component="span" sx={{ fontWeight: 600 }}>
                      Emerald
                    </Typography>
                  </Typography>
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  3h • Emerald, QLD, Australia • <PublicIcon sx={{ fontSize: 14, verticalAlign: "middle" }} />
                </Typography>
              </Box>
              <Box flexGrow={1} />
              <IconButton>
                <MoreHorizIcon />
              </IconButton>
            </Stack>

            {/* Caption */}
            <Typography sx={{ mt: 2, whiteSpace: "pre-line" }}>
              Salamat ti gagara nga panagbisita pards and mars in spite of being 1k K's apart 😅
              Kasla haan nga kapapati nga ditoy tayon agkikita 😃.{"\n"}
              Thanks for the advices and for the good dinner as well. See you again shortly.{" "}
              <Typography component="span" sx={{ color: "#1877F2", fontWeight: 500 }}>
                #iLepanto
              </Typography>
            </Typography>
          </CardContent>

          {/* Images */}
          <Grid container spacing={0} sx={{ p: 1 }}>
            {item.comm_Docs?.split(",").slice(0, 2).map((file, idx) => {
              const trimmed = file.trim();
              const isImg = /\.(jpg|jpeg|png|webp|gif)$/i.test(trimmed);
              const defaultUrl = `${config.baseApi1}/files/${trimmed}`;
              const fallbackUrl = `${config.baseApi1}/files/request_${item.request_id}/images/${trimmed}`;

              return (
                <Grid item xs={6} key={idx}>
                  {isImg ? (
                    <CardMedia
                      component="img"
                      height="200"
                      image={defaultUrl}
                      onError={(e) => (e.target.src = fallbackUrl)}
                      alt={`file-${idx}`}
                      sx={{ borderRadius: 1, objectFit: "cover" }}
                    />
                  ) : (
                    <Box
                      component="iframe"
                      src={defaultUrl}
                      title={`doc-${idx}`}
                      sx={{ width: "100%", height: 200, border: 0, borderRadius: 1 }}
                      onError={(e) => (e.target.src = fallbackUrl)}
                    />
                  )}
                </Grid>
              );
            })}
          </Grid>

          {/* Like/Comment/Share */}
          <Divider />
          <Stack direction="row" justifyContent="space-around" py={1}>
            <Button startIcon={<ThumbUpOffAltIcon />} sx={{ textTransform: "none", color: "#65676b" }}>
              Like
            </Button>
            <Button startIcon={<ChatBubbleOutlineIcon />} sx={{ textTransform: "none", color: "#65676b" }}>
              Comment
            </Button>
            <Button startIcon={<ShareOutlinedIcon />} sx={{ textTransform: "none", color: "#65676b" }}>
              Share
            </Button>
          </Stack>
          <Divider />

          {/* Actions (Edit, View, Review) */}
          <Stack direction="row" spacing={1} p={2} flexWrap="wrap">
            {(userPosition !== "encoder" || item.request_status === "Reviewed") && (
              <>
                <Button variant="contained" color="primary" onClick={() => handleEdit(item.request_id)}>
                  ✏️ Edit
                </Button>
                <Button variant="contained" color="info" onClick={() => handleView(item.request_id)}>
                  🔍 View
                </Button>
              </>
            )}
            {userPosition !== "encoder" && (
              <Button variant="contained" color="success" onClick={() => handleReview(item.request_id)}>
                ✅ Review
              </Button>
            )}
          </Stack>
        </Card>
      ))}
    </Box>
  );
}
