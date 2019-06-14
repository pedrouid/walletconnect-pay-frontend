import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Icon from "../../components/Icon";
import { colors } from "../../styles";
import { formatPathname, isActivePath } from "../../helpers/utilities";
import { APP_LOGO, APP_NAME } from "../../constants/appMeta";

import overview from "../../assets/navigation/overview.svg";
import inventory from "../../assets/navigation/inventory.svg";
import orders from "../../assets/navigation/orders.svg";
import accounting from "../../assets/navigation/accounting.svg";
import settings from "../../assets/navigation/settings.svg";

import { SIDEBAR_SIZE } from "../../constants/dashboard";

const SSidebar = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;

  flex-direction: column;
  align-items: center;
  z-index: 0;
  width: ${SIDEBAR_SIZE}px;
  height: 100vh;
  background: rgb(${colors.darkBlue});
  color: rgb(${colors.white});
`;

const SAppLogo = styled.div`
  width: 100%;
  margin: 35px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  & img {
    width: 100%;
    max-width: 75px;
  }
`;

const SNavigation = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: scroll;
  padding-bottom: 8%;
  & > a {
    width: 100%;
    padding-left: 35px;
    margin: 0.5em 0;
  }
  @media (hover: hover) {
    & > a:hover {
      opacity: 0.8;
    }
  }
`;

const SNavigationItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const SNavigationIcon = styled(Icon)`
  margin-right: 16px;
`;

interface INavigatioNameStyleProps {
  active?: boolean;
}
const SNavigationName = styled.h6<INavigatioNameStyleProps>`
  color: ${({ active }) =>
    active ? `rgb(${colors.lightBlue})` : `rgb(${colors.white})`};
`;

interface INavigationItem {
  name: string;
  path: string;
  icon: string;
}

const navigation: INavigationItem[] = [
  {
    name: "Overview",
    path: "/",
    icon: overview
  },
  {
    name: "Inventory",
    path: "/inventory",
    icon: inventory
  },
  {
    name: "Orders",
    path: "/orders",
    icon: orders
  },
  {
    name: "Accounting",
    path: "/accounting",
    icon: accounting
  },
  {
    name: "Settings",
    path: "/settings",
    icon: settings
  }
];

const Sidebar = (props: any) => (
  <SSidebar>
    <SAppLogo>
      <img src={APP_LOGO} alt={APP_NAME} />
    </SAppLogo>
    <SNavigation>
      {navigation.map(item => {
        const pathname = formatPathname(item.path, props.match);
        const active = isActivePath(item.path, props.match);
        return (
          <Link key={pathname} to={pathname}>
            <SNavigationItem>
              <SNavigationIcon
                icon={item.icon}
                size={25}
                color={active ? "lightBlue" : "white"}
              />
              <SNavigationName active={active}>{item.name}</SNavigationName>
            </SNavigationItem>
          </Link>
        );
      })}
    </SNavigation>
  </SSidebar>
);

export default Sidebar;
