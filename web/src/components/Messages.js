import { useState } from 'react';
import firebase from '../firebase';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ThemeProvider,
  TextField,
  IconButton,
  Badge,
} from '@material-ui/core';
import {
  ChatOutlined,
} from '@material-ui/icons';
import { makeStyles, createTheme } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  outterBox: {
    display: 'flex',
    flexDirection: 'row',
    height: 800,
    width: 1000,
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
  },
  innerUsersSide: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '30%',
    height: '100%',
  },
  innerMessagesSide: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
  },
  dividerWidth: {
    width: '95%',
  },
  friendListItem: {
    padding: '5px',
    borderRadius: '5px',
  },
  friendListItemText: {
    textAlign: 'center',
  },
  friendListItemTextBold: {
    textAlign: 'center',
    color: 'blue',
    fontWeight: 'bold',
  },
  messagesDisplaySide: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  messagesDisplayContent: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    height: '100%',
  },
  messageUsernameDisplayUser: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  messageUsernameDisplayFriend: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  messagesDisplayCenter: {
    display: 'flex',
    justifyContent: 'center',
  }
}));

const textFieldTheme = createTheme({
  palette: {
    primary: {
      main: '#171717',
    },
  },
});

function Messages(props) {
  const classes = useStyles();
  const profile = props.userProfile;
  const [viewFriendUser, setViewFriendUser] = useState(null);
  const [viewFriendMessages, setViewFriendMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageError, setMessageError] = useState(' ');

  const handleSelectUser = (friend) => {
    for (let user of profile.messages) {
      if (user.friend === friend) {
        setViewFriendUser(user);
        setViewFriendMessages(user.messages);
        if (profile.newMessages.includes(friend)) {
          removeNewMessageNotification(friend);
        }
      }
    }
  };

  const handleSendMessage = () => {
    sendMessage();
  }

  const handleSendMessageEnterKey = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Box className={classes.outterBox}>
      <div className={classes.innerUsersSide}>
        <h2>
          Messages
        </h2>
        <Divider className={classes.dividerWidth}/>
        <List>
          {profile ? profile.friends.map((friend) => (
            <ListItem
              className={classes.friendListItem}
              key={profile.friends.indexOf(friend)}
              button
              onClick={() => handleSelectUser(friend)}
            >
              <ListItemText
                classes={{primary: profile.newMessages.includes(friend) ? classes.friendListItemTextBold : classes.friendListItemText}}
                primary={friend}
              />
            </ListItem>
          ))
          :
            <></>
          }
        </List>
      </div>
      <div className={classes.innerMessagesSide}>
        {viewFriendUser ? (
          <div className={classes.messagesDisplaySide}>
            <div className={classes.messagesDisplayCenter}>
              <h3>
                {viewFriendUser.friend}
              </h3>
            </div>
            <List className={classes.messagesDisplayContent}>
              {viewFriendMessages.map((message) => (
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Box className={message.username === firebase.getCurrentUsername() ? classes.messageUsernameDisplayUser : classes.messageUsernameDisplayFriend}>
                          {message.username}: {message.date}
                      </Box>
                    }
                    secondary={
                      <div className={message.username === firebase.getCurrentUsername() ? classes.messageUsernameDisplayUser : classes.messageUsernameDisplayFriend}>
                        {message.message}
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <div className={classes.messagesDisplayCenter}>
              <ThemeProvider theme={textFieldTheme}>
                <TextField
                  id="message"
                  placeholder="message"
                  fullWidth
                  value={message}
                  onChange={(event) => {
                    setMessage(event.target.value);
                  }}
                  onKeyDown={handleSendMessageEnterKey}
                  error={messageError !== ' ' ? true : false}
                  helperText={messageError}
                />
              </ThemeProvider>
              <IconButton aria-label="message" color="inherit" onClick={handleSendMessage}>
                <Badge color="secondary">
                  <ChatOutlined />
                </Badge>
              </IconButton>
            </div>
          </div>
          )
        : 
          <></>
        }
      </div>
    </Box>
  );

  async function removeNewMessageNotification(friend) {
    try {
      await firebase.removeNewMessageNotification(
        friend,
      );

      props.updatePageData();
    } catch(error) {}
  }

  async function sendMessage() {
    if (message === '') {
      setMessageError('Missing Message');
      return;
    }

    try {
      await firebase.sendMessage(
        viewFriendUser.uid,
        viewFriendUser.friend,
        message,
      );

      setMessage('');
      setMessageError(' ');
      setViewFriendUser(null);
      setViewFriendMessages([]);
      props.updatePageData();
    } catch(error) {
      console.log(error);
      setMessageError('Error');
    }
  }
}

export default withRouter(Messages);
