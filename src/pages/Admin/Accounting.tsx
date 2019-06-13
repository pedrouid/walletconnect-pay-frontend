import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { SGrid, SListItemName, SLabel, SField } from "../../components/common";
import { IAssetNativeBalance } from "../../helpers/types";
import {
  convertAmountFromRawNumber,
  convertStringToNumber,
  handleSignificantDecimals
} from "../../helpers/bignumber";
import {
  formatDisplayAmount,
  getPaymentMethodDisplay
} from "../../helpers/utilities";
import { fonts } from "../../styles";
import ImageWithFallback from "../../components/ImageWithFallback";

const SRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const SColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SAssetName = styled(SListItemName)`
  margin-left: 10px;
  font-weight: ${fonts.weight.semibold};
`;

const SAssetLabel = styled(SLabel)`
  margin-top: 8px;
`;

const SAssetField = styled(SField)`
  margin: 0;
  margin-top: 4px;
  font-weight: ${fonts.weight.normal};
  font-size: ${fonts.size.smallMedium};
`;

const Accounting = (props: any) => {
  const { assetBalances, loadingBalance } = props.balance;

  return (
    <React.Fragment>
      {!loadingBalance && (assetBalances && assetBalances.length) ? (
        <SGrid itemMaxWidth={210} itemMaxHeight={160} gap={10}>
          {assetBalances.map((assetBalance: IAssetNativeBalance) => {
            const { asset, balance } = assetBalance;
            // TODO: Find a more elegant solution to display DAI as bellow
            const assetName = asset.name.replace("Dai Stablecoin v1.0", "DAI");
            const key = `${assetName}-${asset.symbol}`;
            const display = getPaymentMethodDisplay(asset.symbol);
            const assetAmount = `${handleSignificantDecimals(
              convertAmountFromRawNumber(asset.balance || "0", asset.decimals),
              asset.decimals
            )} ${asset.symbol}`;
            const balanceAmount = formatDisplayAmount(
              convertStringToNumber(balance.amount),
              balance.currency
            );
            return (
              <Card shadow key={key}>
                <SColumn>
                  <SRow>
                    <ImageWithFallback
                      size={30}
                      src={display.imgSrc}
                      alt={asset.symbol}
                      fallbackText={asset.symbol}
                    />
                    <SAssetName>{assetName}</SAssetName>
                  </SRow>
                  <SColumn>
                    <SAssetLabel>{`Amount`}</SAssetLabel>
                    <SAssetField>{assetAmount}</SAssetField>
                    <SAssetLabel>{`Balance`}</SAssetLabel>
                    <SAssetField>{balanceAmount}</SAssetField>
                  </SColumn>
                </SColumn>
              </Card>
            );
          })}
        </SGrid>
      ) : (
        <EmptyState loading={loadingBalance} message={`No Accounting Data`} />
      )}
    </React.Fragment>
  );
};

const reduxProps = (store: any) => ({
  loadingBalance: store.admin.loadingBalance,
  balance: store.admin.balance
});

export default connect(
  reduxProps,
  null
)(Accounting);
