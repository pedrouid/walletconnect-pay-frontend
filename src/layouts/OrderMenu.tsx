import * as React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import Button from "../components/Button";
import Summary from "../components/Summary";
import ListItem from "../components/ListItem";
import EmptyState from "../components/EmptyState";
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
import { sanitizeImgSrc } from "../helpers/utilities";

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
    businessProfile,
    businessTax,
    businessPayment,
    businessMenu,
    items,
    checkout,
    onSubmit,
    onAdd,
    onRemove
  } = props;
  return (
    <React.Fragment>
      <SHeader>
        <Link style={{ display: "flex" }} to="/admin">
          {businessProfile.logo && (
            <SLogo src={sanitizeImgSrc(businessProfile.logo)} alt="" />
          )}
          <SBranding>{businessProfile.name}</SBranding>
        </Link>
      </SHeader>
      <SColumnWrapper>
        <SColumn width={70}>
          <SColumnHeader>
            <STitle>{`Menu`}</STitle>
          </SColumnHeader>
          {businessMenu && businessMenu.length ? (
            <SGrid itemMaxWidth={360} itemMaxHeight={150} gap={10}>
              {businessMenu &&
                businessMenu.map((item: IMenuItem) => (
                  <ListItem
                    key={`menu-${item.name}`}
                    item={item}
                    businessPayment={businessPayment}
                    onClick={() => onAdd(item)}
                  />
                ))}
            </SGrid>
          ) : (
            <EmptyState />
          )}
        </SColumn>
        <SColumnOrder width={30}>
          <SColumnHeader>
            <STitle>{`Order`}</STitle>
          </SColumnHeader>
          {items && items.length ? (
            <SColumnList>
              {items.map((item: IOrderItem) => (
                <SListItem
                  noImage
                  key={`order-${item.name}`}
                  item={item}
                  businessPayment={businessPayment}
                  actions={[
                    { label: "Remove", callback: onRemove },
                    { label: "Add", callback: onAdd }
                  ]}
                />
              ))}
            </SColumnList>
          ) : (
            <EmptyState />
          )}
          <SColumnFooter>
            <Summary
              checkout={checkout}
              businessTax={businessTax}
              businessPayment={businessPayment}
            />
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
