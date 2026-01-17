import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (!formData.email && !formData.phoneNumber) {
      setError('Please provide either email or phone number');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4 shadow-lg">
            <UserPlus size={32} className="text-white" />
          </div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Create Account
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Start managing your contacts today
          </Typography>
        </div>

        <Paper elevation={4} className="p-8 rounded-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                variant="outlined"
                disabled={loading}
              />
            </div>

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              helperText="Required if phone number is not provided"
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              variant="outlined"
              disabled={loading}
              placeholder="+1234567890"
              helperText="Required if email is not provided"
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Minimum 6 characters"
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              variant="outlined"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                backgroundColor: '#0ea5e9',
                '&:hover': {
                  backgroundColor: '#0284c7',
                },
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                py: 1.5,
                borderRadius: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>

            <div className="text-center pt-4">
              <Typography variant="body2" className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </Typography>
            </div>
          </form>
        </Paper>
      </div>
    </div>
  );
};

export default Register;
