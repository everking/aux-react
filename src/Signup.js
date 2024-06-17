import React, { useState } from 'react';
import firebaseAuth from './firebaseAuth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const user = await firebaseAuth.signUp(email, password);
      if (user.idToken) {
        localStorage.setItem('user', JSON.stringify(user));
        navigate('/');
      } else {
        console.error('Error during signup:', user);
      }
    } catch (error) {
      console.error('Error during signup:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;