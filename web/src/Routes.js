import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import UsersPage from './screens/UsersPage';
import MessagesPage from './screens/MessagesPage';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import firebase from './firebase';

const useStyles = makeStyles((theme) => ({
  loader: {
    marginTop: '50%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: '20%',
    },
  },
}));

export default function Routes() {
  const classes = useStyles();
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);
  let allUsernames = [];

  useEffect(() => {
    firebase.isInitialized().then((val) => {
      setFirebaseInitialized(val);
    });
  });

  if (firebaseInitialized !== false) {
    allUsernames = usernamesRetrieval();

    console.log('here');
    console.log(allUsernames);
  }

  return firebaseInitialized !== false ? (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        {/* profile should be the username */}
        <Route exact path="/users/:allUsernames" component={UsersPage} />
        <Route exact path="/messages" component={MessagesPage} />
      </Switch>
    </Router>
  ) : (
    <div className={classes.loader}>
      <CircularProgress color="inherit" />
    </div>
  );

  async function usernamesRetrieval() {
    console.log(await firebase.getAllUsernames());
    return await firebase.getAllUsernames();
  }
}
