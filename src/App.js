import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './home.jsx';
import Room from './room.jsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/newroom/:id" element={<Room />} />
      </Routes>
    </Router>
  );
};

export default App;