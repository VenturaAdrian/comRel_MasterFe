import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  Paper,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid2';
export default function Review() {
  const requestID = new URLSearchParams(window.location.search).get('id');
  const [formData, setFormData] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
          params: { id: requestID }
        });
        setFormData(requestRes.data);

        const commentsRes = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
        setComments(commentsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    if (requestID) fetchData();

    const empInfo = JSON.parse(localStorage.getItem('user'));
    if (empInfo?.user_name) setCurrentUser(empInfo.user_name);
  }, [requestID]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.baseApi1}/request/comment`, {
        comment,
        created_by: currentUser,
        request_id: requestID
      });

      setComment('');
      const res = await axios.get(`${config.baseApi1}/request/comment/${requestID}`);
      setComments(res.data);

      await axios.post(`${config.baseApi1}/request/comment-decline`, {
        request_status: 'Reviewed',
        request_id: requestID,
        currentUser
      });

      const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      });
      setFormData(requestRes.data);
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleDecline = () => setShowComments(true);
  const handleDelete = () => setShowDeleteConfirm(true);

  const confirmDelete = async () => {
    try {
      await axios.get(`${config.baseApi1}/request/delete-request`, {
        params: {
          request_id: requestID,
          comm_Docs: formData.comm_Docs
        }
      });
      alert('Request deleted successfully.');
      window.history.back();
    } catch (err) {
      console.error('Failed to delete request:', err);
      alert('Failed to delete this request');
    }
  };

  const handleAccept = async () => {
    try {
      const res = await axios.post(`${config.baseApi1}/request/accept`, {
        request_status: 'Accepted',
        request_id: requestID,
        currentUser
      });

      alert(res.data.message || 'Request accepted successfully.');

      const requestRes = await axios.get(`${config.baseApi1}/request/editform`, {
        params: { id: requestID }
      });
      setFormData(requestRes.data);
    } catch (err) {
      console.error('Failed to accept request:', err);
      alert('Failed to accept this request.');
    }
  };

  const handleEdit = () => {
    const params = new URLSearchParams({ id: requestID });
    window.location.replace(`/comrel/edit?${params.toString()}`);
  };

  

  return (
    <Box sx={{ p: 3  ,mt:4, background: 'linear-gradient(to bottom, #ffdc73, #ffcf40, #ffbf00', borderRadius: 2, boxShadow: 3 }}>
      

      {formData ? (
        <Card variant="outlined" sx={{ mb: 3, position: 'relative' }}>
          {/* Top-right buttons */}
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton onClick={handleEdit} sx={{ color: 'green' }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleDelete} sx={{ color: 'red' }}>
              <DeleteIcon />
            </IconButton>
          </Box>

          <CardContent>
            <Grid size={8}> 
            <Typography textAlign="center" fontWeight="bold" fontSize={24}>
              Request ID: {formData.request_id}
            </Typography>
            <Divider sx={{ my: 2 }} />
    </Grid>
            <Typography><strong>Status:</strong> {formData.request_status}</Typography>
            <Typography><strong>Community:</strong> {formData.comm_Area}</Typography>
            <Typography><strong>Activity:</strong> {formData.comm_Act}</Typography>
            <Typography><strong>Date/Time:</strong> {formData.date_Time}</Typography>
            <Typography><strong>Venue:</strong> {formData.comm_Venue}</Typography>
            <Typography><strong>Guests:</strong> {formData.comm_Guest}</Typography>
            <Typography><strong>Employees:</strong> {formData.comm_Emps}</Typography>
            <Typography><strong>Beneficiaries:</strong> {formData.comm_Benef}</Typography>

            {formData.comm_Docs && (
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>Supporting Documents:</Typography>
                <Box display="flex" flexWrap="wrap" gap={2}>
                  {formData.comm_Docs.split(',').map((file, index) => {
                    const fileTrimmed = file.trim();
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileTrimmed);
                    const fileUrl = `${config.baseApi1}/files/${fileTrimmed}`;
                    const fallbackUrl = `${config.baseApi1}/files/request_${formData.request_id}/images/${fileTrimmed}`;

                    return (
                      <Box
                        key={index}
                        sx={{
                          width: 'calc(25% - 16px)',
                          border: '1px solid #ccc',
                          p: 1,
                          borderRadius: 1,
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        {isImage ? (
                          <img
                            src={fileUrl}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackUrl;
                            }}
                            alt={`Document ${index + 1}`}
                            style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 4 }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: '150px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              backgroundColor: '#f5f5f5',
                              borderRadius: 1
                            }}
                          >
                            <Typography variant="body2" color="text.secondary">
                              {fileTrimmed.split('.').pop().toUpperCase()} File
                            </Typography>
                          </Box>
                        )}
                        <Typography
                          variant="body2"
                          sx={{ mt: 1, wordBreak: 'break-word' }}
                          noWrap
                          title={fileTrimmed}
                        >
                          {fileTrimmed}
                        </Typography>
                        <Button
                          size="small"
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        >
                          View
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      ) : (
        <Typography>Loading request data...</Typography>
      )}

      {/* Comments Section */}
      <Box>
        <Typography variant="h6">All Comments</Typography>
        <Divider sx={{ my: 1 }} />
        {comments.length > 0 ? (
          comments.map((cmt) => (
            <Paper key={cmt.comment_id} variant="outlined" sx={{ mb: 1, p: 1.5 }}>
              <Typography variant="subtitle2">{cmt.created_by}</Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(cmt.created_at).toLocaleString()}
              </Typography>
              <Typography>{cmt.comment}</Typography>
            </Paper>
          ))
        ) : (
          <Typography>No comments yet.</Typography>
        )}
      </Box>

      {showComments && (
        <Box mt={2}>
          <TextField
            label="Comment / Feedback"
            fullWidth
            multiline
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleCommentSubmit}
            sx={{ mt: 1 }}
          >
            Submit Comment
          </Button>
        </Box>
      )}

      {/* Action Buttons */}
      <Box mt={3} display="flex" gap={2} flexWrap="wrap" sx={{ alignItems: 'center', justifyContent: 'center' }}>
        <Button variant="contained" color="error" onClick={handleDecline}>Decline</Button>
        <Button variant="contained" color="primary" onClick={handleAccept}>Accept</Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this request? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions >
          <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
