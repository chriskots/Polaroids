import React from 'react';
import firebase from '../firebase';
import { withRouter } from 'react-router-dom';

function UsersProfile(props) {
  //User not logged in
  if (!firebase.getCurrentUsername()) {
    props.history.push('/login');
    return null;
  }

  return (
    <div>
      users profile for{' '}
      {window.location.href.substring(
        window.location.href.lastIndexOf('/') + 1
      )}
    </div>
  );
}

export default withRouter(UsersProfile);
