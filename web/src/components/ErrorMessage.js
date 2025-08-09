import firebase from '../firebase';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  textAlignment: {
    textAlign: 'center',
  },
}));

function ErrorMessage(props) {
  const classes = useStyles();
  //User not logged in
  if (!firebase.getCurrentUsername()) {
    props.history.push('/login');
    return null;
  }

  return (
    <div className={classes.textAlignment}>
      <h2>Sorry, this page is unavailable.</h2>
      The link you followed may be broken, or the page may have been removed.
      Please go back to Polaroids.
    </div>
  );
}

export default withRouter(ErrorMessage);
