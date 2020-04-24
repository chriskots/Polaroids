import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import firebase from '../firebase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  polaroidBox: {
    margin: '10% 40% 0%',
    padding: '15px 15px 20px',
    boxShadow: '0px 3px 5px grey',
  },
  login: {
    textAlign: 'center',
    boxShadow: '0px 0px 1px grey',
  },
  spacing: {
    padding: '10px',
  },
  loginButton: {
    color: 'inherit',
    textDecoration: 'none',
    '&$disabled': {
      background: 'rgba(0, 0, 0, 0.12)',
      color: 'white',
      boxShadow: 'none',
    },
  },
  passwordSpacing: {
    display: 'flex',
    margin: theme.spacing(1),
    justifyContent: 'space-between',
  },
  passportText: {
    textAlign: 'center',
    marginTop: '20px',
  },
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
    },
  },
})(TextField);

function Signin(props) {
  const classes = useStyles();
  //Login input variables
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  //Forget password variables
  const [emailForgetPassword, setEmailForgetPassword] = useState('');
  const [openForgetPassword, setOpenForgetPassword] = useState(false);
  //Create new account variables
  const [emailCreateNewAccount, setEmailCreateNewAccount] = useState('');
  const [usernameCreateNewAccount, setUsernameCreateNewAccount] = useState('');
  const [passwordCreateNewAccount, setPasswordCreateNewAccount] = useState('');
  const [
    confirmPasswordCreateNewAccount,
    setConfirmPasswordCreateNewAccount,
  ] = useState('');
  const [openCreateNewAccount, setOpenCreateNewAccount] = useState(false);
  //button variables
  let signupButtonDisabled = true;

  //This function is a handler for when the user clicks the login button to use the login functionality
  const handleLogin = () => {
    login();
  };

  //This function is a handler for when the user clicks the enter key to use the login functionality
  const handleLoginEnterKey = (event) => {
    if (event.key === 'Enter') {
      login();
    }
  };

  //This function is a handler for when the forget password dialog is opened
  const handleForgetPasswordOpen = () => {
    setOpenForgetPassword(true);
  };

  //This function is a handler for when the forget password dialog is closed
  const handleForgetPasswordClose = () => {
    setOpenForgetPassword(false);
  };

  //This function is a handler for when the forget password button is clicked
  const handleForgetPassword = () => {
    console.log('forget password with', emailForgetPassword);
  };

  //This function is a handler for when the enter key is pressed when entering the forget password
  const handleForgetPasswordEnterKey = (event) => {
    if (event.key === 'Enter') {
      console.log('forget password with', emailForgetPassword);
    }
  };

  //This function is a handler for when the create new account is opened
  const handleCreateNewAccountOpen = () => {
    setOpenCreateNewAccount(true);
  };

  //This function is a handler for when the create new account is closed
  const handleCreateNewAccountClose = () => {
    setOpenCreateNewAccount(false);
  };

  //This function is a handler for when the create new account button is pressed
  const handleCreateNewAccount = () => {
    if (passwordCreateNewAccount !== confirmPasswordCreateNewAccount) {
    } else {
      signup();
    }
  };

  //This function is a handler for when the user clicks the enter key to create a new account
  const handleCreateNewAccountEnterKey = (event) => {
    if (event.key === 'Enter') {
      if (passwordCreateNewAccount !== confirmPasswordCreateNewAccount) {
      } else {
        signup();
      }
    }
  };

  return (
    <div className={classes.polaroidBox}>
      <div className={classes.login}>
        <div className={classes.spacing}>
          <CssTextField
            id="login email"
            label="Email"
            value={emailInput}
            onChange={(event) => {
              setEmailInput(event.target.value);
            }}
            onKeyPress={handleLoginEnterKey}
          />
        </div>
        <div className={classes.spacing}>
          <CssTextField
            id="login password"
            label="Password"
            type="password"
            value={passwordInput}
            onChange={(event) => {
              setPasswordInput(event.target.value);
            }}
            onKeyPress={handleLoginEnterKey}
          />
        </div>
        <div className={classes.spacing}>
          <Button className={classes.loginButton} onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className={classes.spacing}>
          <Button onClick={handleForgetPasswordOpen}>Forget Password</Button>
          <Dialog open={openForgetPassword} onClose={handleForgetPasswordClose}>
            <DialogTitle>Forget Password</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your email and we will begin with the process of
                changing your password
              </DialogContentText>
              <CssTextField
                id="forget password email"
                label="Email"
                fullWidth
                value={emailForgetPassword}
                onChange={(event) => {
                  setEmailForgetPassword(event.target.value);
                }}
                onKeyPress={handleForgetPasswordEnterKey}
              ></CssTextField>
            </DialogContent>
            <DialogActions>
              <Button
                className={classes.loginButton}
                onClick={handleForgetPassword}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <div className={classes.spacing}>
          <Button
            className={classes.loginButton}
            onClick={handleCreateNewAccountOpen}
          >
            Create New Account
          </Button>
          <Dialog
            open={openCreateNewAccount}
            onClose={handleCreateNewAccountClose}
          >
            <DialogTitle>Create New Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your email, username, and password to create a new
                account
              </DialogContentText>
              <div className={classes.spacing}>
                <CssTextField
                  id="create new account email"
                  label="Email"
                  fullWidth
                  value={emailCreateNewAccount}
                  onChange={(event) => {
                    setEmailCreateNewAccount(event.target.value);
                  }}
                  onKeyPress={handleCreateNewAccountEnterKey}
                ></CssTextField>
              </div>
              <div className={classes.spacing}>
                <CssTextField
                  id="create new account username"
                  label="Username"
                  fullWidth
                  value={usernameCreateNewAccount}
                  onChange={(event) => {
                    setUsernameCreateNewAccount(event.target.value);
                  }}
                  onKeyPress={handleCreateNewAccountEnterKey}
                ></CssTextField>
              </div>
              <div className={classes.passwordSpacing}>
                <CssTextField
                  id="create new account password"
                  label="Password"
                  type="password"
                  value={passwordCreateNewAccount}
                  onChange={(event) => {
                    setPasswordCreateNewAccount(event.target.value);
                  }}
                  onKeyPress={handleCreateNewAccountEnterKey}
                ></CssTextField>
                <CssTextField
                  id="create new account confirm password"
                  label="Confirm Password"
                  type="password"
                  value={confirmPasswordCreateNewAccount}
                  onChange={(event) => {
                    setConfirmPasswordCreateNewAccount(event.target.value);
                  }}
                  onKeyPress={handleCreateNewAccountEnterKey}
                ></CssTextField>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={signupButtonDisabled}
                className={classes.loginButton}
                onClick={handleCreateNewAccount}
              >
                Sign Up
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <div className={classes.passportText}>Polaroids</div>
    </div>
  );

  async function login() {
    try {
      await firebase.login(emailInput, passwordInput);
      props.history.push('/');
    } catch (error) {
      alert(error);
    }
  }

  async function signup() {
    try {
      await firebase.register(
        usernameCreateNewAccount,
        emailCreateNewAccount,
        passwordCreateNewAccount
      );
      handleCreateNewAccountClose();
    } catch (error) {
      alert(error);
    }
  }
}

export default withRouter(Signin);
