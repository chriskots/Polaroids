import { useState, useEffect } from 'react';
import firebase from '../firebase';
import TaskBar from '../components/TaskBar';
import Home from '../components/Home';
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  taskBarSpacing: {
    marginTop: '25%',
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.up('sm')]: {
      marginTop: '15%',
    },
    [theme.breakpoints.up('md')]: {
      marginTop: '10%',
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: '7%',
    },
    [theme.breakpoints.up('xl')]: {
      marginTop: '5%',
    },
  },
}));

export default function HomePage(props) {
  const classes = useStyles();
    //Use location to make sure that the page re-renders when a user goes to a profile from an obscure way (searching up and typing manually)
    const location = useLocation();
    const [userProfile, setUserProfile] = useState(null);
    const [friendsPosts, setFriendsPosts] = useState([]);
    const [reloadPageData, setReloadPageData] = useState(false);
    
  useEffect (() => {
    //User not logged in
    if (!firebase.getCurrentUsername()) {
      props.history.push('/login');
      return null;
    } else {
      try {
        //Initially get the users profile with firebase
        getUserProfile(firebase.getCurrentUsername())
        .then((resultUser) => {
          setUserProfile(resultUser);
          setFriendsPosts(prevFriendsPosts => [...prevFriendsPosts, {uid: resultUser.uid, posts: resultUser.posts}]);
          //Initially get the users friends profiles with firebase
          for (const friend of resultUser.friends) {
            getUserProfile(friend)
            .then((friendProfile) => {
              setFriendsPosts(prevFriendsPosts => [...prevFriendsPosts, {uid: friendProfile.uid, posts: friendProfile.posts}]);
            });
          }
        });
      } catch (error) {
        console.error("Error fetching profile: ", error);
      }
    }
  }, [props.history, location, reloadPageData]);

  const updatePageData = () => {
    setFriendsPosts([]);
    setReloadPageData(!reloadPageData);
  }

  return (
    <div className={classes.taskBarSpacing}>
      <TaskBar userProfile={userProfile} updatePageData={updatePageData}/>
      <Home userProfile={userProfile} friendsPosts={friendsPosts} updatePageData={updatePageData}/>
    </div>
  );
}

async function getUserProfile(username) {
  const user = await firebase.getProfile(username);
  return user;
};
