import * as React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import {
  IMenuItem,
  IBusinessMenu,
  IBusinessPayment
} from "../../helpers/types";
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

interface IInventoryProps {
  businessMenu: IBusinessMenu;
  businessPayment: IBusinessPayment;
  adminShowInventoryModal: (menuItem?: IMenuItem) => void;
}

const Inventory = (props: IInventoryProps) => {
  const { businessMenu, businessPayment } = props;
  return (
    <React.Fragment>
      {businessMenu && businessMenu.length ? (
        <SColumnList>
          {businessMenu.map((item: IMenuItem) => (
            <ListItem
              key={`inventory-${item.name}`}
              item={item}
              businessPayment={businessPayment}
              onClick={() => props.adminShowInventoryModal(item)}
            />
          ))}
        </SColumnList>
      ) : (
        <EmptyState message={`No Inventory`} />
      )}
      <SButtonWrapper>
        <Button onClick={props.adminShowInventoryModal}>{`Add Item`}</Button>
      </SButtonWrapper>
    </React.Fragment>
  );
};
const reduxProps = (store: any) => ({
  businessMenu: store.admin.businessMenu,
  businessPayment: store.admin.businessPayment
});

export default connect(
  reduxProps,
  { adminShowInventoryModal }
)(Inventory);
