const handlePayment = async () => {

    try {
        const selector = await setupWalletSelector({
          network: "testnet",
          modules: [setupMeteorWallet()],
        });


  
    const wallet = await selector.wallet('meteor-wallet');
    const tr = await wallet.signAndSendTransaction({
    signerId: "nearobot.testnet",
    receiverId: "splaunch.testnet",
    actions: [{
      type: "FunctionCall",
      params: {
        methodName: "ft_transfer",
        args: {receiver_id: "splaunch.testnet", amount: amountToPay, memo: "Entry fee for a match on SpearOnNear Game 1"},
        gas: 30000000000000,
        deposit: 1
      }
    }]
  });