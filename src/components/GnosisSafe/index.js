import React from 'react';
import { Card, Button } from "rimble-ui";
import CPK from 'contract-proxy-kit';

export default function GnosisSafe(props){
  const { web3, notify } = props;
  let cpk;

  let createSafe = async () => {
    cpk = await CPK.create({ web3 });
    console.log(cpk);
  };

  return (
    <Card bg={'background'}>
      <Button onClick={() => {createSafe()}}>Create Safe</Button>
    </Card>
  )
}
