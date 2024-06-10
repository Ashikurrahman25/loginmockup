// src/ConnectWalletButton.js
import React, { useState } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { setupModal } from "@near-wallet-selector/modal-ui";
import "@near-wallet-selector/modal-ui/styles.css"



const ConnectWalletButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleConnectWallet = async () => {
    try {
      const selector = await setupWalletSelector({
        network: "testnet",
        modules: [setupMeteorWallet()],
      });

      const modal = setupModal(selector, {
        contractId: "spearonnear.near",
      });
      // modal.show();
      const wallet = await selector.wallet('meteor-wallet');
      const accounts = await wallet.signIn({ contractId: "spearonnear.near" });

      function sendMessageToUnity() {
        if (window.opener) {
          const messageObject = {
            accountId: accounts[0].accountId,  // Example accountId
            publicKey: accounts[0].publicKey     // Example publicKey
          };
          window.opener.postMessage(JSON.stringify(messageObject), "*");


          (async () => {
            const wallet = await selector.wallet("meteor-wallet");
            await wallet.signAndSendTransaction({
              signerId: accounts[0].accountId,
              receiverId: "nearobot.testnet",
              actions: [{
                type: "FunctionCall",
                params: {
                  methodName: "addMessage",
                  args: { text: "Hello World!" },
                  gas: "30000000000000",
                  deposit: "10000000000000000000000",
                }
              }]
            });
          })();

        } else {
          console.warn("No opener window found.");
        }
      }

      sendMessageToUnity();
      setIsLoggedIn(true);
      console.log(accounts[0]);

    } catch (error) {
      console.error("Error during wallet setup or sign-in:", error);
    }
  };

  const handleBackToGame = () => {
    window.close();
  };

  return (
    <div>
      {!isLoggedIn ? (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      ) : (
        <button onClick={handleBackToGame}>Back To Game</button>
      )}
    </div>
  );
};

export default ConnectWalletButton;