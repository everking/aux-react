import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import logo from './logo.svg';
import './App.css';
import ArticleComponent from './ArticleComponent';
import MegaMenu from './MegaMenu';
function App() {
  const [currentMenuItem, setCurrentMenuItem] = useState(null);
  return (
    <div className="App">
      <MegaMenu currentMenuItem={currentMenuItem} setCurrentMenuItem={setCurrentMenuItem} />
      <Router>
        <Routes>
          <Route path="/articles/:articleId" element={<ArticleComponent />} />
        </Routes>
      </Router>
      <div>Current Menu Item: {currentMenuItem}</div>
    </div>
  );
}

export default App;
