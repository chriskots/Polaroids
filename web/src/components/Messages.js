import { useState } from 'react';
// import firebase from '../firebase';
import { Box, Divider, List, ListItem, ListItemText } from '@material-ui/core';
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
  const [viewFriendMessages, setViewFriendMessages] = useState('');

  const handleSelectUser = (friend) => {
    setViewFriendMessages(friend);
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
              <ListItemText primary={friend}/>
            </ListItem>
          ))
          :
            <></>
          }
        </List>
      </div>
      <div className={classes.innerMessagesSide}>
          {viewFriendMessages}
      </div>
    </Box>
  );
}

export default withRouter(Messages);
