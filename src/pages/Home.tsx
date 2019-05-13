import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Web3Connect from "web3connect";

const SPageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const STitle = styled.h4`
  /* margin: 0; */
`;

class Home extends React.Component<any, any> {
  public onConnect = (provider: any) =>
    console.log("[onConnect] provider", provider); // tslint:disable-line

  public onClose = () => console.log("[onClose]"); // tslint:disable-line

  public render() {
    return (
      <SPageWrapper>
        <STitle>{`WalletConnect Pay`}</STitle>
        <Web3Connect onConnect={this.onConnect} onClose={this.onClose} />
      </SPageWrapper>
    );
  }
}

export default connect(
  null,
  null
)(Home);
