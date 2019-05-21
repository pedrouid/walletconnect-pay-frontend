import * as React from "react";
import styled from "styled-components";
import { colors, fonts, shadows, transitions } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import { toFixed } from "../helpers/bignumber";
import {
  SListItemImage,
  SListItemText,
  SListItemName,
  SListItemDescription
} from "../components/common";

interface IListItemStyleProps {
  onClick?: any;
}

const SListItem = styled.div<IListItemStyleProps>`
  transition: ${transitions.base};

  border-radius: 6px;
  border: 1px solid rgb(${colors.lightGrey});
  margin-bottom: 16px;

  transform: translate3d(0, 0, 0);
  box-shadow: ${shadows.base};

  ${({ onClick }) =>
    onClick &&
    `
    cursor: pointer;
    @media (hover: hover) {
      &:hover {
        transform: translate3d(0, -1px, 0);
        box-shadow: ${shadows.hover};
      }
    }
  `}
`;

const SListItemContainer = styled.div`
  width: 100%;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
`;

const SListItemActions = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px solid rgb(${colors.lightGrey});
`;

const SListItemButton = styled.div`
  transition: ${transitions.base};
  width: 100%;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(${colors.grey});
  font-weight: ${fonts.weight.semibold};
  border-right: 1px solid rgb(${colors.lightGrey});
  cursor: pointer;
  &:last-child {
    border-right: none;
  }
  @media (hover: hover) {
    &:hover span {
      transform: translate3d(0, -1px, 0);
    }
  }
`;

interface IListItemDetailsStyleProps {
  alignRight?: boolean;
}

const SListItemDetails = styled.div<IListItemDetailsStyleProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${({ alignRight }) =>
    alignRight ? "flex-end" : "flex-start"};
`;

const SListItemPrice = styled.div`
  width: 100%;
  text-align: right;
  font-size: ${fonts.size.large};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const SListItemQuantity = styled(SListItemPrice)``;

const SListItemSubtotal = styled(SListItemDescription)`
  text-align: right;
`;

function isOrderItem(object: any): object is IOrderItem {
  return "quantity" in object;
}

interface IListItemAction {
  label: string;
  callback: (item: IOrderItem | IMenuItem) => void;
}

interface IListItemProps {
  item: IOrderItem | IMenuItem;
  actions?: IListItemAction[];
  noImage?: boolean;
  onClick?: any;
}

const ListItem = ({
  item,
  actions,
  noImage,
  onClick,
  ...props
}: IListItemProps) => (
  <SListItem key={item.name} onClick={onClick} {...props}>
    <SListItemContainer>
      <SListItemDetails>
        {!!item.image && !noImage && (
          <SListItemImage>
            <img src={item.image} alt={item.name} />
          </SListItemImage>
        )}
        <SListItemText>
          <SListItemName>{item.name}</SListItemName>
          <SListItemDescription>{item.description}</SListItemDescription>
        </SListItemText>
      </SListItemDetails>
      {isOrderItem(item) ? (
        <SListItemDetails alignRight>
          <SListItemText>
            <SListItemQuantity>{`x ${item.quantity}`}</SListItemQuantity>
            <SListItemSubtotal>{`$ ${toFixed(
              item.price * item.quantity,
              2
            )}`}</SListItemSubtotal>
          </SListItemText>
        </SListItemDetails>
      ) : (
        <SListItemPrice>{`$ ${toFixed(item.price, 2)}`}</SListItemPrice>
      )}
    </SListItemContainer>
    {actions && actions.length && (
      <SListItemActions>
        {actions.map((action: IListItemAction) => (
          <SListItemButton onClick={() => action.callback(item)}>
            <span>{action.label}</span>
          </SListItemButton>
        ))}
      </SListItemActions>
    )}
  </SListItem>
);

export default ListItem;
