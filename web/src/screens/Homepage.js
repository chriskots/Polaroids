import React from 'react';
import TaskBar from '../components/TaskBar';

export default function Homepage(props) {
  console.log('home');
  console.log(props);
  return (
    <>
      <TaskBar />
    </>
  );
}
