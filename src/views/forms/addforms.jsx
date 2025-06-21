import React, { useEffect, useRef, useState } from 'react';
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
  ListItemText,
  Autocomplete
} from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import config from 'config';

const barangayOptions = [
  'Balili', 'Bedbed', 'Bulalacao', 'Cabiten', 'Colalo', 'Guinaoang',
  'Paco', 'Palasaan', 'Poblacion', 'Sapid', 'Tabio', 'Taneg'
];

const activityOptions = [
  'Medical Mission', 'Reach Out', 'Feeding Program',
  'Rescue', 'Rehabilitation', 'Ayuda'
];

export default function AddForm() {
  const [commArea, setCommArea] = useState([]);
  const [commAct, setCommAct] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [commVenue, setCommVenue] = useState('');
  const [commGuest, setCommGuest] = useState([]);
  const [commDocs, setCommDocs] = useState([]);
  const [commEmps, setCommEmps] = useState([]);
  const [commBenef, setCommBenef] = useState([]);
  const [createdby, setCreatedBy] = useState('');
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null); // Ref for resetting file input

  useEffect(() => {
    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
    }
  }, []);

  const handleBack = () => {
    window.location.replace(`${config.baseUrl}/comrel/dashboard`);
  };

  const validateFields = () => {
    const newErrors = {};
    if (commArea.length === 0) newErrors.commArea = 'Community area is required';
    if (!commAct) newErrors.commAct = 'Activity is required';
    if (!dateTime) newErrors.dateTime = 'Date and time is required';
    if (!commVenue) newErrors.commVenue = 'Venue is required';
    if (commGuest.length === 0) newErrors.commGuest = 'Guest list is required';
    if (commEmps.length === 0) newErrors.commEmps = 'Employee list is required';
    if (commBenef.length === 0) newErrors.commBenef = 'Beneficiaries list is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const formData = new FormData();
    formData.append('comm_Area', commArea.join(', '));
    formData.append('comm_Act', commAct);
    formData.append('date_Time', dateTime);
    formData.append('comm_Venue', commVenue);
    formData.append('comm_Guest', commGuest.join(', '));
    formData.append('comm_Emps', commEmps.join(', '));
    formData.append('comm_Benef', commBenef.join(', '));
    formData.append('created_by', createdby);

    for (let i = 0; i < commDocs.length; i++) {
      formData.append('comm_Docs', commDocs[i]);
    }

    try {
      await axios.post(`${config.baseApi1}/request/add-request-form`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Form submitted successfully!');
    } catch (err) {
      alert('Failed to submit.');
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <Box sx={{ mt: 4, p:2,backgroundColor: '#93c47d', minHeight: '100vh'}}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', mt: 2 ,mb:2}}>
        <Typography variant="h5" mb={2} textAlign="center">Add Community Request Form</Typography>

        <Box component="form" onSubmit={handleSubmit} encType="multipart/form-data" noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={barangayOptions}
                value={commArea}
                onChange={(e, newValue) => {
                  setCommArea(newValue);
                  clearError('commArea');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Community Area / Barangay"
                    required
                    error={!!errors.commArea}
                    helperText={errors.commArea}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                freeSolo
                options={activityOptions}
                value={commAct}
                onChange={(e, newValue) => {
                  setCommAct(newValue || '');
                  clearError('commAct');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type of Community Activity"
                    required
                    error={!!errors.commAct}
                    helperText={errors.commAct}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Date and Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={dateTime}
                onChange={(e) => {
                  setDateTime(e.target.value);
                  clearError('dateTime');
                }}
                required
                error={!!errors.dateTime}
                helperText={errors.dateTime}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Venue / Place"
                fullWidth
                value={commVenue}
                onChange={(e) => {
                  setCommVenue(e.target.value);
                  clearError('commVenue');
                }}
                required
                error={!!errors.commVenue}
                helperText={errors.commVenue}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={commGuest}
                onChange={(e, newValue) => {
                  setCommGuest(newValue);
                  clearError('commGuest');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Guests and People Involved"
                    required
                    error={!!errors.commGuest}
                    helperText={errors.commGuest}
                  />
                )}
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
                  ref={fileInputRef}
                  onChange={(e) => {
                    setCommDocs(Array.from(e.target.files));
                    e.target.value = null; // reset to allow same file re-selection
                  }}
                />
              </Button>

              {commDocs.length > 0 && (
                <List dense>
                  {commDocs.map((file, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <Button
                          color="error"
                          size="small"
                          onClick={() => {
                            const updatedDocs = [...commDocs];
                            updatedDocs.splice(index, 1);
                            setCommDocs(updatedDocs);
                          }}
                        >
                          Remove
                        </Button>
                      }
                    >
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
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={commEmps}
                onChange={(e, newValue) => {
                  setCommEmps(newValue);
                  clearError('commEmps');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="COMREL Employees Involved"
                    required
                    error={!!errors.commEmps}
                    helperText={errors.commEmps}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={commBenef}
                onChange={(e, newValue) => {
                  setCommBenef(newValue);
                  clearError('commBenef');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Beneficiaries"
                    required
                    error={!!errors.commBenef}
                    helperText={errors.commBenef}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} textAlign="center">
              <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid>

          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}
