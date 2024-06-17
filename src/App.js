import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import './App.css';
import ArticleComponent from './ArticleComponent';
import MegaMenu from './MegaMenu';
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import AuthHandler from './AuthHandler';
import PrivateRoute from "./PrivateRoute";
import { AuthProvider } from "./AuthContext";

function App() {
  const [currentMenuItem, setCurrentMenuItem] = useState(null);

  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <MegaMenu currentMenuItem={currentMenuItem} setCurrentMenuItem={setCurrentMenuItem} />
        <div className='flex w-full justify-center bg-blue-200'>
          <div className='w-full max-h-full max-w-2xl bg-white p-5'>
            <Routes>
            <Route path="/auxilium/articles/home" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<AuthHandler />} />
            <Route path="/" element={<ArticleComponent />} />
            <Route path="/auxilium" element={<ArticleComponent />} />
            <Route path="/auxilium/articles" element={<ArticleComponent />} />
            <Route path="/auxilium/articles/:articleId" element={<ArticleComponent />} />
            </Routes>
          </div>
        </div>
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
