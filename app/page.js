'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Button, Modal, TextField, AppBar, Toolbar, IconButton, Container, Paper } from '@mui/material'
import { firestore } from './firebase'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { green, purple } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  borderRadius: 2,
}

const theme = createTheme({
  palette: {
    primary: {
      main: purple[500],
    },
    secondary: {
      main: green[500],
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
        gap={2}
        sx={{ backgroundColor: '#e8f5e9' }}
      >
        <AppBar position="static" color="primary">
          <Toolbar>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 , display: 'flex', justifyContent: 'center', fontSize: '2rem'}}>
              Pantry Tracker
            </Typography>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="md" sx={{ mt: 4 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={2} sx={{ marginBottom: 2 }}>
              <TextField
                id="search-bar"
                label="Search Items"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flexGrow: 1 }}
              />
              <Button variant="contained" onClick={handleOpen} startIcon={<AddIcon />}>
                Add Item
              </Button>
            </Box>
            
            <Box border="1px solid #333" borderRadius={2}>
              <Box
                width="100%"
                height="60px"
                bgcolor="#ADD8E6"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderTopLeftRadius={2}
                borderTopRightRadius={2}
              >
                <Typography variant="h2" color="#333" textAlign="center">
                  Inventory Items
                </Typography>
              </Box>
              <Stack width="100%" height="300px" spacing={2} overflow="auto" sx={{ p: 2 }}>
                {filteredInventory.map(({ name, quantity }) => (
                  <Box
                    key={name}
                    width="100%"
                    minHeight="80px"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    bgcolor="#f0f0f0"
                    paddingX={5}
                    borderRadius={1}
                    boxShadow={1}
                  >
                    <Typography variant="h3" color="#333" textAlign="center">
                      {name.charAt(0).toUpperCase() + name.slice(1)}
                    </Typography>
                    <Typography variant="h3" color="#333" textAlign="center">
                      Quantity: {quantity}
                    </Typography>
                    <Button variant="contained" color="secondary" onClick={() => removeItem(name)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>
        </Container>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                id="outlined-basic"
                label="Item"
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </ThemeProvider>
  );
}
