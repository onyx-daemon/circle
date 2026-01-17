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
import { Eye, EyeOff, Users } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/contacts');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-full mb-4 shadow-lg">
            <Users size={32} className="text-white" />
          </div>
          <Typography variant="h4" className="font-bold text-gray-800 mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Sign in to manage your contacts
          </Typography>
        </div>

        <Paper elevation={4} className="p-8 rounded-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert severity="error" className="rounded-lg">
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Email or Phone Number"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              variant="outlined"
              autoComplete="username"
              disabled={loading}
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
              autoComplete="current-password"
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
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>

            <div className="text-center pt-4">
              <Typography variant="body2" className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Sign Up
                </Link>
              </Typography>
            </div>
          </form>
        </Paper>

        <div className="text-center mt-6">
          <Typography variant="body2" className="text-gray-500">
            Secure contact management for everyone
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
