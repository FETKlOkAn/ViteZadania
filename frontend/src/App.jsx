import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Username from './components/Username';
import UsernameNew from './components/UsernameNew';
import TestPage from './components/TestPage';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Username />} />
          <Route path="/newuser" element={<UsernameNew />} />
          <Route path="/user/test" element={<TestPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
