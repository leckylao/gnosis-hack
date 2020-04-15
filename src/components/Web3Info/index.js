import React, { useState, useEffect, useCallback } from 'react';
import NetworkIndicator from "@rimble/network-indicator";

export default function Web3Info(props) {
  const { web3 } = props;

  const [networkId, setNetworkId] = useState(0);

  const getNetworkId = useCallback( async() => {
    let networkType = await web3.eth.net.getNetworkType();
    let networkId = "Unknown";
    switch (networkType) {
      case "mainnet":
        networkId = 1;
        break;
      case "kovan":
        networkId = 42;
        break;
      case "ropsten":
        networkId = 3;
        break;
      case "rinkeby":
        networkId = 4;
        break;
      case "goerli":
        networkId = 5;
        break;
      default:
        break;
    }
    setNetworkId(networkId);
  }, [web3]);

  useEffect(() => {
    getNetworkId();
  }, [web3, getNetworkId]);

  return (
    <NetworkIndicator currentNetwork={networkId} requiredNetwork={4}>
      {{
        onNetworkMessage: "Connected to correct network",
        noNetworkMessage: "Not connected to anything",
        onWrongNetworkMessage: "Wrong network"
      }}
    </NetworkIndicator>
  )
}
