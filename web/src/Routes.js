import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
import { CircularProgress } from '@material-ui/core';
import firebase from './firebase';
// import MessagesPage from './screens/MessagesPage';
// import ProfilePage from './screens/ProfilePage';

export default function Routes() {
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  useEffect(() => {
    firebase.isInitialized().then(val => {
      setFirebaseInitialized(val);
    });
  });

  return firebaseInitialized !== false ? (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Router>
  ) : (
    //Need to make a className with loader
    <div className="loader">
      <CircularProgress />
    </div>
  );
}
