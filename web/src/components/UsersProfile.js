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
  IconButton,
  Badge,
} from '@material-ui/core';
import {
  ChatOutlined,
  RotateRight,
  Favorite,
  FavoriteBorder,
} from '@material-ui/icons';
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
  fixedRotateImage: {
    objectFit: 'cover',
    position: 'fixed',
    zIndex: 1,
  },
  viewPostCommentsMenu: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'space-between',
  },
  postComments: {
    display: 'flex',
    flexDirection: 'column',
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
  const [reloadPageData, setReloadPageData] = useState(false);
  const [profile, setProfile] = useState(null);
  //Use location to make sure that the page re-renders when a user goes to a profile from an obscure way (searching up and typing manually)
  const location = useLocation();
  const [viewFreindsMenu, setViewFriendsMenu] = useState(false);
  const [viewCreateNewPostMenu, setViewCreateNewPostMenu] = useState(false);
  const [newPostImageDisplay, setNewPostImageDisplay] = useState(null);
  const [newPostImage, setNewPostImage] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loadingHandleDropImage, setLoadingHandleDropImage] = useState(false);
  const [newPostRotation, setNewPostRotation] = useState(0);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [viewPostMenu, setViewPostMenu] = useState(false);
  const [viewPostItem, setViewPostItem] = useState(null);
  const [viewPostComments, setViewPostComments] = useState(false);
  const [postMakeComment, setPostMakeComment] = useState('');
  const [postMakeCommentError, setPostMakeCommentError] = useState(' ');
  // The alt='Error' could be a placeholder temporary image instead
  const ERROR_MESSAGE = 'Error';
  const [newPostImageError, setNewPostImageError] = useState(false);
  const [newPostTitleError, setNewPostTitleError] = useState(' ');

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
        console.error("Error fetching profile: ", error);
      }
    }
  }, [props.history, location, reloadPageData]);

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
    createPost();
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    setLoadingHandleDropImage(true);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      // {FuturePlans} resize image here
      reader.onload = () => setNewPostImageDisplay(reader.result);
      setNewPostImage(file);
      setNewPostRotation(0);
      reader.readAsDataURL(file);
      setNewPostImageError(false);
    }
    else {
      setLoadingHandleDropImage(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragOverLeave = () => {
    setDragOver(false);
  };

  const handleRotateImage = () => {
    setNewPostRotation(prev => (prev + 90) % 360);
  };

  const handleViewPostMenu = (item) => {
    setViewPostMenu(!viewPostMenu);
    setViewPostComments(false);
    setPostMakeComment('');
    setPostMakeCommentError(' ');
    setViewPostItem(item);
  }

  const handleViewComments = () => {
    setViewPostComments(!viewPostComments);
  }

  const handleMakeComment = () => {
    makeComment();
  }

  const handleLikeComment = (commentIndex) => {
    likeComment(commentIndex);
  }

  const handleViewPostMenuDialog = () => {
    return (
      viewPostItem ? 
      <Dialog open={viewPostMenu} onClose={handleViewPostMenu}>
        <div className={classes.polaroidBox}>
          {!viewPostComments ?
          <>
            <div className={classes.innerPolaroidBox}>
              <img className={classes.images} style={{transform: `rotate(${viewPostItem.rotation}deg)`}} src={viewPostItem.image} alt={ERROR_MESSAGE} loading='lazy'/>
            </div>
            <h2>{viewPostItem.title}</h2>
          </>
          :
          <div className={classes.viewPostCommentsMenu}>
            Post Date: {viewPostItem.postDate}
            <div className={classes.postComments}>
              {viewPostItem.comments.map((comment) => (
                <div key={viewPostItem.comments.indexOf(comment)}>
                  <div>{comment.user}</div>
                  <div>{comment.text + ' (' + comment.commentDate + ')'}</div>
                  <IconButton aria-label="like comment" color="inherit" onClick={() => handleLikeComment(viewPostItem.comments.indexOf(comment))}>
                    <Badge badgeContent={comment.likes.length} color="secondary">
                      {comment.likes.includes(firebase.getCurrentUsername()) ? <Favorite /> : <FavoriteBorder />}
                    </Badge>
                  </IconButton>
                </div>
              ))}
            </div>

            <div>
              <ThemeProvider theme={textFieldTheme}>
                <TextField
                  id="comment"
                  placeholder="Comment"
                  value={postMakeComment}
                  onChange={(event) => {
                    setPostMakeComment(event.target.value);
                  }}
                  error={postMakeCommentError !== ' ' ? true : false}
                  helperText={postMakeCommentError}
                />
              </ThemeProvider>
              <IconButton aria-label="comment" color="inherit" onClick={handleMakeComment}>
                <Badge color="secondary">
                  <ChatOutlined />
                </Badge>
              </IconButton>
            </div>
          </div>
          }
        </div>
        <Button onClick={handleViewComments}>
          Flip
        </Button>
      </Dialog>
      :
      <></>
    );
  }
  
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
                <div className={classes.innerPolaroidBox} style={{backgroundColor: newPostImageError ? dragOver ? '#e0f7fa' : '#ffc2c2' : dragOver ? '#e0f7fa' : '#f9f9f9'}} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragOverLeave}>
                    {newPostImageDisplay ? (
                      <>
                        <div className={classes.fixedRotateImage}>
                          <IconButton aria-label="comment" color="inherit" onClick={handleRotateImage}>
                            <Badge color="secondary">
                              <RotateRight />
                            </Badge>
                          </IconButton>
                        </div>
                        <img className={classes.images} style={{transform: `rotate(${newPostRotation}deg)`}} src={newPostImageDisplay} alt={ERROR_MESSAGE} loading='lazy'/>
                      </>
                    ) : (
                      <>
                        {loadingHandleDropImage ? (
                          <CircularProgress color="inherit" />
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" height="80%" viewBox="0 0 24 24" width="60%">
                            <path d="M0 0h24v24H0V0z" fill="none"/>
                            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11z"/>
                          </svg>
                        )}
                      </>
                    )}
                </div>
                <h2>
                  <ThemeProvider theme={textFieldTheme}>
                    <TextField
                      placeholder='Create New Post'
                      inputProps={{style: { textAlign: 'center' }}}
                      value={newPostTitle}
                      onChange={(event) => {
                        setNewPostTitle(event.target.value);
                      }}
                      error={newPostTitleError !== ' ' ? true : false}
                      helperText={newPostTitleError}
                    />
                  </ThemeProvider>
                </h2>
              </div>
              <Button onClick={handleCreateNewPost}>
                Post
              </Button>
            </Dialog>
            {profile.posts.map((item) => (
              <div className={`${classes.polaroidBox} ${classes.polaroidBoxSelectable}`} onClick={() => handleViewPostMenu(item)} key={profile.posts.indexOf(item)}>
                <div className={classes.innerPolaroidBox}>
                  <img className={classes.images} style={{transform: `rotate(${item.rotation}deg)`}} src={item.image} alt={ERROR_MESSAGE} loading='lazy'/>
                </div>
                <h2>{item.title}</h2>
              </div>
            ))}
          </div>
          {handleViewPostMenuDialog()}
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

  async function createPost() {
    if (!newPostImage) {
      setNewPostImageError(true);
      return;
    }
    if(newPostTitle === '') {
      setNewPostTitleError('Missing Title');
      return;
    }

    try {
      await firebase.createPost(
        newPostImage,
        newPostRotation,
        newPostTitle
      );

      setNewPostImageError(false);
      setNewPostTitleError(' ');
      setNewPostImage(null);
      setNewPostTitle('');
      setLoadingHandleDropImage(false);
      setViewCreateNewPostMenu(!viewCreateNewPostMenu);
      setReloadPageData(!reloadPageData);
    } catch(error) {
      if (error.message === `can't access property "name", image is null`) {
        setNewPostImageError(true);
      }
    }
  }

  async function makeComment() {
    if (postMakeComment === '') {
      setPostMakeCommentError('Missing Comment');
      return;
    }

    try {
      await firebase.makeComment(
        profile.uid,
        viewPostItem.image,
        postMakeComment,
      );

      setPostMakeComment('');
      setPostMakeCommentError(' ');
      // Close the menu to reload the data
      setViewPostMenu(!viewPostMenu);
      // {futurePlans} I want to reload the page data but the problem is that viewPostItem changes on the server when getting the profile but not locally
      setReloadPageData(!reloadPageData);
    } catch(error) {}
  }

  async function likeComment(commentIndex) {
    try {
      await firebase.likeComment(
        profile.uid,
        profile.username,
        viewPostItem.image,
        commentIndex,
      );
      
      setViewPostMenu(!viewPostMenu);
      setReloadPageData(!reloadPageData);
    } catch(error) {}
  }
}

async function getUserProfile(username) {
  const user = await firebase.getProfile(username);
  return user;
}

export default withRouter(UsersProfile);
