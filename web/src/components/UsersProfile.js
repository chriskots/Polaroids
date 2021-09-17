import React from 'react';
import firebase from '../firebase';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  outterBox: {
    [theme.breakpoints.up('sm')]: {
      margin: '0% 30% 0%',
    },
    [theme.breakpoints.up('lg')]: {
      margin: '0% 35% 0%',
    },
    [theme.breakpoints.up('xl')]: {
      margin: '0% 40% 0%',
    },
    padding: '15px 15px 20px',
    boxShadow: '0px 3px 5px grey',
  },
  innerBox: {
    margin: '10% 10% 0%',
  }
}));


function UsersProfile(props) {
  const classes = useStyles();

  //User not logged in
  if (!firebase.getCurrentUsername()) {
    props.history.push('/login');
    return null;
  }

  return (
    <div className={classes.outterBox}>
      {/* {firebase.getCurrentUsername() === window.location.href.substring(window.location.href.lastIndexOf('/') + 1) ?
        <div>
          Here
        </div>
        : */}
        <div className={classes.innerBox}>
          users profile for{' '}
          {window.location.href.substring(
            window.location.href.lastIndexOf('/') + 1
          )}
        </div>
      {/* } */}
    </div>
  );
}

export default withRouter(UsersProfile);
