import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import UsersPage from './screens/UsersPage';
import MessagesPage from './screens/MessagesPage';
import ErrorPage from './screens/ErrorPage';
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
  const [allUsernames, setAllUsernames] = useState([]);

  useEffect(() => {
    firebase.isInitialized().then((val) => {
      setFirebaseInitialized(val);
      usernamesRetrieval();
    });
  });

  return firebaseInitialized !== false && allUsernames.length !== 0 ? (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/@:allUsernames" component={UsersPage} />
        <Route exact path="/messages" component={MessagesPage} />
        <Route component={ErrorPage} />
      </Switch>
    </Router>
  ) : (
    <div className={classes.loader}>
      <CircularProgress color="inherit" />
    </div>
  );

  async function usernamesRetrieval() {
    setAllUsernames(await firebase.getAllUsernames());
    firebase.allUsernames = [];
  }
}
