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
  SColumnTitle,
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
    loading,
    profile,
    settings,
    menu,
    items,
    checkout,
    onSubmit,
    onAdd,
    onRemove
  } = props;
  const ratio = 63.33;
  return (
    <React.Fragment>
      <SHeader>
        <Link style={{ display: "flex" }} to="/admin">
          {profile.logo && <SLogo src={sanitizeImgSrc(profile.logo)} alt="" />}
          <SBranding>{profile.name}</SBranding>
        </Link>
      </SHeader>
      <SColumnWrapper>
        <SColumn width={ratio}>
          <SColumnHeader>
            <SColumnTitle>{`Menu`}</SColumnTitle>
          </SColumnHeader>
          {menu && menu.length ? (
            <SGrid itemMaxWidth={280} itemMaxHeight={120} gap={10}>
              {menu &&
                menu.map((item: IMenuItem) => (
                  <ListItem
                    key={`menu-${item.name}`}
                    item={item}
                    settings={settings}
                    onClick={() => onAdd(item)}
                  />
                ))}
            </SGrid>
          ) : (
            <EmptyState loading={loading} />
          )}
        </SColumn>
        <SColumnOrder width={100 - ratio}>
          <SColumnHeader>
            <SColumnTitle>{`Order`}</SColumnTitle>
          </SColumnHeader>
          {items && items.length ? (
            <SColumnList>
              {items.map((item: IOrderItem) => (
                <SListItem
                  noImage
                  key={`order-${item.name}`}
                  item={item}
                  settings={settings}
                  actions={[
                    { label: "Remove", callback: onRemove },
                    { label: "Add", callback: onAdd }
                  ]}
                />
              ))}
            </SColumnList>
          ) : (
            <EmptyState loading={loading} />
          )}
          <SColumnFooter>
            <Summary checkout={checkout} settings={settings} />
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
