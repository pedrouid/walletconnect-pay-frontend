import * as React from "react";
import Web3ConnectButton from "../components/Web3ConnectButton";

const AdminAuthentication = (props: any) => (
  <React.Fragment>
    <h5>{`Business Login`}</h5>
    <Web3ConnectButton onConnect={props.onConnect} onClose={props.onClose} />
  </React.Fragment>
);

export default AdminAuthentication;
