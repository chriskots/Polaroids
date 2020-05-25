import React from 'react';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';

function Profile(props) {
  //User not logged in
  if (!firebase.getCurrentUsername()) {
    props.history.push('/login');
    return null;
  }

  return <div>messages here</div>;
}

export default withRouter(Profile);
