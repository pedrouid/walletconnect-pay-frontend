import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import Button from "../components/Button";
import Summary from "../components/Summary";
import ListItem from "../components/ListItem";
import {
  SColumnWrapper,
  SColumn,
  SColumnOrder,
  SColumnHeader,
  SColumnFooter,
  SColumnList,
  SColumnRow,
  STitle,
  SGrid
} from "../components/common";

const SHeader = styled.div`
  width: 100%;
  background-color: rgb(${colors.darkBlue});
  color: rgb(${colors.white});
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 82px;
`;

const SBranding = styled.h1`
  text-transform: uppercase;
  font-size: 24px;
  margin: 4px 0px;
  margin-left: 10px;
`;

const SLogo = styled.img`
  border-radius: 6px;
  width: 40px;
  height: 40px;
`;

const SListItem = styled(ListItem)`
  margin-bottom: 10px;
`;

const OrderMenu = (props: any) => {
  const {
    businessData,
    businessMenu,
    items,
    checkout,
    onSubmit,
    onAdd,
    onRemove
  } = props;
  const ratio = 70;
  return (
    <React.Fragment>
      <SHeader>
        <Link style={{ display: "flex" }} to="/admin">
          {businessData.profile.logo && (
            <SLogo src={businessData.profile.logo} alt="" />
          )}
          <SBranding>{businessData.profile.name}</SBranding>
        </Link>
      </SHeader>
      <SColumnWrapper>
        <SColumn width={items.length ? ratio : 100}>
          <SColumnHeader>
            <STitle>{`Menu`}</STitle>
          </SColumnHeader>
          <SGrid itemMaxWidth={360} itemMaxHeight={150} gap={10}>
            {businessMenu &&
              businessMenu.map((item: IMenuItem) => (
                <ListItem
                  key={`menu-${item.name}`}
                  item={item}
                  businessData={businessData}
                  onClick={() => onAdd(item)}
                />
              ))}
          </SGrid>
        </SColumn>
        <SColumnOrder width={items.length ? 100 - ratio : 0}>
          <SColumnHeader>
            <STitle>{`Order`}</STitle>
          </SColumnHeader>
          <SColumnList>
            {items.map((item: IOrderItem) => (
              <SListItem
                noImage
                key={`order-${item.name}`}
                item={item}
                businessData={businessData}
                actions={[
                  { label: "Remove", callback: onRemove },
                  { label: "Add", callback: onAdd }
                ]}
              />
            ))}
          </SColumnList>
          <SColumnFooter>
            <Summary checkout={checkout} businessData={businessData} />
            <SColumnRow>
              <Button marginTop={12} onClick={onSubmit}>{`Pay`}</Button>
            </SColumnRow>
          </SColumnFooter>
        </SColumnOrder>
      </SColumnWrapper>
    </React.Fragment>
  );
};

export default OrderMenu;
