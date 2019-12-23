import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginButton: {
    color: 'inherit',
    textDecoration: 'none'
  },
  login: {
    fontSize: '20px',
    textAlign: 'center',
    padding: '150px'
  },
  spacing: {
    padding: '10px'
  }
}));

const CssTextField = withStyles({
  root: {
    '& label.Mui-focused': {
      color: 'black'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'black'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'black'
      },
      '&:hover fieldset': {
        borderColor: 'black'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'black'
      }
    }
  }
})(TextField);

export default function Signin() {
  const classes = useStyles();
  //Login input variables
  const [usernameInput, setUsernameInput] = useState('');
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
    setConfirmPasswordCreateNewAccount
  ] = useState('');
  const [openCreateNewAccount, setOpenCreateNewAccount] = useState(false);

  //This function is a handler for when the user clicks the login button to use the login functionality
  const handleLogin = () => {
    console.log(
      'login and go to /home here pass props',
      usernameInput,
      'and',
      passwordInput
    );
  };

  //This function is a handler for when the user clicks the enter key to use the login functionality
  const handleLoginEnterKey = event => {
    if (event.key === 'Enter') {
      console.log(
        'login and go to /home here pass props',
        usernameInput,
        'and',
        passwordInput
      );
    }
  };

  const handleForgetPasswordOpen = () => {
    setOpenForgetPassword(true);
  };

  const handleForgetPasswordClose = () => {
    setOpenForgetPassword(false);
  };

  const handleForgetPassword = () => {
    console.log('forget password with', emailForgetPassword);
  };

  const handleForgetPasswordEnterKey = event => {
    if (event.key === 'Enter') {
      console.log('forget password with', emailForgetPassword);
    }
  };

  const handleCreateNewAccountOpen = () => {
    setOpenCreateNewAccount(true);
  };

  const handleCreateNewAccountClose = () => {
    setOpenCreateNewAccount(false);
  };

  const handleCreateNewAccount = () => {
    console.log(
      'create new account with',
      emailCreateNewAccount,
      usernameCreateNewAccount,
      passwordCreateNewAccount,
      confirmPasswordCreateNewAccount
    );
  };

  const handleCreateNewAccountEnterKey = event => {
    if (event.key === 'Enter') {
      console.log(
        'create new account with',
        emailCreateNewAccount,
        usernameCreateNewAccount,
        passwordCreateNewAccount,
        confirmPasswordCreateNewAccount
      );
    }
  };

  return (
    <div className={classes.login}>
      <div className={classes.spacing}>
        <CssTextField
          id="username"
          label="Username"
          value={usernameInput}
          onChange={event => {
            setUsernameInput(event.target.value);
          }}
          onKeyPress={handleLoginEnterKey}
        />
      </div>
      <div className={classes.spacing}>
        <CssTextField
          id="password"
          label="Password"
          type="password"
          value={passwordInput}
          onChange={event => {
            setPasswordInput(event.target.value);
          }}
          onKeyPress={handleLoginEnterKey}
        />
      </div>
      <div className={classes.spacing}>
        <Button className={classes.loginButton} onClick={handleLogin}>
          <Link to="/home" className={classes.loginButton}>
            Login
          </Link>
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
              id="email"
              label="Email"
              fullWidth
              value={emailForgetPassword}
              onChange={event => {
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
                id="email"
                label="Email"
                fullWidth
                value={emailCreateNewAccount}
                onChange={event => {
                  setEmailCreateNewAccount(event.target.value);
                }}
                onKeyPress={handleCreateNewAccountEnterKey}
              ></CssTextField>
            </div>
            <div className={classes.spacing}>
              <CssTextField
                id="username"
                label="Username"
                fullWidth
                value={usernameCreateNewAccount}
                onChange={event => {
                  setUsernameCreateNewAccount(event.target.value);
                }}
                onKeyPress={handleCreateNewAccountEnterKey}
              ></CssTextField>
            </div>
            <div className={classes.spacing}>
              <CssTextField
                id="password"
                label="Password"
                value={passwordCreateNewAccount}
                onChange={event => {
                  setPasswordCreateNewAccount(event.target.value);
                }}
                onKeyPress={handleCreateNewAccountEnterKey}
              ></CssTextField>
              <CssTextField
                id="confirm password"
                label="Confirm Password"
                value={confirmPasswordCreateNewAccount}
                onChange={event => {
                  setConfirmPasswordCreateNewAccount(event.target.value);
                }}
                onKeyPress={handleCreateNewAccountEnterKey}
              ></CssTextField>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              className={classes.loginButton}
              onClick={handleCreateNewAccount}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}
