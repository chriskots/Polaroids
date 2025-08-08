import React, { useState, useEffect } from 'react';
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
  const [profile, setProfile] = useState(null);

  useEffect (() => {
    //User not logged in
    if (!firebase.getCurrentUsername()) {
      props.history.push('/login');
      return null;
    } else {
      try {
        //Initially get the users profile with firebase
        getUserProfile(window.location.href.substring(window.location.href.lastIndexOf('/') + 1))
        .then((r) => {
          setProfile(r);
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  }, [props.history]);


  if (!profile) {
    return <div>Loading...</div>
  }

  return (
    <div className={classes.outterBox}>
      {firebase.getCurrentUsername() === profile.username ?
        <div>
          {/* Next step is making this look nice */}
          username: {profile.username}
          posts: {profile.posts}
          followers: {profile.followers}
          following: {profile.following}
        </div>
        :
        <div className={classes.innerBox}>
          users profile for{' '}
          {window.location.href.substring(window.location.href.lastIndexOf('/') + 1)}
        </div>
      }
    </div>
  );
}

async function getUserProfile(username) {
  const user = await firebase.getProfile(username);
  return user;
}

export default withRouter(UsersProfile);
