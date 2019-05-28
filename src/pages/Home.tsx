import * as React from "react";
import { connect } from "react-redux";
import Web3Connect from "web3connect";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import { adminConnectWallet } from "../redux/_admin";

class Home extends React.Component<any, any> {
  public onConnect = (provider: any) => {
    console.log("[onConnect] provider", provider); // tslint:disable-line
    this.props.adminConnectWallet(provider);
  };

  public onClose = () => console.log("[onClose]"); // tslint:disable-line

  public render() {
    return (
      <PageWrapper row center>
        <Card shadow margin={20}>
          <h4>{`WalletConnect Pay`}</h4>
          <Web3Connect onConnect={this.onConnect} onClose={this.onClose} />
        </Card>
        <Card shadow margin={20}>
          <h4>{`Order Menu`}</h4>
          <Link to="/order/bufficorn">
            <Button>{"Demo"}</Button>
          </Link>
        </Card>
      </PageWrapper>
    );
  }
}

export default connect(
  null,
  { adminConnectWallet }
)(Home);
