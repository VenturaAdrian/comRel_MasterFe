import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import config from 'config';

export default function AddForm() {
  const [commArea, setCommArea] = useState('');
  const [commAct, setCommAct] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [commVenue, setCommVenue] = useState('');
  const [commGuest, setCommGuest] = useState('');
  const [commDocs, setCommDocs] = useState([]);
  const [commEmps, setCommEmps] = useState('');
  const [commBenef, setCommBenef] = useState('');
  const [createdby, setCreatedBy] = useState('');

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
    }
  }, []);

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('comm_Area', commArea);
    formData.append('comm_Act', commAct);
    formData.append('date_Time', dateTime);
    formData.append('comm_Venue', commVenue);
    formData.append('comm_Guest', commGuest);
    formData.append('comm_Emps', commEmps);
    formData.append('comm_Benef', commBenef);
    formData.append('created_by', createdby);

    for (let i = 0; i < commDocs.length; i++) {
      formData.append('comm_Docs', commDocs[i]);
    }

    try {
      const response = await axios.post(`${config.baseApi1}/request/add-request-form`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Form submitted successfully!');
    } catch (err) {
      alert('Failed to submit.');
    }
  };

  return (
    <Box sx={{ mt: 0, pt: 0, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 2 }}>

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Community Area/Barangay"
                fullWidth
                value={commArea}
                onChange={(e) => setCommArea(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Type of Community Activity"
                fullWidth
                value={commAct}
                onChange={(e) => setCommAct(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Date and Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Venue/Place"
                fullWidth
                value={commVenue}
                onChange={(e) => setCommVenue(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Guests and People Involved"
                fullWidth
                value={commGuest}
                onChange={(e) => setCommGuest(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <InputLabel shrink>Supporting Documents</InputLabel>
              <Button variant="contained" component="label">
                Upload Files
                <input
                  type="file"
                  hidden
                  multiple
                  onChange={(e) => setCommDocs(Array.from(e.target.files))}
                />
              </Button>

              {/* Display selected files */}
              {commDocs.length > 0 && (
                <List dense>
                  {commDocs.map((file, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <InsertDriveFileIcon />
                      </ListItemIcon>
                      <ListItemText primary={file.name} />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="COMREL Employees Involved"
                fullWidth
                value={commEmps}
                onChange={(e) => setCommEmps(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Beneficiaries"
                fullWidth
                value={commBenef}
                onChange={(e) => setCommBenef(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                Submit
              </Button>
              <Button variant="outlined" onClick={handleBack}>
                Home
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
