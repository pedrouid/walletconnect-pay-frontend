import * as React from "react";
import { connect } from "react-redux";
// import Web3Connect from "web3connect";
import PageWrapper from "../components/PageWrapper";
import Button from "../components/Button";
import { adminConnectWallet } from "../reducers/_admin";

class Home extends React.Component<any, any> {
  public onConnect = (provider: any) => {
    console.log("[onConnect] provider", provider); // tslint:disable-line
    this.props.adminConnectWallet(provider);
  };

  public onClose = () => console.log("[onClose]"); // tslint:disable-line

  public render() {
    return (
      <PageWrapper center>
        <Button>{`Test`}</Button>
        {/* <h4>{`WalletConnect Pay`}</h4> */}
        {/* <Web3Connect onConnect={this.onConnect} onClose={this.onClose} /> */}
      </PageWrapper>
    );
  }
}

export default connect(
  null,
  { adminConnectWallet }
)(Home);
