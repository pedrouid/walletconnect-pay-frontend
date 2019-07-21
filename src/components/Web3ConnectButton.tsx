import * as React from "react";
import Web3Connect from "web3connect";

const Web3ConnectButton = (props: any) => (
  <Web3Connect.Button
    providerOptions={{
      portis: {
        id: process.env.REACT_APP_PORTIS_ID,
        network: props.network || "mainnet"
      },
      fortmatic: {
        key: process.env.REACT_APP_FORTMATIC_KEY
      }
    }}
    onConnect={props.onConnect}
    onClose={props.onClose}
  />
);

export default Web3ConnectButton;
