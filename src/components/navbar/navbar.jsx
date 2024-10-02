import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Navbar({ open, handleDrawerOpen }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Flone
        </Typography>

        {/* Search Input with Custom Color */}
        <TextField
          placeholder="Search"
          variant="outlined"
          size="small"
          sx={{
            width: { xs: '6rem', md: 'auto' },
            marginRight: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', // Change border color
              },
              '&:hover fieldset': {
                borderColor: 'white', // Change hover border color
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white', // Change focused border color
              },
            },
            '& .MuiInputBase-input': {
              color: 'white', // Change text color
            },
          }}
          InputLabelProps={{
            style: { color: 'white' }, // Change placeholder color
          }}
        />

        {/* Avatar Dropdown */}
        <IconButton onClick={handleMenuOpen} color="inherit">
          <Avatar
            alt="User Avatar"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleMenuClose}
          PaperProps={{ elevation: 3 }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <MenuItem onClick={handleMenuClose}>
            Profile <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>New</span>
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
          <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
