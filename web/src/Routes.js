import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Homepage from "./screens/Homepage";
// import MessagesPage from './screens/MessagesPage';
// import ProfilePage from './screens/ProfilePage';

export default function Routes() {
  return (
    <Router>
      <Switch>
        {/* <Route path='/profile' render={() => <ProfilePage />}></Route>
          <Route path='/messages' render={() => <MessagesPage />}></Route> */}
        <Route path="/" render={() => <Homepage />}></Route>
      </Switch>
    </Router>
  );
}
