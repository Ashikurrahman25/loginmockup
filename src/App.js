import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ConnectWalletPage from './ConnectWalletPage';
import VerifyPage from './VerifyPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/verify/:parameterId" element={<VerifyPage />} />
          <Route path="/" element={<ConnectWalletPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
