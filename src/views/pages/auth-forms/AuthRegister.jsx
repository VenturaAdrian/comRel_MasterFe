import { useState } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
  Snackbar,
  Alert,
  Select,
  MenuItem
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthRegister() {
  const [empFirstName, setEmpFirstName] = useState('');
  const [empLastName, setEmpLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [empPosition, setEmpPosition] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const Register = async (e) => {
    e.preventDefault();

    if (
      !empFirstName.trim() ||
      !empLastName.trim() ||
      !userName.trim() ||
      !empPosition ||
      !empRole ||
      !password ||
      !confirmPassword
    ) {
      setSnackbarMsg("All fields are required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setSnackbarMsg("Passwords do not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.post(`${config.baseApi}/users/register`, {
        emp_firstname: empFirstName,
        emp_lastname: empLastName,
        user_name: userName,
        emp_position: empPosition,
        pass_word: password,
        emp_role: empRole
      });

      setSnackbarMsg("Registered successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Reset form
      setEmpFirstName('');
      setEmpLastName('');
      setUserName('');
      setEmpPosition('');
      setEmpRole('');
      setPassword('');
      setConfirmPassword('');

      // Optional: redirect or reload after success
      // setTimeout(() => {
      //   window.location.href = "/login";
      // }, 4000);
    } catch (error) {
      setSnackbarMsg("Registration failed. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={Register}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="First Name" value={empFirstName} onChange={(e) => setEmpFirstName(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Last Name" value={empLastName} onChange={(e) => setEmpLastName(e.target.value)} />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Username" value={userName} onChange={(e) => setUserName(e.target.value)} />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                value={empRole}
                label="Role"
                onChange={(e) => setEmpRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="user">User</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="position-label">Position</InputLabel>
              <Select
                labelId="position-label"
                value={empPosition}
                label="Position"
                onChange={(e) => setEmpPosition(e.target.value)}
              >
                <MenuItem value="encoder">Encoder</MenuItem>
                <MenuItem value="comrelofficer">Comrel Officer</MenuItem>
                <MenuItem value="comrelthree">Comrel III</MenuItem>
                <MenuItem value="comreldh">Comrel Department Head</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Password Field */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Confirm Password</InputLabel>
              <OutlinedInput
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm Password"
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button fullWidth variant="contained" type="submit" color="primary">
              Register
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}
