import React, { useState, useEffect, useCallback } from 'react';
import NetworkIndicator from "@rimble/network-indicator";

export default function Web3Info(props) {
  const { web3, networkId } = props;

  const [currentNetworkId, setNetworkId] = useState(0);

  const getNetworkId = useCallback( async() => {
    let networkType = await web3.eth.net.getNetworkType();
    let currentNetworkId = "Unknown";
    switch (networkType) {
      case "mainnet":
        currentNetworkId = 1;
        break;
      case "kovan":
        currentNetworkId = 42;
        break;
      case "ropsten":
        currentNetworkId = 3;
        break;
      case "rinkeby":
        currentNetworkId = 4;
        break;
      case "goerli":
        currentNetworkId = 5;
        break;
      default:
        break;
    }
    setNetworkId(currentNetworkId);
  }, [web3]);

  useEffect(() => {
    getNetworkId();
  }, [web3, getNetworkId]);

  return (
    <NetworkIndicator currentNetwork={currentNetworkId} requiredNetwork={networkId}>
      {{
        onNetworkMessage: "Connected to correct network",
        noNetworkMessage: "Not connected to anything",
        onWrongNetworkMessage: "Wrong network"
      }}
    </NetworkIndicator>
  )
}
