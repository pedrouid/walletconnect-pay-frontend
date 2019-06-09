import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import { colors, shadows, transitions } from "../../styles";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { SIDEBAR_SIZE, HEADER_SIZE, CONTENT_PADDING } from "./dimensions";
import Loader from "../../components/Loader";
import { SCenter } from "../../components/common";

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

interface IContentContainerStyleProps {
  show?: boolean;
}

const SContentCard = styled.div<IContentContainerStyleProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
  border-radius: 6px;
  padding: ${CONTENT_PADDING * 2}px ${CONTENT_PADDING}px;
  box-shadow: ${shadows.soft};
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  overflow: hidden;
  & > * {
    transition: ${transitions.short.replace("all", "opacity")};
    flex: 1;
    opacity: ${({ show }) => (show ? 1 : 0)};
    visibility: ${({ show }) => (show ? "visible" : "hidden")};
    pointer-events: ${({ show }) => (show ? "auto" : "none")};
  }
`;

const SContentLoading = styled(SCenter)<IContentContainerStyleProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: ${transitions.short.replace("all", "opacity")};
  opacity: ${({ show }) => (show ? 1 : 0)};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  pointer-events: ${({ show }) => (show ? "auto" : "none")};
`;

const Dashboard = (props: any) => {
  const { children, match, loading } = props;
  const balance = 35245;
  const currency = "USD";
  return (
    <SWrapper>
      <Sidebar match={match} />
      <Header balance={balance} currency={currency} />
      <SContent>
        <SContentCard show={!loading}>{children}</SContentCard>
        <SContentLoading show={loading}>
          <SCenter>
            <Loader />
          </SCenter>
        </SContentLoading>
      </SContent>
    </SWrapper>
  );
};

Dashboard.propTypes = {
  children: PropTypes.node.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  center: PropTypes.bool,
  maxWidth: PropTypes.number
};

Dashboard.defaultProps = {
  center: false,
  maxWidth: undefined
};

export default Dashboard;
