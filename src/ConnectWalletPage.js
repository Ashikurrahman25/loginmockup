import React, { useState } from 'react';
import ConnectWalletButton from './ConnectWalletButton';

const ConnectWalletPage = () => {
  const [walletData, setWalletData] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);

  const handleWalletConnected = (data) => {
    setWalletData(data);
    setShowBackButton(true); // Show the back button once wallet is connected
  };


  const handleBackToGame = () => {
    if (window.opener) {
      const messageObject = {
          accountId: walletData.accountId,
          nearBal: (walletData.nearBalance / Math.pow(10, 24)).toFixed(2),
          spearBal: walletData.tokenBalance / Math.pow(10, 8)
      };
  
      const messageToSend = {
          identifier: "connection",
          data: messageObject
      };
    
      console.log(messageToSend); 
      window.opener.postMessage(JSON.stringify(messageToSend), "*"); 
      window.close(); 
  } else {
      console.warn("No opener window found.");
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h1 className="card-title">Connect Wallet</h1>
        {walletData ? (
          <>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td><strong>Account ID:</strong></td>
                  <td>{walletData.accountId}</td>
                </tr>
                <tr>
                  <td><strong>Near Balance:</strong></td>
                  <td>{(walletData.nearBalance/Math.pow(10,24)).toFixed(2)}</td>
                </tr>
                {/* <tr>
                  <td><strong>Spear Balance:</strong></td>
                  <td>{walletData.tokenBalance/Math.pow(10,8)}</td>
                </tr> */}
              </tbody>
            </table>

            <p>*This account will be connected with the game. You can only only connect 1 wallet for each game account!</p>
            {showBackButton && (
              <button className="btn btn-success" onClick={handleBackToGame}>Confirm Connection</button>
            )}
          </>
        ) : (
          <ConnectWalletButton onWalletConnected={handleWalletConnected} />
        )}
      </div>
    </div>
  );
};

export default ConnectWalletPage;
