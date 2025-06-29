import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography,
  Button,
  Stack
} from '@mui/material';

export default function UserPanel() {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    axios.get(`${config.baseApi}/users/users`) // Adjust to your backend URL
      .then(res => {
        setUsers(res.data);
      })
      .catch(err => {
        console.error("Error fetching users:", err);
      });
  }, []);

  const handleEdit =(id) => {
    const params = new URLSearchParams({id});
    window.location.replace(`/comrel/usereditpanel?${params.toString()}`);
  }

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h5" gutterBottom>User List</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>Username</strong></TableCell>
              <TableCell><strong>Position</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Updated At</strong></TableCell>
              <TableCell><strong>Active</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id_master}>
                <TableCell>{user.id_master}</TableCell>
                <TableCell>{user.emp_firstname}</TableCell>
                <TableCell>{user.emp_lastname}</TableCell>
                <TableCell>{user.user_name}</TableCell>
                <TableCell>{user.emp_position}</TableCell>
                <TableCell>{user.emp_role}</TableCell>
                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleString() : ''}</TableCell>
                <TableCell>{user.updated_at ? new Date(user.updated_at).toLocaleString() : ''}</TableCell>
                <TableCell>{user.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                    <Stack direction="row" spacing={2}>
                        <Button onClick={() => handleEdit(user.id_master)} variant="contained">Edit</Button>
                        <Button variant="contained" color="error">Delete</Button>
                    </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
