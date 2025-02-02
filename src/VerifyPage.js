import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupMeteorWallet } from '@near-wallet-selector/meteor-wallet';
import { providers } from 'near-api-js';
import { Buffer } from 'buffer';
import 'bootstrap/dist/css/bootstrap.min.css';
window.Buffer = Buffer;

const ISMAINNET = false;
const VerifyPage = () => {

  const { signerId, contractId, amount, contract } = useParams();
  const [walletData, setWalletData] = useState(null);
  const [amountToPay, setAmountToPay] = useState('1000000000'); // example amount
  const [transactionId, setTransactionId] = useState(null);
  const [error, setError] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (amount) {
      setAmountToPay(amount * Math.pow(10, 8)); // assuming amount needs scaling
    }
  }, [amount]);

  
  const handleVerify = async () => {
    try {
      const selector = await setupWalletSelector({
        network: ISMAINNET ? 'mainnet': 'testnet',
        modules: [setupMeteorWallet()],
      });

  // setAmountToPay(amount*Math.pow(10,8));


      const wallet = await selector.wallet('meteor-wallet');
      const accounts = await wallet.signIn({ contractId: contractId });
      const accountId = accounts[0].accountId;

      if (accountId !== signerId) {
        setError('Account ID does not match.');
        return;
      }

      console.log(contractId,amount)

  
      const nearBalance = await getBalance(signerId);
      const tokenBalance = await viewMethod({
        networkId: ISMAINNET ? 'mainnet': 'testnet',
        contractId: contractId,
        method: 'ft_balance_of',
        args: { account_id: signerId },
      });

      setWalletData({
        signerId,
        nearBalance,
        tokenBalance,
      });

      setError(null);
    } catch (error) {
      console.error("Error during verification:", error);
      setError("Verification failed.");
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

  const handlePayment = async () => {
    try {
      const selector = await setupWalletSelector({
        network:  ISMAINNET ? 'mainnet': 'testnet',
        modules: [setupMeteorWallet()],
      });

      const wallet = await selector.wallet('meteor-wallet');
      const tr = await wallet.signAndSendTransaction({
        signerId: {signerId},
        receiverId: contractId,
        actions: [{
          type: "FunctionCall",
          params: {
            methodName: "ft_transfer",
            args: {receiver_id: "speargames.testnet", amount: amountToPay, memo: "Entry fee for a match on SpearOnNear Game"},
            gas: 10000000000000,
            deposit: 1
          }
        }]
      });

      console.log(tr);
      setTransactionId(tr.transaction?.hash); // Replace "example_transaction_id" with the actual transaction ID
      setPaymentDone(true); // Payment done, show only success message
    } catch (error) {
      console.error("Error during payment:", error);
      setError("Payment failed.");
    }
  };

  function onBack(){
    if (window.opener) {
        const messageObject = {
            success: true,
            identifier: 'payment',
            txnLink:  ISMAINNET ? `https://nearblocks.io/txns/${transactionId}`: `https://testnet.nearblocks.io/txns/${transactionId}`
        };

        window.opener.postMessage(JSON.stringify(messageObject), "*");
        window.close();
      } else {
        console.warn("No opener window found.");
      }
  }

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h1 className="card-title">Verify Payment</h1>
        {walletData ? (
          <>
            {paymentDone ? (
              <>
                <p className="mt-3">
                  <strong>Payment Successful!</strong> <a href={ISMAINNET ? `https://nearblocks.io/txns/${transactionId}`: `https://testnet.nearblocks.io/txns/${transactionId}`} target="_blank" rel="noopener noreferrer">View Transaction</a>
                </p>
                <button className="btn btn-secondary mt-3" onClick={onBack} >Back to Game</button>
              </>
            ) : (
              <>
                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td><strong>Account ID:</strong></td>
                      <td>{walletData.signerId}</td>
                    </tr>
              
                    <tr>
                      <td><strong>Amount to Pay:</strong></td>
                      <td>{amountToPay/Math.pow(10,8)} {contract}</td>
                    </tr>
                  </tbody>
                </table>
                {!transactionId && (

                    <button className="btn btn-primary mt-3" onClick={handlePayment}>Confirm Payment</button>
                    
                )}
              </>
            )}
          </>
        ) : (
          <>
           <p>You have to pay {amountToPay/Math.pow(10,8)} {contract} tokens to play the game </p>
            <button className="btn btn-primary" onClick={handleVerify}>Verify Wallet</button>
            {error && <p className="text-danger mt-3">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
