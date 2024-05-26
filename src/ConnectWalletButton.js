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
          
        //   modal.show();
          const wallet = await selector.wallet('meteor-wallet');
          const accounts = await wallet.signIn({ contractId: "spearonnear.near" });


          if (window.vuplex) {
            // The window.vuplex object already exists, so go ahead and send the message.
            sendMessageToCSharp();
        } else {
            // The window.vuplex object hasn't been initialized yet because the page is still
            // loading, so add an event listener to send the message once it's initialized.
            window.addEventListener('vuplexready', sendMessageToCSharp);
        }
        
        function sendMessageToCSharp() {
            // This object passed to postMessage() automatically gets serialized as JSON
            // and is emitted via the C# MessageEmitted event. This API mimics the window.postMessage API.
            window.vuplex.postMessage({ type: 'greeting', message: 'Hello from JavaScript!' });
        }

        console.log(accounts[0]);

    } catch (error) {
      console.error("Error during wallet setup or sign-in:", error);
    }

  };

  return (
    <button onClick={handleConnectWallet}>Connect Wallet</button>
  );
};

export default ConnectWalletButton;
