import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { X, Plus, Trash2 } from 'lucide-react';

const ContactModal = ({ open, contact, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    title: '',
    emails: [{ email: '', type: 'WORK' }],
    phones: [{ phoneNumber: '', type: 'WORK' }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData({
        firstName: contact.firstName || '',
        lastName: contact.lastName || '',
        title: contact.title || '',
        emails: contact.emails.length > 0 ? contact.emails : [{ email: '', type: 'WORK' }],
        phones: contact.phones.length > 0 ? contact.phones : [{ phoneNumber: '', type: 'WORK' }],
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        title: '',
        emails: [{ email: '', type: 'WORK' }],
        phones: [{ phoneNumber: '', type: 'WORK' }],
      });
    }
    setError('');
  }, [contact, open]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEmailChange = (index, field, value) => {
    const newEmails = [...formData.emails];
    newEmails[index][field] = value;
    setFormData({ ...formData, emails: newEmails });
  };

  const handlePhoneChange = (index, field, value) => {
    const newPhones = [...formData.phones];
    newPhones[index][field] = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const addEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { email: '', type: 'WORK' }],
    });
  };

  const removeEmail = (index) => {
    if (formData.emails.length > 1) {
      const newEmails = formData.emails.filter((_, i) => i !== index);
      setFormData({ ...formData, emails: newEmails });
    }
  };

  const addPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, { phoneNumber: '', type: 'WORK' }],
    });
  };

  const removePhone = (index) => {
    if (formData.phones.length > 1) {
      const newPhones = formData.phones.filter((_, i) => i !== index);
      setFormData({ ...formData, phones: newPhones });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSubmit = {
        ...formData,
        emails: formData.emails.filter(e => e.email.trim() !== ''),
        phones: formData.phones.filter(p => p.phoneNumber.trim() !== ''),
      };

      if (contact) {
        await contactAPI.update(contact.id, dataToSubmit);
      } else {
        await contactAPI.create(dataToSubmit);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle className="flex items-center justify-between border-b pb-4">
        <span className="text-2xl font-bold text-gray-800">
          {contact ? 'Edit Contact' : 'New Contact'}
        </span>
        <IconButton onClick={() => onClose(false)} size="small">
          <X size={20} />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-6 pt-6">
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
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            disabled={loading}
            placeholder="e.g., Software Engineer"
          />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Email Addresses</h4>
              <Button
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addEmail}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                Add Email
              </Button>
            </div>
            <div className="space-y-3">
              {formData.emails.map((email, index) => (
                <div key={index} className="flex gap-2">
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email.email}
                    onChange={(e) => handleEmailChange(index, 'email', e.target.value)}
                    disabled={loading}
                  />
                  <TextField
                    select
                    label="Type"
                    value={email.type}
                    onChange={(e) => handleEmailChange(index, 'type', e.target.value)}
                    disabled={loading}
                    sx={{ width: 140 }}
                  >
                    <MenuItem value="WORK">Work</MenuItem>
                    <MenuItem value="PERSONAL">Personal</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </TextField>
                  <IconButton
                    onClick={() => removeEmail(index)}
                    disabled={formData.emails.length === 1 || loading}
                    color="error"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-700">Phone Numbers</h4>
              <Button
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addPhone}
                disabled={loading}
                sx={{ textTransform: 'none' }}
              >
                Add Phone
              </Button>
            </div>
            <div className="space-y-3">
              {formData.phones.map((phone, index) => (
                <div key={index} className="flex gap-2">
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone.phoneNumber}
                    onChange={(e) => handlePhoneChange(index, 'phoneNumber', e.target.value)}
                    disabled={loading}
                    placeholder="+1234567890"
                  />
                  <TextField
                    select
                    label="Type"
                    value={phone.type}
                    onChange={(e) => handlePhoneChange(index, 'type', e.target.value)}
                    disabled={loading}
                    sx={{ width: 140 }}
                  >
                    <MenuItem value="WORK">Work</MenuItem>
                    <MenuItem value="HOME">Home</MenuItem>
                    <MenuItem value="PERSONAL">Personal</MenuItem>
                    <MenuItem value="OTHER">Other</MenuItem>
                  </TextField>
                  <IconButton
                    onClick={() => removePhone(index)}
                    disabled={formData.phones.length === 1 || loading}
                    color="error"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>

        <DialogActions className="border-t px-6 py-4">
          <Button
            onClick={() => onClose(false)}
            disabled={loading}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
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
            {loading ? <CircularProgress size={20} color="inherit" /> : 'Save Contact'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ContactModal;
