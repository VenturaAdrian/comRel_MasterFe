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
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 2 }}>

      {historyData.map((item) => (
        <Card key={item.request_id} sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
          <CardContent sx={{ pb: 1 }}>
            {/* Header Section */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: "#1877F2" }}>G</Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {item.created_by || "Community Relations"}{" "}
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
            {(userPosition !== "encoder" || item.request_status === "reviewed") && (
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
// import { useState } from 'react';
// import {
//   AppBar,
//   Avatar,
//   Badge,
//   Box,
//   Divider,
//   Grid,
//   IconButton,
//   InputBase,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Paper,
//   Stack,
//   Toolbar,
//   Typography,
//   useTheme,
//   useMediaQuery,
//   Button
// } from '@mui/material';
// import {
//   Home as HomeIcon,
//   Storefront as StorefrontIcon,
//   People as PeopleIcon,
//   VideoLibrary as VideoLibraryIcon,
//   Notifications as NotificationsIcon,
//   Message as MessageIcon,
//   Search as SearchIcon,
//   Menu as MenuIcon
// } from '@mui/icons-material';
// import { styled } from '@mui/system';
// import test from 'assets/images/logo1.png'


// const DummyAvatar = 'https://via.placeholder.com/40';
// const DummyPostImg = 'https://via.placeholder.com/500x400';

// const SidebarOption = ({ icon, text }) => (
//   <ListItem button sx={{ color: 'white' }}>
//     <ListItemIcon sx={{ color: 'white' }}>{icon}</ListItemIcon>
//     <ListItemText primary={text} primaryTypographyProps={{ fontSize: 14 }} />
//   </ListItem>
// );

// const ToBePosted = () => {  
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('md'));

//   return (
//     <Box sx={{ bgcolor: ' #18191A', color: 'white', minHeight: '100vh', fontFamily: 'Arial, sans-serif' , mt:10}}>
//       {/* Top Nav */}
//       <AppBar position="static" sx={{ bgcolor: ' 	#3b5998', boxShadow: 'none' }}>
//         <Toolbar sx={{ justifyContent: 'space-between', px: 2 }}>
//           {/* Left */}
//           <Stack direction="row" alignItems="center" spacing={1}>
//             <Avatar src={test} sx={{ width: 36, height: 36 }} />
//             <Box
//               sx={{
//                 bgcolor: ' #8b9dc3',
//                 px: 1.5,
//                 py: 0.5,
//                 borderRadius: 10,
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//             >
//               <SearchIcon sx={{ fontSize: 20, color: ' #f7f7f7' }} />
//               <InputBase placeholder="Search Comrel" sx={{ color: '	#f7f7f7', ml: 1, fontSize: 14,  }} />
//             </Box>
//           </Stack>

//           {/* Center Icons */}
//           <Stack direction="row" spacing={4} alignItems="center">
//             <IconButton color="#1d3469"><HomeIcon /></IconButton>
//             <IconButton><VideoLibraryIcon sx={{ color: 'white' }} /></IconButton>
//             <IconButton><StorefrontIcon sx={{ color: 'white' }} /></IconButton>
//             <IconButton><PeopleIcon sx={{ color: 'white' }} /></IconButton>
//           </Stack>

//           {/* Right Icons */}
//           <Stack direction="row" spacing={1} alignItems="center">
//             <IconButton sx={{ bgcolor: '#3A3B3C' }}><MenuIcon sx={{ color: 'white' }} /></IconButton>
//             <IconButton sx={{ bgcolor: '#3A3B3C' }}>
//               <Badge color="error" variant="dot">
//                 <MessageIcon sx={{ color: 'white' }} />
//               </Badge>
//             </IconButton>
//             <IconButton sx={{ bgcolor: '#3A3B3C' }}>
//               <Badge color="error" variant="dot">
//                 <NotificationsIcon sx={{ color: 'white' }} />
//               </Badge>
//             </IconButton>
//             <Avatar src={DummyAvatar} sx={{ width: 32, height: 32 }} />
//           </Stack>
//         </Toolbar>
//       </AppBar>

//       <Box sx={{ display: 'flex' }}>
//         {/* Sidebar */}
//         <Box sx={{ width: 280, p: 2, display: { xs: 'none', md: 'block' } }}>
//           <SidebarOption icon={<Avatar />} text="Pancham Charam" />
//           <SidebarOption icon={<Avatar />} text="Meta AI" />
//           <SidebarOption icon={<PeopleIcon />} text="Friends" />
//           <SidebarOption icon={<StorefrontIcon />} text="Professional dashboard" />
//           <SidebarOption icon={<VideoLibraryIcon />} text="Feeds" />
//           <SidebarOption icon={<PeopleIcon />} text="Groups" />
//           <SidebarOption icon={<StorefrontIcon />} text="Marketplace" />
//           <SidebarOption icon={<MenuIcon />} text="See more" />

//           <Divider sx={{ bgcolor: '#3A3B3C', my: 2 }} />

//           <Typography variant="body2" sx={{ color: 'gray', mb: 1 }}>Your shortcuts</Typography>
//           <SidebarOption icon={<Avatar />} text="Adrian Ventura" />
//           <SidebarOption icon={<Avatar />} text="PC parts benta swap sa baguio" />
//           <SidebarOption icon={<Avatar />} text="PC Marketplace of Baguio-Benguet" />
//         </Box>

//         {/* Main Feed */}
//         <Box sx={{ flexGrow: 1, px: 2, py: 2 }}>
//           <Box sx={{ bgcolor: '#242526', p: 2, borderRadius: 2 }}>
//             <Stack direction="row" alignItems="center" spacing={1}>
//               <Avatar src={DummyAvatar} />
//               <InputBase
//                 fullWidth
//                 placeholder="What's on your mind, Pancham?"
//                 sx={{ bgcolor: '#3A3B3C', borderRadius: 2, px: 2, py: 1, color: 'white', fontSize: 14 }}
//               />
//             </Stack>
//             <Stack direction="row" spacing={2} mt={2} justifyContent="space-around">
//               <Button variant="text" sx={{ color: 'gray', fontSize: 12 }}>Live video</Button>
//               <Button variant="text" sx={{ color: 'gray', fontSize: 12 }}>Photo/video</Button>
//               <Button variant="text" sx={{ color: 'gray', fontSize: 12 }}>Reel</Button>
//             </Stack>
//           </Box>

//           {/* Stories */}
//           <Stack direction="row" spacing={2} my={2}>
//             {[...Array(5)].map((_, i) => (
//               <Box key={i} sx={{ width: 100, height: 180, bgcolor: '#3A3B3C', borderRadius: 2, overflow: 'hidden', textAlign: 'center' }}>
//                 <Avatar src={DummyAvatar} sx={{ width: 40, height: 40, m: 1, mx: 'auto' }} />
//                 <Typography variant="caption" sx={{ color: 'white' }}>Story {i + 1}</Typography>
//               </Box>
//             ))}
//           </Stack>

//           {/* Post */}
//           <Paper sx={{ bgcolor: '#242526', p: 2, borderRadius: 2 }}>
//             <Typography variant="subtitle2">Queenpin Co Dy</Typography>
//             <Typography variant="caption" color="gray">4h · Public</Typography>
//             <Typography variant="body2" sx={{ mt: 1 }}>
//               You hate me? That's valid, since I called you and exposed screenshots you couldn't explain. Amazing!!
//               <br />
//               <Box component="span" sx={{ color: '#359BF4' }}>#DontLetAnyoneTreatYouLESS</Box>
//             </Typography>
//             <Box mt={2}>
//               <img src={DummyPostImg} alt="Post" width="100%" style={{ borderRadius: 8 }} />
//             </Box>
//           </Paper>
//         </Box>

//         {/* Right Sidebar */}
//         <Box sx={{ width: 300, display: { xs: 'none', lg: 'block' }, p: 2 }}>
//           <Typography variant="body2" color="gray">Sponsored</Typography>
//           <Box my={1}>
//             <img src={DummyPostImg} alt="Sponsored" width="100%" style={{ borderRadius: 8 }} />
//             <Typography variant="caption">Life at STI | STI College</Typography>
//           </Box>
//           <Box my={1}>
//             <img src={DummyPostImg} alt="Sponsored" width="100%" style={{ borderRadius: 8 }} />
//             <Typography variant="caption">Life at Uniqlo</Typography>
//           </Box>
//           <Typography variant="body2" sx={{ mt: 2 }} color="gray">Birthdays</Typography>
//           <Typography variant="caption">Idrick Gepe and 7 others have birthdays today.</Typography>
//           <Typography variant="body2" sx={{ mt: 2 }} color="gray">Contacts</Typography>
//           <List>
//             <SidebarOption icon={<Avatar />} text="Meta AI" />
//             <SidebarOption icon={<Avatar />} text="Vivianne Lorriene De Guzman" />
//             <SidebarOption icon={<Avatar />} text="Khian Rainn Adolfo" />
//           </List>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// export default ToBePosted;
