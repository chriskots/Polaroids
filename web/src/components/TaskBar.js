import React, { useState } from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Button,
  InputBase,
  Menu,
  MenuItem,
  IconButton,
  Badge
} from '@material-ui/core';
import {
  Search,
  Notifications,
  Chat,
  AccountCircle,
  MoreVert
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  homeButton: {
    color: 'inherit',
    fontSize: '0.8rem'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.2)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBaseRoot: {
    color: 'priamry'
  },
  inputBaseInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
}));

export default function TaskBar() {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  //This function is a handler to make the scrollbar go back to the top of the screen
  const handleGoToTop = () => {
    console.log('to top');
  };

  //This function is a handler for when the user clicks the enter key to use the search functionality
  const handleSearch = event => {
    if (event.key === 'Enter') {
      //Add search functionality here
      console.log(`search ${searchInput} here`);
    }
  };

  //This function is a handler for when the mobile menu is closed
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  //This function is a handler for when the menu is closed
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  //This function is a handler for when the profile button is selected on the menu
  const handleProfileMenuOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  //This is a handler for when the mobile menu is opened
  const handleMobileMenuOpen = event => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        id={menuId}
        keepMounted
        getContentAnchorEl={null}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleMenuClose}>Logoff</MenuItem>
        <MenuItem onClick={handleMenuClose}>Privacy / Terms</MenuItem>
      </Menu>
    );
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = () => {
    return (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        id={mobileMenuId}
        keepMounted
        getContentAnchorEl={null}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton aria-label="messages" color="inherit">
            <Badge badgeContent={4} color="secondary">
              <Chat />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton aria-label="notifications" color="inherit">
            <Badge badgeContent={11} color="secondary">
              <Notifications />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleProfileMenuOpen}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );
  };

  return (
    <>
      <AppBar color="inherit">
        <Toolbar className={classes.flexCenter}>
          <Button
            type="submit"
            onClick={() => {
              handleGoToTop();
            }}
            className={classes.homeButton}
          >
            Polaroids
          </Button>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <Search />
            </div>
            <InputBase
              placeholder="Search"
              classes={{
                root: classes.inputBaseRoot,
                input: classes.inputBaseInput
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={searchInput}
              onChange={event => {
                setSearchInput(event.target.value);
              }}
              onKeyPress={event => handleSearch(event)}
            />
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton aria-label="messages" color="inherit">
              <Badge badgeContent={4} color="secondary">
                <Chat />
              </Badge>
            </IconButton>
            <IconButton aria-label="notifications" color="inherit">
              <Badge badgeContent={17} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreVert />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu()}
      {renderMenu()}
    </>
  );
}
