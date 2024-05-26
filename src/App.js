// src/App.js
import React from 'react';
import './App.css';
import ConnectWalletButton from './ConnectWalletButton';
import { Buffer } from 'buffer';

window.Buffer = Buffer;
const App = () => {
  return (
    <div className="container">
      <h1>Welcome to Meteor Wallet Integration</h1>
      <ConnectWalletButton />
    </div>
  );
};

export default App;