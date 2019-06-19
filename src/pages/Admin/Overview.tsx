import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { SGrid } from "../../components/common";
import { fonts } from "../../styles";
import { formatDisplayAmount } from "../../helpers/utilities";
import { IOrderJson } from "../../helpers/types";
import { PAYMENT_PENDING } from "../../constants/paymentStatus";

const SColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const SOverviewLabel = styled.div`
  margin: 0;
  font-weight: ${fonts.weight.medium};
  font-size: ${fonts.size.h4};
`;

const SOverviewField = styled.div`
  margin: 0;
  margin-top: 8px;
  font-weight: ${fonts.weight.semibold};
  font-size: ${fonts.size.h2};
`;

const Overview = (props: any) => {
  const { match, loading, address, balance, orders } = props;
  return (
    <React.Fragment>
      {!loading && address ? (
        <SGrid itemMaxWidth={210} itemMaxHeight={160} gap={10}>
          <Link to={`${match.url}/accounting`}>
            <Card shadow>
              <SColumn>
                <SOverviewLabel>{`Available Balance`}</SOverviewLabel>
                <SOverviewField>
                  {formatDisplayAmount(
                    balance.total.amount,
                    balance.total.currency
                  )}
                </SOverviewField>
              </SColumn>
            </Card>
          </Link>
          <Link to={`${match.url}/orders`}>
            <Card shadow>
              <SColumn>
                <SOverviewLabel>{`Pending Orders`}</SOverviewLabel>
                <SOverviewField>
                  {
                    orders.filter(
                      (order: IOrderJson) =>
                        order.payment.status === PAYMENT_PENDING
                    ).length
                  }
                </SOverviewField>
              </SColumn>
            </Card>
          </Link>
        </SGrid>
      ) : (
        <EmptyState loading={loading} message={`No Overview Data`} />
      )}
    </React.Fragment>
  );
};

const reduxProps = (store: any) => ({
  loading: store.admin.loading,
  address: store.admin.address,
  balance: store.admin.balance,
  orders: store.admin.orders
});

export default connect(
  reduxProps,
  null
)(Overview);
