import { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Button,
  InputBase,
  Popover,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Avatar,
} from '@material-ui/core';
import {
  Search,
  Notifications,
  NotificationsNoneOutlined,
  Chat,
  ChatOutlined,
  AccountCircle,
  AccountCircleOutlined,
  MoreVert,
} from '@material-ui/icons';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  flexCenter: {
    display: 'flex',
    justifyContent: 'center',
  },
  homeButton: {
    color: 'inherit',
    fontSize: '0.6rem',
    [theme.breakpoints.up('sm')]: {
      fontSize: '0.8rem',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.black, 0.2),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameSearch: {
    padding: theme.spacing(0.5, 1, 0.5, 7),
    width: '150px',
    [theme.breakpoints.up('md')]: {
      width: '200px',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

function TaskBar(props) {
  const classes = useStyles();
  const userProfile = props.userProfile;
  const [searchInput, setSearchInput] = useState('');
  const [usernameSearchAnchorEl, setUsernameSearchAnchorEl] = useState(null);
  const isUsernameSearchOpen = Boolean(usernameSearchAnchorEl);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notificationsOpenAnchorEl, setNotificationsOpenAnchorEl] = useState(null);
  const isNotificationsOpen = Boolean(notificationsOpenAnchorEl);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const [usernameSearchResults, setUsernameSearchResults] = useState([]);

  //User on the messages page
  if (
    window.location.href.substring(
      window.location.href.lastIndexOf('/') + 1
    ) === 'messages' &&
    messagesOpen === false
  ) {
    setMessagesOpen(true);
  }

  //Make the scrollbar go to the top of the HomePage screen
  const handleGoToTop = () => {
    props.history.push('/');
    window.scrollTo(0, 0);
  };

  //Handle search within firebase here (when the user enters any value it should filter the usernames. This will need to use algolia)
  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      usernameSearch(searchInput)
      .then((r) => {
        setUsernameSearchResults(r);
      });
      setUsernameSearchAnchorEl(event.currentTarget);
    }
  };

  //Close username search
  const handleCloseUsernameSearch = () => {
    setUsernameSearchAnchorEl(null);
  };

  //Open messages
  const handleMessages = () => {
    setMessagesOpen(!messagesOpen);
    props.history.push('/messages');
  };

  //Open notifications
  const handleNotifications = (event) => {
    setNotificationsOpenAnchorEl(event.currentTarget);
  };

  const handleRemoveNotification = (item) => {
    removeNotification(item);
  }

  //Notifications Menu is closed
  const handleNotificationsMenuClose = () => {
    setNotificationsOpenAnchorEl(null);
  };

  //Mobile menu is closed
  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  //Menu is closed
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  //Open user profile menu
  const handleUserProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  //Mobile menu is opened
  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  //Open user profile
  const handleUserProfile = () => {
    props.history.push(`/@${firebase.getCurrentUsername()}`);
  };

  //Open settings
  const handleSettings = () => {
    console.log('Open settings');
  };

  //Open privacy / terms
  const handlePrivacyTerms = () => {
    console.log('Open privacy / terms');
  };

  //Opening a profile when the user searches for someone
  const handleProfileSelect = (username) => {
    props.history.push('/@' + username);
  }

  //Logout
  async function handleLogoff() {
    try {
      await firebase.logout();
      props.history.push('/login');
    } catch (error) {
      alert(error);
    }
  }

  async function removeNotification(item) {
    try {
      await firebase.removeNotification(item);
      handleNotificationsMenuClose();
      props.updatePageData();
    } catch (error){}
  }

  //Render the regular menu
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
        <MenuItem onClick={handleUserProfile}>Profile</MenuItem>
        <MenuItem onClick={handleSettings}>Settings</MenuItem>
        <MenuItem onClick={handlePrivacyTerms}>Privacy / Terms</MenuItem>
        <MenuItem onClick={handleLogoff}>Logoff</MenuItem>
      </Menu>
    );
  };

  //Render the notifications menu
  const notificationsMenuId = 'primary-search-account-menu';
  const renderNotificationsMenu = () => {
    return (
      <Menu
        anchorEl={notificationsOpenAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        id={notificationsMenuId}
        keepMounted
        getContentAnchorEl={null}
        open={isNotificationsOpen}
        onClose={handleNotificationsMenuClose}
      >
        {/* {FuturePlans} make these selectable to go to the notificaiton in question (go to the comment or post) */}
        {/* Another option is to remove the item when you select it but you can figure this out later */}
        {userProfile && userProfile.notifications.length > 0 ? 
          userProfile.notifications.map((notification) => 
          <MenuItem key={userProfile.notifications.indexOf(notification)} onClick={() => handleRemoveNotification(notification)}>
            {notification}
          </MenuItem>)
        :
          <MenuItem disabled>Empty</MenuItem>
        }
      </Menu>
    );
  };

  //Render the mobile menu
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
        <MenuItem onClick={handleMessages}>
          <IconButton aria-label="messages" color="inherit">
            <Badge badgeContent={userProfile ? userProfile.newMessages.length : 0} color="secondary">
              {messagesOpen ? <Chat /> : <ChatOutlined />}
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem onClick={handleNotifications}>
          <IconButton aria-label="notifications" color="inherit">
            <Badge badgeContent={userProfile ? userProfile.notifications.length : 0} color="secondary">
              {notificationsOpenAnchorEl ? (
                <Notifications />
              ) : (
                <NotificationsNoneOutlined />
              )}
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={handleUserProfileMenuOpen}>
          <IconButton
            aria-label="account of current user"
            aria-controls="primary-search-account-menu"
            aria-haspopup="true"
            color="inherit"
          >
            {firebase.getCurrentUsername() === window.location.href.substring(window.location.href.lastIndexOf('@') + 1) ?
              <AccountCircle />
              :
              <AccountCircleOutlined />
            }
          </IconButton>
          <p>{firebase.getCurrentUsername()}</p>
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
            onClick={handleGoToTop}
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
              aria-label="search"
              className={classes.usernameSearch}
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
              }}
              onKeyDown={handleSearch}
            />
            {usernameSearchResults.length !== 0 ? (
              <Popover
                id="search popover"
                anchorEl={usernameSearchAnchorEl}
                open={isUsernameSearchOpen}
                onClose={handleCloseUsernameSearch}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <List component="nav" aria-label="search results">
                  {usernameSearchResults.map((search) => {
                    const keyId = search.id;
                    const labelId = `username search for ${search.username}`;
                    return (
                      <div key={keyId}>
                        {keyId !== 0 ? <Divider /> : <></>}
                        <ListItem button onClick={() => handleProfileSelect(search.username)}>
                          <ListItemIcon>
                            <Avatar src={search.profilePicture} alt={search.username}/>
                          </ListItemIcon>
                          <ListItemText
                            primary={search.username}
                            id={labelId}
                          />
                        </ListItem>
                      </div>
                    );
                  })}
                </List>
              </Popover>
            ) : (
              <></>
            )}
          </div>
          <div className={classes.sectionDesktop}>
            <IconButton
              aria-label="messages"
              color="inherit"
              onClick={handleMessages}
            >
              <Badge badgeContent={userProfile ? userProfile.newMessages.length : 0} color="secondary">
                {messagesOpen ? <Chat /> : <ChatOutlined />}
              </Badge>
            </IconButton>
            <IconButton
              aria-label="notifications"
              color="inherit"
              onClick={handleNotifications}
            >
              <Badge badgeContent={userProfile ? userProfile.notifications.length : 0} color="secondary">
                {notificationsOpenAnchorEl ? (
                  <Notifications />
                ) : (
                  <NotificationsNoneOutlined />
                )}
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleUserProfileMenuOpen}
              color="inherit"
            >
              {firebase.getCurrentUsername() === window.location.href.substring(window.location.href.lastIndexOf('@') + 1) ?
                <AccountCircle />
                :
                <AccountCircleOutlined />
              }
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
      {renderNotificationsMenu()}
    </>
  );
}

async function usernameSearch(username) {
  const names = await firebase.searchUsernames(username);
  firebase.usernameSearch = [];
  return names;
}

export default withRouter(TaskBar);
