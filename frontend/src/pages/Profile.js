import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ChangePasswordModal from '../components/ChangePasswordModal';
import {
  Paper,
  Avatar,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import { User, Mail, Phone, Lock, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const getInitials = () => {
    if (!user) return '';
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <User size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          </div>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <Paper elevation={3} className="rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-8">
            <div className="flex items-center gap-6">
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#0284c7',
                  fontSize: '2.5rem',
                  fontWeight: 700,
                  border: '4px solid white',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                }}
              >
                {getInitials()}
              </Avatar>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">
                  {user?.firstName} {user?.lastName}
                </h2>
                <Chip
                  label={user?.active ? 'Active' : 'Inactive'}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  {user?.email && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">Email Address</p>
                        <p className="text-gray-800 font-semibold">{user.email}</p>
                      </div>
                    </div>
                  )}

                  {user?.phoneNumber && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">Phone Number</p>
                        <p className="text-gray-800 font-semibold">{user.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Account Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Member Since</p>
                      <p className="text-gray-800 font-semibold">
                        {formatDate(user?.createdAt)}
                      </p>
                    </div>
                  </div>

                  {user?.updatedAt !== user?.createdAt && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Calendar size={20} className="text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 font-medium">Last Updated</p>
                        <p className="text-gray-800 font-semibold">
                          {formatDate(user?.updatedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Divider />

              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Security
                </h3>
                <Button
                  variant="outlined"
                  startIcon={<Lock size={20} />}
                  onClick={() => setPasswordModalOpen(true)}
                  sx={{
                    borderColor: '#0ea5e9',
                    color: '#0ea5e9',
                    '&:hover': {
                      borderColor: '#0284c7',
                      backgroundColor: '#f0f9ff',
                    },
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                  }}
                >
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </Paper>

        <ChangePasswordModal
          open={passwordModalOpen}
          onClose={() => setPasswordModalOpen(false)}
        />
      </div>
    </Layout>
  );
};

export default Profile;
