// src/ConnectWalletButton.js
import React from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css"


const ConnectWalletButton = () => {
  const handleConnectWallet = async () => {
    try {
        const selector = await setupWalletSelector({
            network: "mainnet",
            modules: [setupMeteorWallet()],
          });
          
          const modal = setupModal(selector, {
            contractId: "spearonnear.near",
          });
          sendMessageToUnity();
          modal.show();
        //   const wallet = await selector.wallet('meteor-wallet');
        //   const accounts = await wallet.signIn({ contractId: "spearonnear.near" });


        function sendMessageToUnity(message) {
          if (window.opener) {

            var messageObject = {
  name: "John Doe",  // Example name
  balance: 1234.56   // Example balance
};
window.opener.postMessage(JSON.stringify(messageObject), "*"); 
          } else {
              console.warn("No opener window found.");
          }
      }
   

        // console.log(accounts[0]);

    } catch (error) {
      console.error("Error during wallet setup or sign-in:", error);
    }

  };

  return (
    <button onClick={handleConnectWallet}>Connect Wallet</button>
  );
};

export default ConnectWalletButton;
