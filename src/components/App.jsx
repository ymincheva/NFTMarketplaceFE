import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from '../pages/Home';
import Mint from '../pages/Mint';
import Profile from '../pages/Profile';
import Collection from '../pages/Collection';
import Welcome from '../pages/Welcome';

import Header from './layout/Header';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Header />
        <div className="main">
          <Routes>
            <Route path="/" element={<Welcome />} /> 
            <Route path="home" element={<Home />} />     
            <Route path="mint" element={<Mint />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collection" element={<Collection />} />
          
          </Routes>
      
        </div>
      
      </div>
    </BrowserRouter>
  );
}

export default App;
