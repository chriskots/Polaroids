import React from 'react';
import TaskBar from '../components/TaskBar';
import ErrorMessage from '../components/ErrorMessage';
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

export default function ErrorPage() {
  const classes = useStyles();
  return (
    <div className={classes.taskBarSpacing}>
      <TaskBar />
      <ErrorMessage />
    </div>
  );
}
