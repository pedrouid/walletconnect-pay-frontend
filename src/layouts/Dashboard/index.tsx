import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { colors, shadows } from "../../styles";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { SIDEBAR_SIZE, HEADER_SIZE, CONTENT_PADDING } from "./dimensions";

const SWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
`;

const SContent = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - ${HEADER_SIZE}px);
  z-index: 1;
  padding: ${CONTENT_PADDING}px;
  margin-top: ${HEADER_SIZE}px;
  margin-left: ${SIDEBAR_SIZE}px;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const SContentCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100%;
  border-radius: 6px;
  padding: ${CONTENT_PADDING * 2}px ${CONTENT_PADDING}px;
  box-shadow: ${shadows.soft};
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  overflow: hidden;
`;

const Dashboard = (props: any) => {
  const balance = 35245;
  const currency = "USD";
  return (
    <SWrapper>
      <Sidebar match={props.match} />
      <Header balance={balance} currency={currency} />
      <SContent>
        <SContentCard>{props.children}</SContentCard>
      </SContent>
    </SWrapper>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
  match: PropTypes.object.isRequired,
  center: PropTypes.bool,
  maxWidth: PropTypes.number
};

Dashboard.defaultProps = {
  center: false,
  maxWidth: undefined
};

export default Dashboard;
