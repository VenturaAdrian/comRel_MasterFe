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
  Divider
} from '@mui/material';

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
      handleBack();
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
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Review Page</Typography>

      {formData ? (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography>ID: {formData.request_id}</Typography>
            <Typography>Status: {formData.request_status}</Typography>
            <Typography>Community: {formData.comm_Area}</Typography>
            <Typography>Activity: {formData.comm_Act}</Typography>
            <Typography>Date/Time: {formData.date_Time}</Typography>
            <Typography>Venue: {formData.comm_Venue}</Typography>
            <Typography>Guests: {formData.comm_Guest}</Typography>
            <Typography>Employees: {formData.comm_Emps}</Typography>
            <Typography>Beneficiaries: {formData.comm_Benef}</Typography>

            {/* Simplified File Display */}
            {formData.comm_Docs && (
              <Box mt={2}>
                <Typography variant="subtitle1" gutterBottom>Supporting Documents:</Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {formData.comm_Docs.split(',').map((file, index) => {
                    const fileTrimmed = file.trim();
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileTrimmed);
                    const fileUrl = `${config.baseApi1}/files/${fileTrimmed}`;
                    const fallbackUrl = `${config.baseApi1}/files/request_${formData.request_id}/images/${fileTrimmed}`;

                    return (
                      <Box key={index} sx={{ border: '1px solid #ccc', p: 1.5, borderRadius: 1 }}>
                        {isImage ? (
                          <img
                            src={fileUrl}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = fallbackUrl;
                            }}
                            alt={`Document ${index + 1}`}
                            style={{ width: '100%', maxWidth: 300, borderRadius: 6 }}
                          />
                        ) : (
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" noWrap sx={{ maxWidth: '70%' }}>
                              {fileTrimmed}
                            </Typography>
                            <Button
                              size="small"
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="outlined"
                            >
                              View
                            </Button>
                          </Box>
                        )}
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

      {/* Actions */}
      <Box mt={3} display="flex" gap={2} flexWrap="wrap">
        <Button variant="contained" color="warning" onClick={handleDecline}>Decline</Button>
        <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        <Button variant="contained" color="success" onClick={handleAccept}>Accept</Button>
        <Button variant="contained" color="primary" onClick={handleEdit}>Edit</Button>
      </Box>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <Paper sx={{ mt: 2, p: 2 }} elevation={2}>
          <Typography>Are you sure you want to delete this request?</Typography>
          <Box mt={1} display="flex" gap={2}>
            <Button variant="contained" color="error" onClick={confirmDelete}>Yes</Button>
            <Button variant="outlined" onClick={() => setShowDeleteConfirm(false)}>No</Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
