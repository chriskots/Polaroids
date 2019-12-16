import React from 'react';
import Signin from '../components/Signin';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  // const login = () => {};

  return (
    <>
      <Signin />
      <Link to="/home">
        <button>Login</button>
      </Link>
    </>
  );
}
