// src/App.js
import React from 'react';
import './App.css';
import ConnectWalletButton from './ConnectWalletButton';
import { Buffer } from 'buffer';
import VuplexPolyfill from './VuplexPolyfill';


if (!window.vuplex) {
  window.vuplex = new VuplexPolyfill();
}
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