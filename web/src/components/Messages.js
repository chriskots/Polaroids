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
  },
  dividerWidth: {
    width: '95%',
  },
  friendListItem: {
    padding: '5px',
    borderRadius: '5px',
  },
  friendListItemTextBold: {
    fontWeight: "bold",
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
                classes={{primary: profile.newMessages.includes(friend) ? classes.friendListItemTextBold : ''}}
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
          <>
            {viewFriendMessages.map((message) => (
              <div key={viewFriendMessages.indexOf(message)}>{message.message} by: {message.username}</div>
            ))}
            <ThemeProvider theme={textFieldTheme}>
              <TextField
                id="message"
                placeholder="message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                error={messageError !== ' ' ? true : false}
                helperText={messageError}
              />
            </ThemeProvider>
            <IconButton aria-label="message" color="inherit" onClick={handleSendMessage}>
              <Badge color="secondary">
                <ChatOutlined />
              </Badge>
            </IconButton>
          </>
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
      props.updatePageData();
    } catch(error) {
      console.log(error);
      setMessageError('Error');
    }
  }
}

export default withRouter(Messages);
