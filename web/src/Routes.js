import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './screens/HomePage';
import LoginPage from './screens/LoginPage';
// import MessagesPage from './screens/MessagesPage';
// import ProfilePage from './screens/ProfilePage';

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact render={() => <LoginPage />} />
        <Route path="/home" render={() => <HomePage />} />
        {/* <Route path='/profile' render={() => <ProfilePage />} />
          <Route path='/messages' render={() => <MessagesPage />} /> */}
      </Switch>
    </Router>
  );
}
