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

const TOKEN_TRANSFER = "0xa9059cbb";

const SUPPORTED_ASSETS = {
  1: {
    ETH: {
      symbol: "ETH",
      name: "Ethereum",
      decimals: 18,
      contractAddress: ""
    },
    DAI: {
      symbol: "DAI",
      name: "DAI Stablecoin v1.0",
      decimals: 18,
      contractAddress: "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
    }
  },
  100: {
    DAI: {
      symbol: "xDAI",
      name: "xDAI",
      decimals: 18,
      contractAddress: ""
    }
  }
};

const ASSET_PRICE = {
  USD: {
    DAI: 1.0,
    ETH: 250
  },
  EUR: {
    DAI: 0.9,
    ETH: 225
  },
  GBP: {
    DAI: 0.8,
    ETH: 200
  }
};

export function getAsset(symbol: string, chainId: number) {
  let result = null;
  if (SUPPORTED_ASSETS[chainId]) {
    result = SUPPORTED_ASSETS[chainId][symbol] || null;
  }
  return result;
}

export function getAssetPrice(currency: string, symbol: string) {
  let result = null;
  if (ASSET_PRICE[currency]) {
    result = ASSET_PRICE[currency][symbol] || null;
  }
  return result;
}

export function isToken(asset: any) {
  return !!asset.contractAddress;
}

export async function formatTransaction(
  account: string,
  amount: number,
  currency: string,
  symbol: string,
  chainId: number
) {
  const from = account;
  const asset = getAsset(symbol, chainId);
  const price = getAssetPrice(currency, symbol);

  amount = convertStringToNumber(
    convertAmountToRawNumber(amount * price, asset.decimals)
  );

  let to: string = "";
  let value: string | number = "";
  let data: string = "";
  let gasLimit: string | number = "";

  if (isToken(asset)) {
    value = "0x00";
    to = asset.contractAddress;
    data = getDataString(TOKEN_TRANSFER, [
      removeHexPrefix(account),
      removeHexPrefix(convertStringToHex(amount))
    ]);
    gasLimit = await apiGetGasLimit(asset.contractAddress, data);
  } else {
    value = amount;
    to = account;
    data = "0x";
    gasLimit = 21000;
  }

  const nonce = await apiGetAccountNonce(account);
  const gasPrice = convertStringToNumber(
    convertAmountToRawNumber((await apiGetGasPrices()).average.price, 9)
  );

  const tx = {
    from: sanitizeHex(from),
    to: sanitizeHex(to),
    nonce: nonce || "",
    gasPrice: gasPrice || "",
    gasLimit: gasLimit || "",
    value: value || "",
    data: data || "0x"
  };

  console.log("tx", tx); // tslint:disable-line

  const parsedTx = parseTransactionData(tx);

  console.log("parsedTx BEFORE", parsedTx); // tslint:disable-line

  // parsedTx.gasLimit = "0x";

  // console.log("parsedTx AFTER", parsedTx); // tslint:disable-line

  return parsedTx;
}
