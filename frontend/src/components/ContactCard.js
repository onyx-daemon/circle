import { Card, CardContent, IconButton, Chip, Avatar } from '@mui/material';
import { Mail, Phone, Edit, Trash2, Briefcase } from 'lucide-react';

const ContactCard = ({ contact, onEdit, onDelete }) => {
  const getInitials = () => {
    return `${contact.firstName[0]}${contact.lastName[0]}`.toUpperCase();
  };

  const getRandomColor = () => {
    const colors = ['#0ea5e9', '#0284c7', '#0369a1', '#075985'];
    return colors[contact.id % colors.length];
  };

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 rounded-xl border border-gray-100"
      sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardContent className="flex-1 p-6">
        <div className="flex items-start justify-between mb-4">
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: getRandomColor(),
              fontSize: '1.25rem',
              fontWeight: 600,
            }}
          >
            {getInitials()}
          </Avatar>
          <div className="flex gap-1">
            <IconButton
              size="small"
              onClick={() => onEdit(contact)}
              sx={{
                color: '#0ea5e9',
                '&:hover': {
                  backgroundColor: '#e0f2fe',
                },
              }}
            >
              <Edit size={18} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(contact)}
              sx={{
                color: '#ef4444',
                '&:hover': {
                  backgroundColor: '#fee2e2',
                },
              }}
            >
              <Trash2 size={18} />
            </IconButton>
          </div>
        </div>

        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-1">
            {contact.firstName} {contact.lastName}
          </h3>
          {contact.title && (
            <div className="flex items-center gap-2 text-gray-600">
              <Briefcase size={14} />
              <span className="text-sm">{contact.title}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {contact.emails && contact.emails.length > 0 && (
            <div className="space-y-2">
              {contact.emails.slice(0, 2).map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Mail size={16} className="text-primary-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {email.email}
                  </span>
                  <Chip
                    label={email.type}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                    }}
                  />
                </div>
              ))}
              {contact.emails.length > 2 && (
                <span className="text-xs text-gray-500 ml-6">
                  +{contact.emails.length - 2} more
                </span>
              )}
            </div>
          )}

          {contact.phones && contact.phones.length > 0 && (
            <div className="space-y-2">
              {contact.phones.slice(0, 2).map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Phone size={16} className="text-primary-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">
                    {phone.phoneNumber}
                  </span>
                  <Chip
                    label={phone.type}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      backgroundColor: '#e0f2fe',
                      color: '#0369a1',
                    }}
                  />
                </div>
              ))}
              {contact.phones.length > 2 && (
                <span className="text-xs text-gray-500 ml-6">
                  +{contact.phones.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
