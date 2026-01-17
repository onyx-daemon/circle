import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { X, Eye, EyeOff } from 'lucide-react';

const ChangePasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { changePassword } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setError('');
    setSuccess(false);
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle className="flex items-center justify-between border-b pb-4">
        <span className="text-2xl font-bold text-gray-800">Change Password</span>
        <IconButton onClick={handleClose} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-5 pt-6">
          {error && (
            <Alert severity="error" className="rounded-lg">
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" className="rounded-lg">
              Password changed successfully!
            </Alert>
          )}

          <TextField
            fullWidth
            label="Current Password"
            name="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={handleChange}
            required
            disabled={loading || success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                  >
                    {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={handleChange}
            required
            disabled={loading || success}
            helperText="Minimum 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                  >
                    {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading || success}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                  >
                    {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions className="border-t px-6 py-4">
          <Button
            onClick={handleClose}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || success}
            sx={{
              backgroundColor: '#0ea5e9',
              '&:hover': {
                backgroundColor: '#0284c7',
              },
              textTransform: 'none',
              fontWeight: 600,
              px: 3,
            }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Update Password'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ChangePasswordModal;
