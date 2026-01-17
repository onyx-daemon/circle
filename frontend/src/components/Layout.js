import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu as MenuIcon,
  Users,
  User,
  LogOut,
  X
} from 'lucide-react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Box,
  Divider,
} from '@mui/material';

const Layout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Contacts', icon: <Users size={20} />, path: '/contacts' },
    { text: 'Profile', icon: <User size={20} />, path: '/profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppBar position="fixed" sx={{ backgroundColor: '#0ea5e9' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon size={24} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Circle
          </Typography>
          <div className="flex items-center gap-3">
            <Avatar
              sx={{ bgcolor: '#0284c7', width: 36, height: 36, cursor: 'pointer' }}
              onClick={() => navigate('/profile')}
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 280 }} role="presentation">
          <div className="p-6 bg-gradient-to-br from-primary-500 to-primary-700 text-white">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" className="font-semibold">
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body2" className="opacity-90">
                  {user?.email || user?.phoneNumber}
                </Typography>
              </div>
              <IconButton
                onClick={() => setDrawerOpen(false)}
                sx={{ color: 'white' }}
              >
                <X size={20} />
              </IconButton>
            </div>
          </div>

          <List sx={{ pt: 2 }}>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setDrawerOpen(false);
                }}
                selected={location.pathname === item.path}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e0f2fe',
                    borderLeft: '4px solid #0ea5e9',
                    '& .MuiListItemIcon-root': {
                      color: '#0ea5e9',
                    },
                  },
                  '&:hover': {
                    backgroundColor: '#f0f9ff',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <List>
            <ListItem
              button
              onClick={handleLogout}
              sx={{
                '&:hover': {
                  backgroundColor: '#fee2e2',
                  '& .MuiListItemIcon-root': {
                    color: '#dc2626',
                  },
                  '& .MuiListItemText-primary': {
                    color: '#dc2626',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogOut size={20} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};

export default Layout;
