import React from 'react';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';

function UsersProfile(props) {
  //User not logged in
  if (!firebase.getCurrentUsername()) {
    props.history.push('/login');
    return null;
  }

  return <div>users profile for {firebase.getCurrentUsername()} here</div>;
}

export default withRouter(UsersProfile);
