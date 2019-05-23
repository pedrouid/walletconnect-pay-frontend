import { utils } from "ethers";
import { IChainData } from "./types";
import supportedChains from "./chains";
import { ITxData } from "@walletconnect/types";
import {
  isValidAddress,
  convertUtf8ToNumber,
  convertNumberToHex,
  convertHexToNumber
} from "@walletconnect/utils";

export function capitalize(string: string): string {
  return string
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function ellipseText(
  text: string = "",
  maxLength: number = 9999
): string {
  if (text.length <= maxLength) {
    return text;
  }
  const _maxLength = maxLength - 3;
  let ellipse = false;
  let currentLength = 0;
  const result =
    text
      .split(" ")
      .filter(word => {
        currentLength += word.length;
        if (ellipse || currentLength >= _maxLength) {
          ellipse = true;
          return false;
        } else {
          return true;
        }
      })
      .join(" ") + "...";
  return result;
}

export const padLeft = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : new Array(length - n.length + 1).join(z) + n;
};

export const padRight = (n: string, length: number, z?: string): string => {
  z = z || "0";
  n = n + "";
  return n.length >= length ? n : n + new Array(length - n.length + 1).join(z);
};

export const getDataString = (func: string, arrVals: any[]): string => {
  let val = "";
  for (let i = 0; i < arrVals.length; i++) {
    val += padLeft(arrVals[i], 64);
  }
  const data = func + val;
  return data;
};

export function isHexString(value: any): boolean {
  return utils.isHexString(value);
}

export function sanitizeHex(hex: string): string {
  hex = removeHexPrefix(hex);
  hex = hex.length % 2 !== 0 ? "0" + hex : hex;
  if (hex) {
    hex = addHexPrefix(hex);
  }
  return hex;
}

export function addHexPrefix(hex: string): string {
  if (hex.toLowerCase().substring(0, 2) === "0x") {
    return hex;
  }
  return "0x" + hex;
}

export function removeHexPrefix(hex: string): string {
  if (hex.toLowerCase().substring(0, 2) === "0x") {
    return hex.substring(2);
  }
  return hex;
}

export function parseTransactionData(
  txData: Partial<ITxData>
): Partial<ITxData> {
  if (typeof txData.from === "undefined" || !isValidAddress(txData.from)) {
    throw new Error(`Transaction object must include a valid 'from' value.`);
  }

  function parseHexValues(value: number | string) {
    let result = value;
    if (value !== "") {
      if (!utils.isHexString(value)) {
        if (typeof value === "string") {
          value = convertUtf8ToNumber(value);
        }
        result = convertNumberToHex(value);
      } else {
        if (typeof value === "string") {
          result = sanitizeHex(value);
        }
      }
    }
    return result;
  }

  const txDataRPC = {
    from: sanitizeHex(txData.from),
    to: typeof txData.to === "undefined" ? "" : sanitizeHex(txData.to),
    gasPrice:
      typeof txData.gasPrice === "undefined"
        ? ""
        : parseHexValues(txData.gasPrice),
    gasLimit:
      typeof txData.gasLimit === "undefined"
        ? typeof txData.gas === "undefined"
          ? ""
          : parseHexValues(txData.gas)
        : parseHexValues(txData.gasLimit),
    value:
      typeof txData.value === "undefined" ? "" : parseHexValues(txData.value),
    nonce:
      typeof txData.nonce === "undefined" ? "" : parseHexValues(txData.nonce),
    data: typeof txData.data === "undefined" ? "" : sanitizeHex(txData.data)
  };

  const prunable = ["gasPrice", "gasLimit", "value", "nonce"];
  Object.keys(txDataRPC).forEach((key: string) => {
    if (!txDataRPC[key].trim().length && prunable.includes(key)) {
      delete txDataRPC[key];
    }
  });

  return txDataRPC;
}

export function payloadId(): number {
  const datePart: number = new Date().getTime() * Math.pow(10, 3);
  const extraPart: number = Math.floor(Math.random() * Math.pow(10, 3));
  const id: number = datePart + extraPart;
  return id;
}

export function getChainData(chainId: number): IChainData {
  const chainData = supportedChains.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  return chainData;
}

export function getChainIdFromNetworkId(networkId: number): number | null {
  let result = null;

  const chainData = supportedChains.filter(
    (chain: any) => chain.network_id === networkId
  )[0];

  if (chainData) {
    result = chainData.chain_id;
  }

  return result;
}

export async function queryChainId(web3: any) {
  const chainIdRes = await web3.currentProvider.send("eth_chainId", []);

  let chainId = convertHexToNumber(sanitizeHex(addHexPrefix(`${chainIdRes}`)));

  if (!chainId) {
    const networkIdRes = await web3.currentProvider.send("net_version", []);

    const networkId = convertHexToNumber(
      sanitizeHex(addHexPrefix(`${networkIdRes}`))
    );

    if (networkId) {
      const _chainId = getChainIdFromNetworkId(networkId);

      if (_chainId) {
        chainId = _chainId;
      }
    }
  }
  return chainId;
}
