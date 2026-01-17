import { useState, useEffect } from 'react';
import { contactAPI } from '../services/api';
import Layout from '../components/Layout';
import ContactCard from '../components/ContactCard';
import ContactModal from '../components/ContactModal';
import DeleteConfirmDialog from '../components/DeleteConfirmDialog';
import {
  TextField,
  Button,
  Pagination,
  CircularProgress,
  Alert,
  InputAdornment,
  Fab,
} from '@mui/material';
import { Search, Plus, Users } from 'lucide-react';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [page, searchQuery]);

  const fetchContacts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = searchQuery
        ? await contactAPI.search(searchQuery, page, 9)
        : await contactAPI.getAll(page, 9);

      setContacts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleCreateContact = () => {
    setSelectedContact(null);
    setModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await contactAPI.delete(selectedContact.id);
      setDeleteDialogOpen(false);
      setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contact');
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setModalOpen(false);
    setSelectedContact(null);
    if (shouldRefresh) {
      fetchContacts();
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Users size={32} className="text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Contacts</h1>
          </div>
          <p className="text-gray-600">Manage and organize your contacts</p>
        </div>

        <div className="mb-6">
          <TextField
            fullWidth
            placeholder="Search by first name or last name..."
            value={searchQuery}
            onChange={handleSearchChange}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} className="text-gray-400" />
                </InputAdornment>
              ),
            }}
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#0ea5e9',
                },
              },
            }}
          />
        </div>

        {error && (
          <Alert severity="error" className="mb-6 rounded-lg">
            {error}
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <CircularProgress />
          </div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? 'No contacts found' : 'No contacts yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start by adding your first contact'}
            </p>
            {!searchQuery && (
              <Button
                variant="contained"
                startIcon={<Plus size={20} />}
                onClick={handleCreateContact}
                sx={{
                  backgroundColor: '#0ea5e9',
                  '&:hover': {
                    backgroundColor: '#0284c7',
                  },
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                }}
              >
                Add Contact
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  count={totalPages}
                  page={page + 1}
                  onChange={(e, value) => setPage(value - 1)}
                  color="primary"
                  size="large"
                />
              </div>
            )}
          </>
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreateContact}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            backgroundColor: '#0ea5e9',
            '&:hover': {
              backgroundColor: '#0284c7',
            },
          }}
        >
          <Plus size={24} />
        </Fab>

        <ContactModal
          open={modalOpen}
          contact={selectedContact}
          onClose={handleModalClose}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          contact={selectedContact}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </Layout>
  );
};

export default Contacts;
