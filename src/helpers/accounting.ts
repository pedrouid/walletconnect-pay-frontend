import { IAssetData, IAssetNativeBalance, IAvailableBalance } from "./types";
import SUPPORTED_ASSETS from "../constants/supportedAssets";
import ASSET_PRICES from "../constants/assetPrices";
import {
  convertStringToNumber,
  convertAmountFromRawNumber,
  multiply,
  add
} from "./bignumber";
import { apiGetTokenBalance, apiGetAccountBalance } from "./api";

export const defaultAvailableBalance = {
  assetBalances: [],
  total: "0"
};

export const accountingGetAvailableBalance = async (
  address: string,
  nativeCurrency: string
): Promise<IAvailableBalance> => {
  const assetPrices = ASSET_PRICES[nativeCurrency];
  const balances = await Promise.all(
    Object.keys(SUPPORTED_ASSETS).map(
      async (key: string): Promise<IAssetNativeBalance[]> => {
        const chainId = convertStringToNumber(key);
        const assets = SUPPORTED_ASSETS[chainId];
        const _balances = await Promise.all(
          Object.keys(assets).map(
            async (assetSymbol: string): Promise<IAssetNativeBalance> => {
              const asset = assets[assetSymbol];
              let result: IAssetData;
              if (asset.contractAddress) {
                result = await apiGetTokenBalance(
                  address,
                  chainId,
                  asset.contractAddress
                );
              } else {
                result = await apiGetAccountBalance(address, chainId);
              }
              let balance = "0";
              if (result.balance) {
                balance = multiply(
                  convertAmountFromRawNumber(result.balance, result.decimals),
                  assetPrices[assetSymbol]
                );
              }
              const assetNativeBalance: IAssetNativeBalance = {
                asset,
                balance
              };
              return assetNativeBalance;
            }
          )
        );
        return _balances;
      }
    )
  );
  const availableBalance: IAvailableBalance = defaultAvailableBalance;

  balances.flat(2).forEach((assetNativeBalance: IAssetNativeBalance) => {
    availableBalance.assetBalances.push(assetNativeBalance);
    availableBalance.total = add(
      availableBalance.total,
      assetNativeBalance.balance
    );
  });

  return availableBalance;
};
