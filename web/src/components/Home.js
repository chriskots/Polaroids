import { useState, useMemo, useEffect } from 'react';
import firebase from '../firebase';
import {
  ThemeProvider,
  Button,
  Dialog,
  TextField,
  IconButton,
  Badge,
} from '@material-ui/core';
import {
  ChatOutlined,
  Favorite,
  FavoriteBorder,
} from '@material-ui/icons';
import { makeStyles, createTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

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
  images: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  postTitle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postTitleLikes: {
    display: 'flex',
    position: 'absolute',
    right: '20px',
  },
  viewPostCommentsMenu: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 365,
  },
  postCommentsDate: {
    fontWeight: 'lighter',
    fontSize: '0.8em',
  },
  postCommentsGroup: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    height: 250,
  },
  postComment: {
    display: 'flex',
    flexDirection: 'column',
    margin: '2px',
    boxShadow: '0px 0px 1px grey',
  },
  commentUsername: {
    display: 'flex',
    marginLeft: '2px',
  },
  commentContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflowWrap: 'break-word',
    wordBreak: 'break-word',
    wordWrap: 'break-word',
    marginLeft: '10px',
  },
  dateSize: {
    fontSize: '10px',
  },
}));

const textFieldTheme = createTheme({
  palette: {
    primary: {
      main: '#171717',
    },
  },
});

function Home(props) {
  const classes = useStyles();
  const profile = props.userProfile ? props.userProfile : null;
  const [viewPostMenu, setViewPostMenu] = useState(false);
  const [viewPostItem, setViewPostItem] = useState(null);
  const [viewPostComments, setViewPostComments] = useState(false);
  const [postMakeComment, setPostMakeComment] = useState('');
  const [postMakeCommentError, setPostMakeCommentError] = useState(' ');
  const ERROR_MESSAGE = 'Error';

  const sortedPosts = useMemo(() => {
    const friendsPosts = props.friendsPosts ? props.friendsPosts : [];
    let returnSortedPosts = [];

    for(const friend of friendsPosts) {
      for(const post of friend.posts) {
        returnSortedPosts.push({
          ...post,
          username: friend.username,
          uid: friend.uid,
        });
      }
    }

    // Sorting the posts to be newest first
    return returnSortedPosts.sort((second, first) => {
      const [firstDatePart, firstHour, firstMinute] = first.postDate.split(":");
      // Date part
      const [firstYear, firstMonth, firstDay] = firstDatePart.split("-").map(Number);
      const firstDate = new Date(firstYear, firstMonth - 1, firstDay, firstHour, firstMinute);
      
      const [secondDatePart, secondHour, secondMinute] = second.postDate.split(":");
      // Date part
      const [secondYear, secondMonth, secondDay] = secondDatePart.split("-").map(Number);
      const secondDate = new Date(secondYear, secondMonth - 1, secondDay, secondHour, secondMinute);

      return firstDate - secondDate;
    });
  }, [props.friendsPosts]);

  useEffect(() => {
    if (viewPostItem) {
      for (let post of sortedPosts) {
        if (post.image === viewPostItem.image) {
          setViewPostItem(post);
        }
      }
    }
  }, [viewPostItem, sortedPosts]);

  const handleViewPostMenu = (item) => {
    setViewPostMenu(!viewPostMenu);
    setViewPostComments(false);
    setPostMakeComment('');
    setPostMakeCommentError(' ');
    setViewPostItem(item);
  };

  const handleLikePost = () => {
    toggleLikePost();
  }

  const handleViewComments = () => {
    setViewPostComments(!viewPostComments);
  };

  const handleMakeComment = () => {
    makeComment();
  };

  const handleLikeComment = (commentIndex) => {
    toggleLikeComment(commentIndex);
  };

  const handleViewPostMenuDialog = () => {
      return (
        viewPostItem ? 
        <Dialog open={viewPostMenu} onClose={handleViewPostMenu}>
          <div className={classes.polaroidBox}>
            {!viewPostComments ?
            <>
              <div className={`${classes.innerPolaroidBox} ${classes.polaroidBoxSelectable}`} onDoubleClick={() => handleLikePost()}>
                <img className={classes.images} style={{transform: `rotate(${viewPostItem.rotation}deg)`}} src={viewPostItem.image} alt={ERROR_MESSAGE} loading='lazy'/>
              </div>
              <div className={classes.postTitle}>
                <h2>{viewPostItem.title}</h2>
                <Badge className={classes.postTitleLikes} badgeContent={viewPostItem.likes ? viewPostItem.likes.length : 0} color="secondary">
                  {viewPostItem.likes ? viewPostItem.likes.includes(firebase.getCurrentUsername()) ? <Favorite /> : <FavoriteBorder /> : <FavoriteBorder />}
                </Badge>
              </div>
            </>
            :
            <div className={classes.viewPostCommentsMenu}>
              {viewPostItem.username}
              <div className={classes.postCommentsDate}>
                (Post Date: {viewPostItem.postDate})
              </div>
              <div className={classes.postCommentsGroup}>
                {viewPostItem.comments.map((comment) => (
                  <div className={classes.postComment} key={viewPostItem.comments.indexOf(comment)}>
                    {/* Maybe make the comment user selectable to take them to the users profile */}
                    {/* className={classes.polaroidBoxSelectable} onClick={() => handleFriendSelect(comment.user)} */}
                    <div className={classes.commentUsername}>{comment.user}</div>
                    <div className={classes.commentContent}>
                      {comment.text}
                      <IconButton aria-label="like comment" color="inherit" onClick={() => handleLikeComment(viewPostItem.comments.indexOf(comment))}>
                        <Badge badgeContent={comment.likes.length} color="secondary">
                          {comment.likes.includes(firebase.getCurrentUsername()) ? <Favorite /> : <FavoriteBorder />}
                        </Badge>
                      </IconButton>
                    </div>
                    <div className={`${classes.dateSize} ${classes.commentUsername}`}>{comment.commentDate}</div>
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
    };

  return (
    <div className={classes.outterBox}>
      {profile ? 
      <>
        <div className={classes.polaroidGroups}>
          {sortedPosts.map((post) => (
            <div className={`${classes.polaroidBox} ${classes.polaroidBoxSelectable}`} onClick={() => handleViewPostMenu(post)} key={sortedPosts.indexOf(post)}>
              <div className={classes.innerPolaroidBox}>
                <img className={classes.images} style={{transform: `rotate(${post.rotation}deg)`}} src={post.image} alt={ERROR_MESSAGE} loading='lazy'/>
              </div>
              <h2>{post.title}</h2>
            </div>
          ))}
        </div>
        {handleViewPostMenuDialog()}
      </>
      :
        <></>
      }
    </div>
  );

  async function toggleLikePost() {
    try {
      await firebase.toggleLikePost(
        viewPostItem.uid,
        viewPostItem.image,
      );

      props.updatePageData();
    } catch(error) {} 
  }
  
  async function makeComment() {
    if (postMakeComment === '') {
      setPostMakeCommentError('Missing Comment');
      return;
    }

    try {
      await firebase.makeComment(
        viewPostItem.uid,
        viewPostItem.image,
        postMakeComment,
      );

      setPostMakeComment('');
      setPostMakeCommentError(' ');
      props.updatePageData();
    } catch(error) {
      setPostMakeCommentError('Error');
    }
  }

  async function toggleLikeComment(commentIndex) {
    try {
      await firebase.toggleLikeComment(
        viewPostItem.uid,
        viewPostItem.image,
        commentIndex,
      );
      
      props.updatePageData();
    } catch(error) {}
  }
}

export default withRouter(Home);
