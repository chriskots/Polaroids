import React from 'react';
import { fade, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, InputBase } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  flexCenter: {
    display: 'flex',
    justifyContent: 'center'
  },
  homeButton: {
    color: 'inherit',
    fontSize: '0.8rem'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.black, 0.1),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.2)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: 'auto',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputBaseRoot: {
    color: 'priamry'
  },
  inputBaseInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  }
}));

export default function TaskBar() {
  const classes = useStyles();

  //This function is a handler to make the scrollbar go back to the top of the screen
  const handleGoToTop = () => {
    console.log('to top');
  };

  return (
    <AppBar color="inherit">
      <Toolbar className={classes.flexCenter}>
        <Button
          type="submit"
          onClick={() => {
            handleGoToTop();
          }}
          className={classes.homeButton}
        >
          Polaroids
        </Button>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <Search />
          </div>
          <InputBase
            placeholder="Search"
            classes={{
              root: classes.inputBaseRoot,
              input: classes.inputBaseInput
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
}
