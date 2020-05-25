import React from 'react';
import TaskBar from '../components/TaskBar';
import Messages from '../components/Messages';
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

export default function MessagesPage() {
  const classes = useStyles();
  return (
    <div className={classes.taskBarSpacing}>
      <TaskBar />
      <Messages />
    </div>
  );
}
