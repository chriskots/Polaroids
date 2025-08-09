import { useState, useEffect } from 'react';
import firebase from '../firebase';
import {
  ThemeProvider,
  Avatar,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Container,
  Box,
  Typography,
  TextField,
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
    //This can be sm instead but I wanted it to be consistent with the taskbar
    [theme.breakpoints.up('md')]: {
      width: '1000px',
    },
  },
  avatar: {
    width: 100,
    height: 100,
    boxShadow: '0px 3px 5px grey',
  },
  pictureAndUsername: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    mb: '16px',
  },
  usernameStyle: {
    fontVariant: 'h4',
  },
  friendList: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
  polaroidGroups: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  polaroidBox: {
    textAlign: 'center',
    width: 300,
    height: 350,
    margin: '5px',
    padding: '15px 15px 20px',
    boxShadow: '0px 0px 5px grey',
  },
  polaroidBoxSelectable: {
    cursor: "pointer",
    userSelect: 'none',
  },
  innerPolaroidBox: {
    textAlign: 'center',
    width: 300,
    height: 300,
    boxShadow: '0px 0px 1px grey',
  },
  createPostButton: {
    display: 'flex',
    justifyContent: 'center',
  },
  images: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
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
  const [viewCreateNewPostMenu, setViewCreateNewPostMenu] = useState(false);
  const [newPostImage, setNewPostImage] = useState(null);

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

  const handleCreateNewPostMenu = () => {
    setViewCreateNewPostMenu(!viewCreateNewPostMenu);
  }
  
  const handleCreateNewPost = () => {
    setViewCreateNewPostMenu(!viewCreateNewPostMenu);
    //Implement creating a new post functionality here (I believe this is next thing to do to see if it works)
  }

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setNewPostImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  if (!profile) {
    return (
    <div className={classes.outterBox}>
      {/* An option is to make this spin for a few seconds and return with "Could not find user" */}
      <CircularProgress color="inherit" />
      {/* I also need to make an "error" note for when the user they have manually typed does not exist */}
    </div>
    );
  }

  return (
    <div className={classes.outterBox}>
      {firebase.getCurrentUsername() === profile.username ?
        <Container className={classes.innerBox}>
          <Box className={classes.pictureAndUsername}>
            <Avatar
              src={profile.profilePicture}
              alt={profile.username}
              className={classes.avatar}
            />
            <Typography className={classes.usernameStyle}>
              {profile.username}
            </Typography>
            
            <Button onClick={handleViewFriendsMenu}>Friends: {profile.friends.length}</Button>
            <Dialog open={viewFreindsMenu} onClose={handleViewFriendsMenu}>
              <DialogTitle>View Friends</DialogTitle>
              <DialogContent className={classes.friendList}>
                  {profile.friends.map((friend) => {
                    const keyId = profile.friends.indexOf(friend);
                    return (
                      <Button key={keyId} onClick={() => handleFriendSelect(friend)}>
                        {friend}
                      </Button>
                    );
                  })}
              </DialogContent>
            </Dialog>
          </Box>

          {/* Posts Section */}
          <div className={classes.polaroidGroups}>
            <div className={`${classes.polaroidBox} ${classes.polaroidBoxSelectable}`} onClick={handleCreateNewPostMenu}>
              <div className={classes.innerPolaroidBox}>
                {/* Maybe add a fun temp image here */}
                {/* <svg xmlns="http://www.w3.org/2000/svg" height="100%" viewBox="0 0 24 24" width="100%">
                  <path d="M0 0h24v24H0z" fill="none"/><path d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"/>
                </svg> */}
              </div>
              <h2>Create New Post</h2>
            </div>
            <Dialog open={viewCreateNewPostMenu} onClose={handleCreateNewPostMenu}>
              <div className={classes.polaroidBox}>
                <div className={classes.innerPolaroidBox} onDrop={handleDrop} onDragOver={handleDragOver}>
                    {newPostImage ? (
                      <img className={classes.images} src={newPostImage} alt='Error' loading='lazy'/>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="80%" viewBox="0 0 24 24" width="60%">
                        <path d="M0 0h24v24H0V0z" fill="none"/><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
                      </svg>
                    )}
                </div>
                <h2>
                  <ThemeProvider theme={textFieldTheme}>
                    <TextField placeholder='Create New Post' inputProps={{style: { textAlign: 'center' }}}/>
                  </ThemeProvider>
                </h2>
              </div>
              <Button onClick={handleCreateNewPost}>
                Post
              </Button>
            </Dialog>
            {profile.posts.map((item) => (
              <div className={classes.polaroidBox} key={profile.posts.indexOf(item)}>
                <div className={classes.innerPolaroidBox}>
                  {/* The the alt='Error' could be a placeholder temporary image instead */}
                  <img className={classes.images} src={item} alt='Error' loading='lazy'/>
                </div>
                <h2>Example here</h2>
              </div>
            ))}
          </div>

        </Container>
        :
        <div className={classes.innerBox}>
          {/* Make a user page for an existing user when you come up with a final design */}
          {/* It should have a Add Friend button instead of friends button if you are not friends with them already use PersonAddIcon in MUI*/}
          {/* It should also not allow you to see any posts (with a lock icon) if you are not friends with them */}
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
