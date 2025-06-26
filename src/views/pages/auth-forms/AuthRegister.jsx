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
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => event.preventDefault();

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

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
      setDialogMessage("All fields are required.");
      setDialogOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setDialogMessage("Passwords do not match.");
      setDialogOpen(true);
      return;
    }

    try {
      await axios.post(`${config.baseApi1}/request/register`, {
        emp_firstname: empFirstName,
        emp_lastname: empLastName,
        user_name: userName,
        emp_position: empPosition,
        pass_word: password,
        emp_role: empRole
      });
      

      
    } catch (error) {
      setDialogMessage("Registration failed. Please try again.");
      setDialogOpen(true);
    }
        setDialogMessage("Registered successfully!");
        setDialogOpen(true);

        // Reset form
        setEmpFirstName('');
        setEmpLastName('');
        setUserName('');
        setEmpPosition('');
        setEmpRole('');
        setPassword('');
        setConfirmPassword('');
        
      window.location.reload();

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

      {/* Dialog for messages */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Registration</DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
