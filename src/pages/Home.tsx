import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Web3Connect from "web3connect";
import { Link } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import Card from "../components/Card";
import Button from "../components/Button";
import { adminConnectWallet } from "../redux/_admin";
import Banner from "../components/Banner";

const SBanner = styled(Banner)`
  position: absolute;
  top: 60px;
`;

const SDemoButton = styled(Button)`
  border-radius: 24px;
  margin: 4px auto;
  padding: 12px 24px;
`;

class Home extends React.Component<any, any> {
  public onConnect = (provider: any) => this.props.adminConnectWallet(provider);

  public render() {
    return (
      <PageWrapper row center>
        <SBanner />
        <Card shadow margin={20}>
          <h4>{`Business Login`}</h4>
          <Web3Connect
            onConnect={this.onConnect}
            onClose={() => {
              // do nothing
            }}
          />
        </Card>
        <Card shadow margin={20}>
          <h4>{`Order Menu`}</h4>
          <Link to="/demo/bufficorn-cafe">
            <SDemoButton>{"Demo"}</SDemoButton>
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
