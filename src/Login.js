import React, { useState } from 'react';
import firebaseAuth from './firebaseAuth';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await firebaseAuth.login(email, password);
      if (user.idToken) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        console.error('Error during login:', user);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <GoogleLogin />
    </div>
  );
};

export default Login;