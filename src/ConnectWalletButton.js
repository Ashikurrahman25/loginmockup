import React, { useState } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { providers } from 'near-api-js';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const ISMAINNET = false;

const ConnectWalletButton = ({ onWalletConnected }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleConnectWallet = async () => {
    try {
      const selector = await setupWalletSelector({
        network: ISMAINNET ? 'mainnet': 'testnet',
        modules: [setupMeteorWallet()],
      });

      const wallet = await selector.wallet('meteor-wallet');
      const accounts = await wallet.signIn({ contractId: "spearonnear.near" });

      const nearBalance = await getBalance(accounts[0].accountId);
      const tokenBalance = await viewMethod({
        networkId: ISMAINNET ? 'mainnet': 'testnet',
        contractId: ISMAINNET ? 'mainnet': 'splaunch.testnet',
        method: 'ft_balance_of',
        args: { account_id: accounts[0].accountId },
      });

      onWalletConnected({
        accountId: accounts[0].accountId,
        nearBalance,
        tokenBalance,
      });

      setIsLoggedIn(true);
    //   sendMessageToUnity(accounts);
      console.log(accounts);
    } catch (error) {
      console.error("Error during wallet setup or sign-in:", error);
    }
  };

  const getBalance = async (accountId) => {
    const provider = new providers.JsonRpcProvider({ url: ISMAINNET ? 'https://rpc.mainnet.near.org': 'https://rpc.testnet.near.org' });
    const account = await provider.query({ request_type: 'view_account', finality: 'final', account_id: accountId });
    return account.amount;
  };



  const viewMethod = async ({ networkId, contractId, method, args = {} }) => {
    const url = `https://rpc.${networkId}.near.org`;
    const provider = new providers.JsonRpcProvider({ url });

    const res = await provider.query({
      request_type: 'call_function',
      account_id: contractId,
      method_name: method,
      args_base64: Buffer.from(JSON.stringify(args)).toString('base64'),
      finality: 'optimistic',
    });

    return JSON.parse(Buffer.from(res.result).toString());
  };

  return (
    <>
     <p>Please connect your meteor wallet with our game in order to play and claim rewards!</p>
     <button className="btn btn-primary" onClick={handleConnectWallet}>Connect</button>
    </>
   
  );
};

export default ConnectWalletButton;
