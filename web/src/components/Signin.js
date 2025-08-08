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
import {
  makeStyles,
  createTheme,
  ThemeProvider,
} from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  polaroidBox: {
    margin: '10% 10% 0%',
    [theme.breakpoints.up('sm')]: {
      margin: '10% 30% 0%',
    },
    [theme.breakpoints.up('lg')]: {
      margin: '10% 35% 0%',
    },
    [theme.breakpoints.up('xl')]: {
      margin: '10% 40% 0%',
    },
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

const textFieldTheme = createTheme({
  palette: {
    primary: {
      main: '#171717',
    },
  },
});

function Signin(props) {
  const classes = useStyles();
  //Login input variables
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(' ');
  //Forgot password variables
  const [emailForgotPassword, setEmailForgotPassword] = useState('');
  const [emailForgotPasswordError, setEmailForgotPasswordError] = useState(' ');
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  //Create new account variables
  const [emailCreateNewAccount, setEmailCreateNewAccount] = useState('');
  const [emailCreateNewAccountError, setEmailCreateNewAccountError] = useState(
    ' '
  );
  const [usernameCreateNewAccount, setUsernameCreateNewAccount] = useState('');
  const [
    usernameCreateNewAccountError,
    setUsernameCreateNewAccountError,
  ] = useState(' ');
  const [passwordCreateNewAccount, setPasswordCreateNewAccount] = useState('');
  const [
    confirmPasswordCreateNewAccount,
    setConfirmPasswordCreateNewAccount,
  ] = useState('');
  const [
    createNewAccountPasswordError,
    setCreateNewAccountPasswordError,
  ] = useState(' ');
  const [openCreateNewAccount, setOpenCreateNewAccount] = useState(false);

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

  //This function is a handler for when the forgot password dialog is opened
  const handleForgotPasswordOpen = () => {
    setOpenForgotPassword(true);
  };

  //This function is a handler for when the forgot password dialog is closed
  const handleForgotPasswordClose = () => {
    setOpenForgotPassword(false);
  };

  //This function is a handler for when the forgot password button is clicked
  const handleForgotPassword = () => {
    forgotPassword();
  };

  //This function is a handler for when the enter key is pressed when entering the forgot password
  const handleForgotPasswordEnterKey = (event) => {
    if (event.key === 'Enter') {
      forgotPassword();
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
    signup();
  };

  //This function is a handler for when the user clicks the enter key to create a new account
  const handleCreateNewAccountEnterKey = (event) => {
    if (event.key === 'Enter') {
      if (passwordCreateNewAccount === confirmPasswordCreateNewAccount) {
        signup();
      }
    }
  };

  return (
    <div className={classes.polaroidBox}>
      <div className={classes.login}>
        <div className={classes.spacing}>
          <ThemeProvider theme={textFieldTheme}>
            <TextField
              id="login email"
              label="Email"
              value={emailInput}
              onChange={(event) => {
                setEmailInput(event.target.value);
              }}
              onKeyDown={handleLoginEnterKey}
            />
          </ThemeProvider>
        </div>
        <div className={classes.spacing}>
          <ThemeProvider theme={textFieldTheme}>
            <TextField
              id="login password"
              label="Password"
              type="password"
              value={passwordInput}
              onChange={(event) => {
                setPasswordInput(event.target.value);
              }}
              onKeyDown={handleLoginEnterKey}
              helperText={loginError}
            />
          </ThemeProvider>
        </div>
        <div className={classes.spacing}>
          <Button className={classes.loginButton} onClick={handleLogin}>
            Login
          </Button>
        </div>
        <div className={classes.spacing}>
          <Button onClick={handleForgotPasswordOpen}>Forgot Password</Button>
          <Dialog open={openForgotPassword} onClose={handleForgotPasswordClose}>
            <DialogTitle>Forgot Password</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your email and we will begin with the process of
                changing your password
              </DialogContentText>
              <ThemeProvider theme={textFieldTheme}>
                <TextField
                  id="forgot password email"
                  label="Email"
                  fullWidth
                  value={emailForgotPassword}
                  onChange={(event) => {
                    setEmailForgotPassword(event.target.value);
                  }}
                  onKeyDown={handleForgotPasswordEnterKey}
                  helperText={emailForgotPasswordError}
                />
              </ThemeProvider>
            </DialogContent>
            <DialogActions>
              <Button
                className={classes.loginButton}
                onClick={handleForgotPassword}
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
                <ThemeProvider theme={textFieldTheme}>
                  <TextField
                    id="create new account email"
                    label="Email"
                    fullWidth
                    value={emailCreateNewAccount}
                    onChange={(event) => {
                      setEmailCreateNewAccount(event.target.value);
                    }}
                    onKeyDown={handleCreateNewAccountEnterKey}
                    error={emailCreateNewAccountError !== ' ' ? true : false}
                    helperText={emailCreateNewAccountError}
                  />
                </ThemeProvider>
              </div>
              <div className={classes.spacing}>
                <ThemeProvider theme={textFieldTheme}>
                  <TextField
                    id="create new account username"
                    label="Username"
                    fullWidth
                    value={usernameCreateNewAccount}
                    onChange={(event) => {
                      setUsernameCreateNewAccount(event.target.value);
                      setUsernameCreateNewAccountError(' ');
                    }}
                    error={usernameCreateNewAccountError !== ' ' ? true : false}
                    onKeyDown={handleCreateNewAccountEnterKey}
                    helperText={usernameCreateNewAccountError}
                  />
                </ThemeProvider>
              </div>
              <div className={classes.passwordSpacing}>
                <ThemeProvider theme={textFieldTheme}>
                  <TextField
                    id="create new account password"
                    label="Password"
                    type="password"
                    value={passwordCreateNewAccount}
                    onChange={(event) => {
                      setPasswordCreateNewAccount(event.target.value);
                      if (
                        event.target.value === confirmPasswordCreateNewAccount
                      ) {
                        setCreateNewAccountPasswordError(' ');
                      } else {
                        setCreateNewAccountPasswordError(
                          'Passwords do not match'
                        );
                      }
                    }}
                    onKeyDown={handleCreateNewAccountEnterKey}
                    error={createNewAccountPasswordError !== ' ' ? true : false}
                  />
                </ThemeProvider>
                <ThemeProvider theme={textFieldTheme}>
                  <TextField
                    id="create new account confirm password"
                    label="Confirm Password"
                    type="password"
                    value={confirmPasswordCreateNewAccount}
                    onChange={(event) => {
                      setConfirmPasswordCreateNewAccount(event.target.value);
                      if (passwordCreateNewAccount === event.target.value) {
                        setCreateNewAccountPasswordError(' ');
                      } else {
                        setCreateNewAccountPasswordError(
                          'Passwords do not match'
                        );
                      }
                    }}
                    onKeyDown={handleCreateNewAccountEnterKey}
                    helperText={createNewAccountPasswordError}
                    error={createNewAccountPasswordError !== ' ' ? true : false}
                  />
                </ThemeProvider>
              </div>
            </DialogContent>
            <DialogActions>
              <Button
                disabled={
                  !emailCreateNewAccount ||
                  !usernameCreateNewAccount ||
                  (usernameCreateNewAccountError !== ' ' ? true : false) ||
                  !passwordCreateNewAccount ||
                  !confirmPasswordCreateNewAccount ||
                  passwordCreateNewAccount !== confirmPasswordCreateNewAccount
                    ? true
                    : false
                }
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
      setLoginError(' ');
      props.history.push('/');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setLoginError('Invalid email format');
      } else if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password'
      ) {
        setLoginError('Email or password is incorrect');
      } else {
        setLoginError('Login error');
      }
    }
  }

  async function forgotPassword() {
    try {
      await firebase.passwordReset(emailForgotPassword);
      handleForgotPasswordClose();
      setEmailForgotPassword('');
      setEmailForgotPasswordError(' ');
    } catch (error) {
      if (error.code === 'auth/invalid-email') {
        setEmailForgotPasswordError('Invalid email format');
      } else {
        setEmailForgotPasswordError('Email does not exist');
      }
    }
  }

  async function signup() {
    try {
      if ((await firebase.checkUsername(usernameCreateNewAccount)) === true) {
        let err = 'auth/username-already-in-use';
        throw err;
      }
      await firebase.register(
        usernameCreateNewAccount,
        emailCreateNewAccount,
        passwordCreateNewAccount
      );
      handleCreateNewAccountClose();
      setUsernameCreateNewAccount('');
      setEmailCreateNewAccount('');
      setPasswordCreateNewAccount('');
      setConfirmPasswordCreateNewAccount('');
      setCreateNewAccountPasswordError(' ');
      setEmailCreateNewAccountError(' ');
      setUsernameCreateNewAccountError(' ');
    } catch (error) {
      //Weak password error
      if (error.code === 'auth/weak-password') {
        setCreateNewAccountPasswordError('Weak password');
      } else {
        setCreateNewAccountPasswordError(' ');
      }
      //Email already in use error
      if (error.code === 'auth/email-already-in-use') {
        setEmailCreateNewAccountError('Email already in use');
        return;
      } else {
        setEmailCreateNewAccountError(' ');
      }
      //Invalid email error
      if (error.code === 'auth/invalid-email') {
        setEmailCreateNewAccountError('Invalid email format');
        return;
      } else {
        setEmailCreateNewAccountError(' ');
      }
      //Username already in use error
      if (error === 'auth/username-already-in-use') {
        setUsernameCreateNewAccountError('Username already in use');
      } else {
        setUsernameCreateNewAccountError(' ');
      }
    }
  }
}

export default withRouter(Signin);
