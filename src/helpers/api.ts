import axios, { AxiosInstance } from "axios";
import { IGasPrices } from "./types";
import { payloadId } from "./utilities";
import { convertHexToString } from "./bignumber";

const api: AxiosInstance = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiGetAccountNonce = async (address: string): Promise<number> => {
  const chainId = 1
  const response = await api.get(`/account-nonce?address=${address}&chainId=${chainId}`);
  const { result } = response.data;
  return result;
};

export const apiGetGasPrices = async (): Promise<IGasPrices> => {
  const response = await api.get(`/gas-prices`);
  const { result } = response.data;
  return result;
};

export const apiGetGasLimit = async (
  contractAddress: string,
  data: string
): Promise<number> => {
  const chainId = 1
  const response = await api.get(`/gas-limit?address=${contractAddress}&data=${data}&chainId=${chainId}`);
  const { result } = response.data;
  return result;
};

export const apiGetDaiPrice = async () => {
  const response = await axios.get(
    "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=DAI",
    {
      headers: {
        "X-CMC_PRO_API_KEY": "c9e6675f-3d01-4b7e-bf86-809c5eead93c"
      }
    }
  );
  console.log("apiGetGasLimit response.data", response.data); // tslint:disable-line
};
