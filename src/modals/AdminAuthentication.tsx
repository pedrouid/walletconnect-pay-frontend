import * as React from "react";
import Web3Connect from "web3connect";

const AdminAuthentication = (props: any) => (
  <React.Fragment>
    <h5>{`Business Login`}</h5>
    <Web3Connect.Button onConnect={props.onConnect} onClose={props.onClose} />
  </React.Fragment>
);

export default AdminAuthentication;
