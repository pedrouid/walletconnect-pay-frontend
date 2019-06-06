import { utils } from "ethers";
import { convertHexToNumber } from "@walletconnect/utils";
import { IChainData } from "./types";
import { convertStringToNumber, handleSignificantDecimals } from "./bignumber";
import SUPPORTED_CHAINS from "../constants/chains";
import BUSINESS_TYPES from "../constants/businessTypes";
import NATIVE_CURRENCIES from "../constants/nativeCurrencies";
import COUNTRIES from "../constants/countries";
import { IPFS_GATEWAY } from "../constants/ipfs";
import { APP_DESCRIPTION, APP_NAME } from "src/constants/appMeta";

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

export function getUrlProtocol(url: string): string {
  const protocolRegex = new RegExp(/(?:\w+):\/\//);

  let protocol = "";

  const matches = protocolRegex.exec(url);

  if (matches) {
    protocol = matches[0];
  }

  return protocol;
}

export function sanitizeUrl(url: string): string {
  const protocol = getUrlProtocol(url);

  if (protocol) {
    url = url.replace(protocol, "");
  }

  let result = url.replace(/\/+/g, "/").replace(/\/+$/, "");

  if (protocol) {
    result = protocol + result;
  }

  return result;
}

export function payloadId(): number {
  const datePart: number = new Date().getTime() * Math.pow(10, 3);
  const extraPart: number = Math.floor(Math.random() * Math.pow(10, 3));
  const id: number = datePart + extraPart;
  return id;
}

export function uuid(): string {
  const result: string = ((a?: any, b?: any) => {
    for (
      b = a = "";
      a++ < 36;
      b +=
        (a * 51) & 52
          ? (a ^ 15 ? 8 ^ (Math.random() * (a ^ 20 ? 16 : 4)) : 4).toString(16)
          : "-"
    ) {
      // empty
    }
    return b;
  })();
  return result;
}

export function getChainData(chainId: number): IChainData {
  const chainData = SUPPORTED_CHAINS.filter(
    (chain: any) => chain.chain_id === chainId
  )[0];

  if (!chainData) {
    throw new Error("ChainId missing or not supported");
  }

  return chainData;
}

export function getChainIdFromNetworkId(networkId: number): number | null {
  let result = null;

  const chainData = SUPPORTED_CHAINS.filter(
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

export function getNativeCurrency(symbol: string) {
  return NATIVE_CURRENCIES[symbol] || null;
}

export function formatDisplayAmount(amount: number, symbol: string) {
  const nativeCurrency = getNativeCurrency(symbol);
  let decimals = 2;
  let result = handleSignificantDecimals(`${amount}`, decimals);
  if (nativeCurrency) {
    decimals = nativeCurrency.decimals;
    const { symbol, alignment } = nativeCurrency;
    const _amount = handleSignificantDecimals(`${amount}`, decimals);
    result =
      alignment === "left" ? `${symbol} ${_amount}` : `${_amount} ${symbol}`;
  }
  return result;
}

export function getCountryName(code: string): string {
  let name = "";

  if (code.trim()) {
    const country = COUNTRIES.filter((chain: any) => chain.code === code)[0];

    if (!country) {
      throw new Error("Country missing or not supported");
    }

    name = country.name;
  }

  return name;
}

export function getBusinessType(type: string): string {
  let name = "";

  if (type.trim()) {
    const businessType = BUSINESS_TYPES.filter(
      (chain: any) => chain.type === type
    )[0];

    if (!businessType) {
      throw new Error("Business type missing or not supported");
    }

    name = businessType.display_name;
  }

  return name;
}

export function getAppVersion() {
  let version = process.env.REACT_APP_VERSION || "0.0.1";
  if (version) {
    const arr = version.split(".").slice(0, 2);
    if (convertStringToNumber(arr[0]) >= 1) {
      arr[1] = "x";
    }
    version = arr.join("_");
  }
  return version;
}

export function getIpfsUrl(fileHash: string) {
  const result = `${IPFS_GATEWAY}${fileHash}`;
  return result;
}

export function getIpfsHash(url: string) {
  const result = url.replace(IPFS_GATEWAY, "");
  return result;
}

export function updateTitle(title: string) {
  if (typeof document !== "undefined") {
    document.title = title;
  }
}

export function updateMetaTag(name: string, attribute: string, value: string) {
  const meta = document.querySelector(`meta[name="${name}"]`);
  if (meta) {
    meta.setAttribute(attribute, value);
  }
}

export function updateFavicon(href: string) {
  if (typeof document !== "undefined") {
    const link: any =
      document.querySelector("link[rel*='icon']") ||
      document.createElement("link");
    link.rel = "shortcut icon";
    link.href = href;
    document.getElementsByTagName("head")[0].appendChild(link);
  }
}

export function updatePageMeta(meta: any) {
  updateTitle(meta.title);
  updateMetaTag("description", "content", meta.description);
  updateFavicon(meta.favicon);
}

export function revertPageMeta() {
  updateTitle(APP_NAME);
  updateMetaTag("description", "content", APP_DESCRIPTION);
  updateFavicon("/favicon.ico");
}
