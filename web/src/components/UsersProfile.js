import { useState, useEffect } from 'react';
import firebase from '../firebase';
import {
  ThemeProvider,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles, createTheme } from '@material-ui/core/styles';
import { withRouter, useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  outterBox: {
    [theme.breakpoints.up('sm')]: {
      margin: '0% 30% 0%',
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0% 35% 0%',
    },
    [theme.breakpoints.up('xl')]: {
      margin: '0% 40% 0%',
    },
  },
  innerBox: {
    width: '500px',
  },
  avatar: {
    width: 100,
    height: 100,
    boxShadow: '0px 3px 5px grey',
  },
  pictureAndUsername: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    fontSize: '30px',
  },
}));

const textFieldTheme = createTheme({
  palette: {
    primary: {
      main: '#171717',
    },
  },
});

function UsersProfile(props) {
  const classes = useStyles();
  const [profile, setProfile] = useState(null);
  //Use location to make sure that the page re-renders when a user goes to a profile from an obscure way (searching up and typing manually)
  const location = useLocation();
  const [viewFreindsMenu, setViewFriendsMenu] = useState(false);

  useEffect (() => {
    //User not logged in
    if (!firebase.getCurrentUsername()) {
      props.history.push('/login');
      return null;
    } else {
      try {
        //Initially get the users profile with firebase
        getUserProfile(window.location.href.substring(window.location.href.lastIndexOf('@') + 1))
        .then((r) => {
          setProfile(r);
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  }, [props.history, location]);

  const handleViewFriendsMenu = () => {
    setViewFriendsMenu(!viewFreindsMenu);
  };

  const handleFriendSelect = (friend) => {
    handleViewFriendsMenu();
    props.history.push('/@' + friend);
  };

  if (!profile) {
    return <div className={classes.outterBox}>Loading...</div>
  }

  return (
    <div className={classes.outterBox}>
      {firebase.getCurrentUsername() === profile.username ?
        <div className={classes.innerBox}>
          {/* username: {profile.username}
          posts: {profile.posts}
          friends: {profile.friends}
          profile pic: {<img  src={profile.profilePicture} alt={'Profile'} width="150" />} */}
          <div className={classes.pictureAndUsername}>
            <Avatar
              src={profile.profilePicture}
              alt="Profile Picture"
              className={classes.avatar}
            />
            <ThemeProvider theme={textFieldTheme}>
              {profile.username}
            </ThemeProvider>
            <Button onClick={handleViewFriendsMenu}>Friends: {profile.friends.length}</Button>
            <Dialog open={viewFreindsMenu} onClose={handleViewFriendsMenu}>
              <DialogTitle>View Friends</DialogTitle>
              <DialogContent>
                <ThemeProvider theme={textFieldTheme}>
                  {profile.friends.map((friend) => {
                    const keyId = profile.friends.indexOf(friend);
                    return (
                      <Button key={keyId} onClick={() => handleFriendSelect(friend)}>
                        {friend}
                      </Button>
                    );
                  })}
                </ThemeProvider>
              </DialogContent>
            </Dialog>
          </div>
          {/* Need to create objects for the posts before designing something */}
          <div>
            {profile.posts}
          </div>
        </div>
        :
        <div>
          {/* Need to create a view others profile page */}
          users profile for{' '}
          {window.location.href.substring(window.location.href.lastIndexOf('@') + 1)}
        </div>
      }
    </div>
  );
}

async function getUserProfile(username) {
  const user = await firebase.getProfile(username);
  return user;
}

export default withRouter(UsersProfile);
