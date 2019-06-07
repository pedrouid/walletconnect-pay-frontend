import * as React from "react";
import Web3Connect from "web3connect";

const AdminAuthentication = (props: any) => (
  <Web3Connect onConnect={props.onConnect} onClose={props.onClose} />
);

export default AdminAuthentication;
