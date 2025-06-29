import axios from "axios";
import config from "config";
import { useEffect, useState, useRef } from "react";
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
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";

const barangayOptions = [
  'Balili', 'Bedbed', 'Bulalacao', 'Cabiten', 'Colalo', 'Guinaoang',
  'Paco', 'Palasaan', 'Poblacion', 'Sapid', 'Tabio', 'Taneg'
];

const activityOptions = [
  'Medical Mission', 'Reach Out', 'Feeding Program',
  'Rescue', 'Rehabilitation', 'Ayuda'
];

export default function EditForm() {
  const params = new URLSearchParams(window.location.search);
  const requestID = params.get("id");

  const [formData, setFormData] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [createdby, setCreatedBy] = useState("");
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const [status, setStatus] = useState('');
  const [info, setInfo] = useState('');
  const [position, setPosition] = useState('');
  useEffect(() => {
    if (requestID) {
      axios
        .get(`${config.baseApi1}/request/editform`, {
          params: { id: requestID }
        })
        .then((response) => {
          const data = response.data || {};
          
          setFormData({
            ...data,
            comm_Area: data.comm_Area?.split(",").map((x) => x.trim()) || [],
            comm_Guest: data.comm_Guest?.split(",").map((x) => x.trim()) || [],
            comm_Emps: data.comm_Emps?.split(",").map((x) => x.trim()) || [],
            comm_Benef: data.comm_Benef?.split(",").map((x) => x.trim()) || [],
          });
          setInfo(data.request_status);
        })
        .catch((error) => {
          console.error("Error fetching request data:", error);
        });

        
        
    }

    const empInfo = JSON.parse(localStorage.getItem("user"));
    if (empInfo?.user_name) {
      setCreatedBy(empInfo.user_name);
      setPosition(empInfo.emp_position);
    }
    
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);
    if (newFiles.length > 0) {
      setErrors((prev) => ({ ...prev, comm_Docs: false }));
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const validateFields = () => {
    const newErrors = {};
    if (!formData.comm_Area || formData.comm_Area.length === 0) newErrors.comm_Area = true;
    if (!formData.comm_Act) newErrors.comm_Act = true;
    if (!formData.date_Time) newErrors.date_Time = true;
    if (!formData.comm_Venue) newErrors.comm_Venue = true;
    if (!formData.comm_Guest || formData.comm_Guest.length === 0) newErrors.comm_Guest = true;
    if (!formData.comm_Emps || formData.comm_Emps.length === 0) newErrors.comm_Emps = true;
    if (!formData.comm_Benef || formData.comm_Benef.length === 0) newErrors.comm_Benef = true;
    return newErrors;
  };

  const handleSave = () => {
    const validationErrors = validateFields();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;


    // ✅ Determine status before FormData
  let updatedStatus = status;
  if (position === 'encoder') {
    updatedStatus = 'request';
  } else if (position === 'comrelofficer') {
    updatedStatus = 'reviewed';
  } else if (position === 'comrelthree' || position === 'comreldh') {
    updatedStatus = info; // fallback to existing status from DB
  }

    const data = new FormData();

    data.append("request_id", requestID);
    data.append("comm_Area", formData.comm_Area.join(", "));
    data.append("comm_Act", formData.comm_Act);
    data.append("date_Time", formData.date_Time);
    data.append("comm_Venue", formData.comm_Venue);
    data.append("comm_Guest", formData.comm_Guest.join(", "));
    data.append("comm_Emps", formData.comm_Emps.join(", "));
    data.append("comm_Benef", formData.comm_Benef.join(", "));
    data.append("created_by", createdby);
    data.append("emp_position", position);
    data.append("request_status", updatedStatus)

    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => data.append("comm_Docs", file));
    } else {
      data.append("existingFileName", formData.comm_Docs);
    }

    

    axios.post(`${config.baseApi1}/request/updateform`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        window.location.replace('/comrel/pending')
        alert("Request updated successfully!");
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Failed to update request.");
      });
  };

  if (!formData) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ mt: 4, p: 2, background: 'linear-gradient(to bottom, #93c47d, #6aa84f, #2F5D0B)', minHeight: '100vh' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: "auto", mt: 2, mb: 2 }}>
        <Typography variant="h5" mb={2} textAlign="center">
          Edit Request ID: {requestID}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={barangayOptions}
              value={formData.comm_Area}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Area: val }));
                setErrors((prev) => ({ ...prev, comm_Area: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Community Area / Barangay"
                  error={!!errors.comm_Area}
                  helperText={errors.comm_Area ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              options={activityOptions}
              value={formData.comm_Act}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Act: val || '' }));
                setErrors((prev) => ({ ...prev, comm_Act: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type of Community Activity"
                  error={!!errors.comm_Act}
                  helperText={errors.comm_Act ? "Required" : ""}
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
              value={formData.date_Time}
              name="date_Time"
              onChange={handleChange}
              error={!!errors.date_Time}
              helperText={errors.date_Time ? "Required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Venue / Place"
              fullWidth
              name="comm_Venue"
              value={formData.comm_Venue}
              onChange={handleChange}
              error={!!errors.comm_Venue}
              helperText={errors.comm_Venue ? "Required" : ""}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.comm_Guest}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Guest: val }));
                setErrors((prev) => ({ ...prev, comm_Guest: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Guests and People Involved"
                  error={!!errors.comm_Guest}
                  helperText={errors.comm_Guest ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <InputLabel shrink>Replace Supporting Documents</InputLabel>
            <Button variant="contained" component="label">
              Upload Files
              <input
                type="file"
                hidden
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </Button>

            {formData.comm_Docs && selectedFiles.length === 0 && (
              <Typography variant="body2" mt={1}>
                Current Files: {formData.comm_Docs}
              </Typography>
            )}

            {selectedFiles.length > 0 && (
              <List dense>
                {selectedFiles.map((file, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <Button
                        color="error"
                        size="small"
                        onClick={() => handleRemoveFile(index)}
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
              value={formData.comm_Emps}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Emps: val }));
                setErrors((prev) => ({ ...prev, comm_Emps: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="COMREL Employees Involved"
                  error={!!errors.comm_Emps}
                  helperText={errors.comm_Emps ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={formData.comm_Benef}
              onChange={(e, val) => {
                setFormData((prev) => ({ ...prev, comm_Benef: val }));
                setErrors((prev) => ({ ...prev, comm_Benef: false }));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Beneficiaries"
                  error={!!errors.comm_Benef}
                  helperText={errors.comm_Benef ? "Required" : ""}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} textAlign="center">
            <Button variant="contained" onClick={handleSave} sx={{ mr: 2 }}>
              SAVE
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
