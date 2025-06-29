import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Caution from './Caution';
import Logo from './Logo';
import Form from './Form';
import PreSurvey from './PreSurvey';
import Quote from './Quote';
import Story from './Story';
import PostSurvey from './PostSurvey';
import ResultCard from './ResultCard';
import './App.css';

function App() {
  console.log('App component rendered'); // Debug
  
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Caution />} />   
        <Route path="/logo" element={<Logo />} />
        <Route path="/form" element={<Form />} />
        <Route path="/presurvey/:id" element={<PreSurvey />} />
        <Route path="/quote/:id" element={<Quote />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/postsurvey/:id" element={<PostSurvey />} />
        <Route path="/resultcard/:id" element={<ResultCard />} />
        {/* Fallback route for debugging */}
        <Route path="*" element={<div style={{padding: '2rem', textAlign: 'center'}}>
          <h1>404 - หน้าไม่พบ</h1>
          <p>เส้นทาง: {window.location.pathname}</p>
          <p>Debug: Quote route should match /quote/:id</p>
        </div>} />
      </Routes>
    </div>
  );
}

export default App;