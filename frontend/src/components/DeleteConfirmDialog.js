import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmDialog = ({ open, contact, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogContent className="text-center pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <AlertTriangle size={32} className="text-red-600" />
        </div>
        <DialogTitle className="px-0 pt-0 pb-2">
          <span className="text-2xl font-bold text-gray-800">Delete Contact?</span>
        </DialogTitle>
        <Typography variant="body1" className="text-gray-600 mb-2">
          Are you sure you want to delete{' '}
          <span className="font-semibold">
            {contact?.firstName} {contact?.lastName}
          </span>
          ?
        </Typography>
        <Typography variant="body2" className="text-gray-500">
          This action cannot be undone.
        </Typography>
      </DialogContent>

      <DialogActions className="border-t px-6 py-4 justify-center gap-2">
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#d1d5db',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
            px: 4,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            backgroundColor: '#ef4444',
            '&:hover': {
              backgroundColor: '#dc2626',
            },
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
          }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
