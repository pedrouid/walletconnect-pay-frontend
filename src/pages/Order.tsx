import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { colors, fonts, transitions } from "../styles";
import { IMenuItem, IOrderItem } from "../helpers/types";
import Button from "../components/Button";
import Loader from "../components/Loader";
import {
  orderAddItem,
  orderRemoveItem,
  orderSubmit,
  orderUnsubmit
} from "../redux/_order";
import { toFixed } from "../helpers/bignumber";
import QRCodeDisplay from "../components/QRCodeDisplay";
import ListItem from "../components/ListItem";
import arrow from "../assets/arrow.png";
import success from "../assets/success.png";
import error from "../assets/error.png";
import logo from "../assets/logo.png";

const SHeader = styled.div`
  width: 100%;
  background-color: rgb(${colors.dark});
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

const SColumn = styled.div<IColumnStyleProps>`
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

const SListItemName = styled.div`
  font-size: ${fonts.size.large};
`;

const SListItemDescription = styled.div`
  color: rgb(${colors.grey});
  margin-top: 8px;
`;

interface IModalStyleProps {
  show: boolean;
}

const SModal = styled.div<IModalStyleProps>`
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

const SPaymentResult = styled.div`
  width: 100%;
  padding-top: 100%;
  position: relative;

  & > div {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > div > img {
    width: 150px;
    height: 150px;
  }
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

class Order extends React.Component<any, any> {
  public render() {
    const {
      menu,
      loading,
      submitted,
      items,
      subtotal,
      tax,
      nettotal,
      payment,
      uri
    } = this.props;
    return (
      <React.Fragment>
        <SHeader>
          <SLogo src={logo} alt="" />
          <SBranding>{"Bufficorn Cafe"}</SBranding>
        </SHeader>
        <SPageWrapper>
          <SColumn width={items.length ? 70 : 100}>
            <SColumnHeader>
              <STitle>{`Menu`}</STitle>
            </SColumnHeader>
            <SColumnList>
              {menu.map((item: IMenuItem) => (
                <ListItem
                  key={item.name}
                  item={item}
                  onClick={() => this.props.orderAddItem(item)}
                />
              ))}
            </SColumnList>
          </SColumn>
          <SColumnOrder width={items.length ? 30 : 0}>
            <SColumnHeader>
              <STitle>{`Order`}</STitle>
            </SColumnHeader>
            <SColumnList>
              {items.map((item: IOrderItem) => (
                <ListItem
                  noImage
                  key={item.name}
                  item={item}
                  actions={[
                    { label: "Remove", callback: this.props.orderRemoveItem },
                    { label: "Add", callback: this.props.orderAddItem }
                  ]}
                />
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
                {!payment ? (
                  <SModalColumn>
                    <QRCodeDisplay data={uri} />
                    <SModalCallToAction>{`Scan with WalletConnect`}</SModalCallToAction>
                    <SModalDescription>
                      {`Scan this QR code with your WalletConnect-enabled mobile wallet to pay.`}
                    </SModalDescription>
                  </SModalColumn>
                ) : payment && payment.success ? (
                  <SModalColumn>
                    <SPaymentResult>
                      <div>
                        <img src={success} alt="Success" />
                      </div>
                    </SPaymentResult>
                    <SModalCallToAction>{`Success`}</SModalCallToAction>
                    <SModalDescription>
                      {`Your payment went through and your order is being prepared.`}
                    </SModalDescription>
                  </SModalColumn>
                ) : (
                  <SModalColumn>
                    <SPaymentResult>
                      <div>
                        <img src={error} alt="Failed" />
                      </div>
                    </SPaymentResult>
                    <SModalCallToAction>{`Payment Failed`}</SModalCallToAction>
                    <SModalDescription>
                      {`Please check your wallet to for any transaction information.`}
                    </SModalDescription>
                  </SModalColumn>
                )}
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
      </React.Fragment>
    );
  }
}

const reduxProps = (store: any) => ({
  menu: store.order.menu,
  loading: store.order.loading,
  submitted: store.order.submitted,
  items: store.order.items,
  subtotal: store.order.subtotal,
  tax: store.order.tax,
  nettotal: store.order.nettotal,
  uri: store.order.uri,
  payment: store.order.payment
});

export default connect(
  reduxProps,
  { orderAddItem, orderRemoveItem, orderSubmit, orderUnsubmit }
)(Order);
