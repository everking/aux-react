import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState } from 'react';

import './App.css';
import ArticleComponent from './ArticleComponent';
import MegaMenu from './MegaMenu';
function App() {
  const [currentMenuItem, setCurrentMenuItem] = useState(null);

  return (
    <div className="App">
      <Router>
        <MegaMenu currentMenuItem={currentMenuItem} setCurrentMenuItem={setCurrentMenuItem} />
        <div className='flex w-full justify-center bg-blue-200'>
          <div className='w-full max-h-full max-w-2xl bg-white p-5'>
            <Routes>
            <Route path="/auxilium" element={<ArticleComponent />} />
            <Route path="/auxilium/articles" element={<ArticleComponent />} />
            <Route path="/auxilium/articles/:articleId" element={<ArticleComponent />} />
            </Routes>
          </div>
        </div>
      </Router>
    </div>
  );
}

export default App;
