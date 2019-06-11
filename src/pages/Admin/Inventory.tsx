import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { IMenuItem, IMenu, ISettings } from "../../helpers/types";
import { adminShowInventoryModal } from "../../redux/_admin";
import ListItem from "../../components/ListItem";
import EmptyState from "../../components/EmptyState";
import { SColumnList } from "../../components/common";
import Button from "../../components/Button";
import { CONTENT_PADDING } from "../../constants/dashboard";

const SButtonWrapper = styled.div`
  position: absolute;
  bottom: ${CONTENT_PADDING * 2}px;
  right: ${CONTENT_PADDING * 2}px;
`;

const SListItem = styled(ListItem)`
  margin-bottom: 10px;
`;

interface IInventoryProps {
  menu: IMenu;
  settings: ISettings;
  adminShowInventoryModal: (menuItem?: IMenuItem) => void;
}

const Inventory = (props: IInventoryProps) => {
  const { menu, settings } = props;
  console.log("[OrderMenu] menu", menu); // tslint:disable-line
  console.log("[OrderMenu] settings", settings); // tslint:disable-line
  return (
    <React.Fragment>
      {menu && menu.length ? (
        <SColumnList>
          {menu.map((item: IMenuItem) => (
            <SListItem
              key={`inventory-${item.name}`}
              item={item}
              settings={settings}
              onClick={() => props.adminShowInventoryModal(item)}
            />
          ))}
        </SColumnList>
      ) : (
        <EmptyState message={`No Inventory`} />
      )}
      <SButtonWrapper>
        <Button
          onClick={() => props.adminShowInventoryModal()}
        >{`Add Item`}</Button>
      </SButtonWrapper>
    </React.Fragment>
  );
};
const reduxProps = (store: any) => ({
  menu: store.admin.menu,
  settings: store.admin.settings
});

export default connect(
  reduxProps,
  { adminShowInventoryModal }
)(Inventory);
