import { useState} from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import AnimateButton from 'ui-component/extended/AnimateButton';

// assets
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import config from 'config';


// ===============================|| JWT - LOGIN ||=============================== //

export default function AuthLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');


 const Auth = async (e) => {
  e.preventDefault();
  setLoginError('');
  try {
    const response = await axios.get(`${config.baseApi}/users/login`, {
      params: {
        user_name: username,
        password: password
      }
    });

    if (!response.data.error) {
      console.log("Login success:", response.data);
      console.log('User_Role: ', response.data.role);
      localStorage.setItem('user', JSON.stringify(response.data));
        if( response.data.role === 'user') {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        
      
      localStorage.setItem('status', JSON.stringify([{ id: 0, value: 'Login' }]));
      window.location.replace(`${config.baseUrl}/comrel/dashboard/default`);

    } else {
      console.warn("Login failed:", response.data.message || "Unknown error");
      setLoginError(response.data.message || "Incorrect username or password");
    }

  } catch (err) {
    console.error("Login error:", err);
    if (err.response && err.response.status === 404) {
      setLoginError("No user found.");
    } else {
      setLoginError("An error occurred. Please try again.");
    }
  }
};


  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
    <form onSubmit={Auth} >
      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
        <OutlinedInput 
          id="outlined-adornment-email-login" 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)} 
          name="username" 
          inputProps={{}} 
        />
      </FormControl>

      <FormControl fullWidth sx={{ ...theme.typography.customInput }}>
        <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password-login"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                size="large"
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          inputProps={{}}
          label="Password"
        />
      </FormControl>

      <Box sx={{ mt: 2 }}>
        
          <Button  fullWidth size="large" type="submit" variant="contained" 
          sx={{
    backgroundColor: theme.palette.green.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark
    }
  }} 
 
          >
            Sign In
          </Button>
        
      </Box>

      {loginError && (
        <Grid container direction="column" sx={{ alignItems: 'center'}}>
        <Box sx={{ mt: 2, color: 'error.main', alignItems: 'center' }} >
          <Typography variant="body2" color="error">
            {loginError}
          </Typography>
        </Box>
        </Grid>
      )}
    </form>
    </div>
  );
}
