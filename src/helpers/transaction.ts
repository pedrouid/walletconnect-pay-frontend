import {
  convertAmountToRawNumber,
  convertStringToHex,
  convertStringToNumber
} from "../helpers/bignumber";
import {
  apiGetAccountNonce,
  apiGetGasLimit,
  apiGetGasPrices
} from "../helpers/api";
import {
  getDataString,
  removeHexPrefix,
  sanitizeHex,
  parseTransactionData
} from "../helpers/utilities";
import FUNCTIONS from "../constants/functions";
import SUPPORTED_ASSETS from "../constants/supportedAssets";
import ASSET_PRICES from "../constants/assetPrices";

export function getAsset(symbol: string, chainId: number) {
  let result = null;
  if (SUPPORTED_ASSETS[chainId]) {
    result = SUPPORTED_ASSETS[chainId][symbol] || null;
  }
  return result;
}

export function getAssetPrice(currency: string, symbol: string) {
  let result = null;
  if (ASSET_PRICES[currency]) {
    result = ASSET_PRICES[currency][symbol] || null;
  }
  return result;
}

export function isToken(asset: any) {
  return !!asset.contractAddress;
}

export async function formatTransaction(
  from: string,
  to: string,
  amount: number,
  currency: string,
  symbol: string,
  chainId: number
) {
  const asset = getAsset(symbol, chainId);
  const price = getAssetPrice(currency, symbol);

  amount = convertStringToNumber(
    convertAmountToRawNumber(
      price ? amount * (1 / price) : amount,
      asset ? asset.decimals : 18
    )
  );

  let value: string | number = "";
  let data: string = "";
  let gasLimit: string | number = "";

  if (isToken(asset)) {
    const tokenAddress = asset ? asset.contractAddress : "";
    value = "0x00";
    data = getDataString(FUNCTIONS.TOKEN_TRANSFER, [
      removeHexPrefix(to),
      removeHexPrefix(convertStringToHex(amount))
    ]);
    gasLimit = await apiGetGasLimit(tokenAddress, data, chainId);
    to = tokenAddress;
  } else {
    value = amount;
    data = "0x";
    gasLimit = 21000;
  }

  const nonce = await apiGetAccountNonce(from);

  let gasPrice;

  if (chainId === 100) {
    const fixedGasPrice = 1.1;
    gasPrice = convertStringToNumber(
      convertAmountToRawNumber(fixedGasPrice, 9)
    );
  } else {
    const gasPrices = await apiGetGasPrices();
    gasPrice = convertStringToNumber(
      convertAmountToRawNumber(gasPrices.average.price, 9)
    );
  }

  const tx = {
    from: sanitizeHex(from),
    to: sanitizeHex(to),
    nonce: nonce || "",
    gasPrice: gasPrice || "",
    gasLimit: gasLimit || "",
    value: value || "",
    data: data || "0x"
  };

  const parsedTx = parseTransactionData(tx);

  return parsedTx;
}
