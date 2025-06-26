import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Caution from './Caution';
import Logo from './Logo';
import Form from './Form';
import PreSurvey from './PreSurvey';
import Story from './Story';
import PostSurvey from './PostSurvey';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Caution />} />   
        <Route path="/logo" element={<Logo />} />
        <Route path="/form" element={<Form />} />
        <Route path="/presurvey/:id" element={<PreSurvey />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/postsurvey/:id" element={<PostSurvey />} />
      </Routes>
    </div>
  );
}

export default App;