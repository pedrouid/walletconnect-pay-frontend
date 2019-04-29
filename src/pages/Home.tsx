import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors, fonts, shadows, transitions } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import Button from "../components/Button";
import Loader from "../components/Loader";
import {
  orderAddItem,
  orderRemoveItem,
  orderSubmit,
  orderUnsubmit
} from "../reducers/_order";
import { toFixed } from "../helpers/bignumber";
import QRCodeDisplay from "../components/QRCodeDisplay";
import arrow from "../assets/arrow.png";

const SPageWrapper = styled.div`
  position: relative;

  width: 100%;
  height: 100%;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: hidden;

  display: flex;
`;

interface IColumnStyleProps {
  width: number;
}

const SColumnStyleTypes = styled.div<IColumnStyleProps>``;
const SColumn = styled(SColumnStyleTypes)`
  transition: ${transitions.long};
  /* display: flex; */
  width: ${({ width }) => `${width}%`};
  border-right: 1px solid rgb(${colors.lightGrey});
  height: 100%;
  max-height: 100vh;

  &:last-child {
    border-right: none;
  }
`;

const SColumnOrder = styled(SColumn)`
  display: flex;
  flex-direction: column;
`;

const SColumnHeader = styled.div`
  border-bottom: 1px solid rgb(${colors.lightGrey});
  padding: 20px;
`;

const SColumnFooter = styled.div`
  border-top: 1px solid rgb(${colors.lightGrey});
  padding: 20px;
`;

const SColumnList = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  padding-bottom: 8%;
`;

const SColumnRowTitle = styled.div`
  font-size: ${fonts.size.large};
  color: rgb(${colors.dark});
`;

const SColumnRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgb(${colors.grey});
  margin-top: 8px;
  &:first-child {
    margin-top: 0;
  }
`;

const STitle = styled.h4`
  margin: 0;
`;

interface IListItemStyleProps {
  onClick?: any;
}

const SListItemStyleTypes = styled.div<IListItemStyleProps>``;
const SListItem = styled(SListItemStyleTypes)`
  transition: ${transitions.base};

  border-radius: 4px;
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

const SListItemDetails = styled.div`
  width: 100%;
`;

const SListItemName = styled.div`
  font-size: ${fonts.size.large};
`;

const SListItemDescription = styled.div`
  color: rgb(${colors.grey});
  margin-top: 8px;
`;

const SListItemPrice = styled.div`
  width: 100%;
  text-align: right;
  font-size: ${fonts.size.large};
`;

const SListItemQuantity = styled(SListItemPrice)``;

const SListItemSubtotal = styled(SListItemDescription)`
  text-align: right;
`;

interface IModalStyleProps {
  show: boolean;
}

const SModalStyleTypes = styled.div<IModalStyleProps>``;
const SModal = styled(SModalStyleTypes)`
  transition: ${transitions.long};
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100%;
  max-height: 100vh;
  background-color: rgb(${colors.white});
  transform: ${({ show }) =>
    show ? "translate3d(0, 0, 0)" : "translate3d(100vw, 0, 0)"};
`;

const SModalContainer = styled.div`
  width: 400px;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const SModalHeader = styled(SColumnHeader)`
  position: relative;
  display: flex;
  justify-content: center;
`;

const SModalCallToAction = styled(SListItemName)`
  text-align: center;
  margin: 0.6em 0;
  font-size: 24px;
  font-weight: 700;
`;

const SModalDescription = styled(SListItemDescription)`
  text-align: center;
`;

const SModalColumn = styled.div`
  width: 100%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  max-height: 100vh;
`;

const SModalFooter = styled(SColumnFooter)`
  border-top: 0;
`;

const SBackButton = styled.div`
  position: absolute;
  font-size: 16px;
  font-weight: 400;
  left: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  & img {
    width: 24px;
    height: 24px;
  }
`;

const menu = [
  {
    name: "Expresso",
    description: "Small cup with 1 shot",
    price: 2.5
  },
  {
    name: "Double Expresso",
    description: "Small cup with 2 shots",
    price: 3.0
  },
  {
    name: "Americano",
    description: "Large cup with 1 shot and hot water",
    price: 3.0
  },
  {
    name: "Latte",
    description: "Large cup with 1 shot and milk",
    price: 3.5
  },
  {
    name: "Cappuccino",
    description: "Large cup with 1 shot and foam",
    price: 3.5
  },
  {
    name: "Tea",
    description: "Large cup with loose leaf tea",
    price: 2.5
  },
  {
    name: "Blueberry Muffin",
    description: "Muffin with blueberries",
    price: 2.5
  },
  {
    name: "Chocolate Muffin",
    description: "Muffin with chocolate chips",
    price: 2.5
  },
  {
    name: "Scone",
    description: "Plain scope with jam",
    price: 2.5
  },
  {
    name: "Croissant",
    description: "Plain croissant",
    price: 2.5
  },
  {
    name: "Almond Croissant",
    description: "Croissant with almond filling",
    price: 2.5
  }
];

class Home extends React.Component<any, any> {
  public render() {
    const {
      loading,
      submitted,
      items,
      subtotal,
      tax,
      nettotal,
      uri
    } = this.props;
    return (
      <SPageWrapper>
        <SColumn width={items.length ? 70 : 100}>
          <SColumnHeader>
            <STitle>{`Menu`}</STitle>
          </SColumnHeader>
          <SColumnList>
            {menu.map((item: IMenuItem) => (
              <SListItem
                key={item.name}
                onClick={() => this.props.orderAddItem(item)}
              >
                <SListItemContainer>
                  <SListItemDetails>
                    <SListItemName>{item.name}</SListItemName>
                    <SListItemDescription>
                      {item.description}
                    </SListItemDescription>
                  </SListItemDetails>
                  <SListItemPrice>{`$ ${toFixed(
                    item.price,
                    2
                  )}`}</SListItemPrice>
                </SListItemContainer>
              </SListItem>
            ))}
          </SColumnList>
        </SColumn>
        <SColumnOrder width={items.length ? 30 : 0}>
          <SColumnHeader>
            <STitle>{`Order`}</STitle>
          </SColumnHeader>
          <SColumnList>
            {items.map((item: IOrderItem) => (
              <SListItem key={item.name}>
                <SListItemContainer>
                  <SListItemDetails>
                    <SListItemName>{item.name}</SListItemName>
                    <SListItemDescription>
                      {item.description}
                    </SListItemDescription>
                  </SListItemDetails>
                  <SListItemDetails>
                    <SListItemQuantity>{`x ${
                      item.quantity
                    }`}</SListItemQuantity>
                    <SListItemSubtotal>{`$ ${toFixed(
                      item.price * item.quantity,
                      2
                    )}`}</SListItemSubtotal>
                  </SListItemDetails>
                </SListItemContainer>
                <SListItemActions>
                  <SListItemButton
                    onClick={() => this.props.orderRemoveItem(item)}
                  >
                    <span>{"Remove"}</span>
                  </SListItemButton>
                  <SListItemButton
                    onClick={() => this.props.orderAddItem(item)}
                  >
                    <span>{"Add"}</span>
                  </SListItemButton>
                </SListItemActions>
              </SListItem>
            ))}
          </SColumnList>
          <SColumnFooter>
            <SColumnRow>
              <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
            </SColumnRow>
            <SColumnRow>
              <div>{`Sub Total`}</div>
              <div>{`$ ${toFixed(subtotal, 2)}`}</div>
            </SColumnRow>
            <SColumnRow>
              <div>{`Tax`}</div>
              <div>{`$ ${toFixed(tax, 2)}`}</div>
            </SColumnRow>
            <SColumnRow>
              <div>{`Net Total`}</div>
              <div>{`$ ${toFixed(nettotal, 2)}`}</div>
            </SColumnRow>
            <SColumnRow>
              <Button onClick={this.props.orderSubmit}>{`Pay`}</Button>
            </SColumnRow>
          </SColumnFooter>
        </SColumnOrder>

        <SModal show={submitted}>
          <SModalHeader>
            <SBackButton onClick={this.props.orderUnsubmit}>
              <img src={arrow} alt="" />
              <span>{`Back`}</span>
            </SBackButton>
            <STitle>{`Payment`}</STitle>
          </SModalHeader>
          {!loading ? (
            <SModalContainer>
              <SModalColumn>
                <QRCodeDisplay data={uri} />
                <SModalCallToAction>{`Scan with WalletConnect`}</SModalCallToAction>
                <SModalDescription>
                  {`Scan this QR code with your WalletConnect-enabled mobile wallet to pay.`}
                </SModalDescription>
              </SModalColumn>
              <SModalFooter>
                <SColumnRow>
                  <SColumnRowTitle>{`Summary`}</SColumnRowTitle>
                </SColumnRow>
                <SColumnRow>
                  <div>{`Sub Total`}</div>
                  <div>{`$ ${toFixed(subtotal, 2)}`}</div>
                </SColumnRow>
                <SColumnRow>
                  <div>{`Tax`}</div>
                  <div>{`$ ${toFixed(tax, 2)}`}</div>
                </SColumnRow>
                <SColumnRow>
                  <div>{`Net Total`}</div>
                  <div>{`$ ${toFixed(nettotal, 2)}`}</div>
                </SColumnRow>
              </SModalFooter>
            </SModalContainer>
          ) : (
            <SModalContainer>
              <Loader />
            </SModalContainer>
          )}
        </SModal>
      </SPageWrapper>
    );
  }
}

const reduxProps = (reduxState: any) => ({
  loading: reduxState.order.loading,
  submitted: reduxState.order.submitted,
  items: reduxState.order.items,
  subtotal: reduxState.order.subtotal,
  tax: reduxState.order.tax,
  nettotal: reduxState.order.nettotal,
  uri: reduxState.order.uri
});

export default connect(
  reduxProps,
  { orderAddItem, orderRemoveItem, orderSubmit, orderUnsubmit }
)(Home);
