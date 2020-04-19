// Blocknative
import Onboard from 'bnc-onboard';
import Notify from "bnc-notify";

import Web3 from 'web3';
import React, { useState, useEffect, useCallback } from 'react';
import { Box } from "rimble-ui";

// Components
import Web3Info from './components/Web3Info/index.js';
import GnosisSafe from './components/GnosisSafe/index.js';
import Header from './components/Header/index.js';

export default function App() {
  let web3 = new Web3(Web3.givenProvider);
  let currentState;
  // const infuraToken = process.env.REACT_APP_INFURA_ID || '95202223388e49f48b423ea50a70e336';
  const BNC_APIKey = process.env.REACT_APP_BNC_APIKey;
  const networkId = 4;
  const [connected, setConnected] = useState(false);

  const notify = Notify({
    dappId: BNC_APIKey,
    networkId: networkId
  });

  const onboard = Onboard({
    dappId: BNC_APIKey,
    networkId: networkId,
    subscriptions: {
      wallet: wallet => {
        web3 = new Web3(wallet.provider)
      }
    }
  });
  // const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${infuraToken}`))

  const init = useCallback(async () => {
    await onboard.walletSelect();
    let connected = await onboard.walletCheck();
    setConnected(connected);
  }, [onboard]);

  useEffect(() => {
    if(!connected)
      init();
  }, [init, onboard, connected]);

  if(connected){
    currentState = onboard.getState();
  }

  return (
    <div>
      <Header />
      {connected && (
        <Box>
          <Web3Info web3={web3} account={currentState.address} />
          <GnosisSafe web3={web3} notify={notify} account={currentState.address} />
        </Box>
      )}
    </div>
  );
}
