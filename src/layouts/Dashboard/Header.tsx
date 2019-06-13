import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import ProfileCard from "../../components/ProfileCard";
import { colors, shadows } from "../../styles";

import {
  SIDEBAR_SIZE,
  HEADER_SIZE,
  CONTENT_PADDING
} from "../../constants/dashboard";

const SHeader = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;

  justify-content: center;
  width: 100%;
  z-index: 2;
  width: calc(100% - ${SIDEBAR_SIZE}px);
  padding: ${CONTENT_PADDING}px ${CONTENT_PADDING * 2}px;
  margin-left: ${SIDEBAR_SIZE}px;
  height: ${HEADER_SIZE}px;
  background: rgb(${colors.white});
  color: rgb(${colors.dark});
  box-shadow: ${shadows.soft};
`;

const SHeaderSection = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const SHeaderLeft = styled(SHeaderSection)`
  align-items: flex-start;
`;

const SHeaderRight = styled(SHeaderSection)`
  align-items: flex-end;
`;

const SMenuButton = styled(Button)`
  font-size: 16px;
`;

const Header = (props: any) => {
  const { profile, balance, settings } = props;
  return (
    <SHeader>
      <SHeaderLeft>
        <ProfileCard
          profile={profile}
          totalBalance={balance.total}
          nativeCurrency={settings.paymentCurrency}
        />
      </SHeaderLeft>
      <SHeaderRight>
        <Link to="/order">
          <SMenuButton>{"Go To Menu"}</SMenuButton>
        </Link>
      </SHeaderRight>
    </SHeader>
  );
};

export default Header;
