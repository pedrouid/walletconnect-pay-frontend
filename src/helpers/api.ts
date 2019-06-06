import axios, { AxiosInstance } from "axios";
import { IGasPrices } from "./types";
import { payloadId } from "@walletconnect/utils";

const api: AxiosInstance = axios.create({
  baseURL: "https://ethereum-api.xyz",
  timeout: 30000, // 30 secs
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export const apiGetAccountNonce = async (address: string): Promise<number> => {
  const chainId = 1;
  const response = await api.get(
    `/account-nonce?address=${address}&chainId=${chainId}`
  );
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
  data: string,
  chainId: number
): Promise<number> => {
  const response = await api.get(
    `/gas-limit?contractAddress=${contractAddress}&data=${data}&chainId=${chainId}`
  );
  const { result } = response.data;
  return result;
};

export const apiGetTransactionByHash = async (
  txHash: string,
  chainId: number
): Promise<any> => {
  const response = await api.post(`/custom-request?chainId=${chainId}`, {
    id: payloadId(),
    jsonrpc: "2.0",
    method: "eth_getTransactionByHash",
    params: [txHash]
  });
  const { result } = response.data;
  return result;
};

export const apiGetTransactionReceipt = async (
  txHash: string,
  chainId: number
): Promise<any> => {
  const response = await api.post(`/custom-request?chainId=${chainId}`, {
    id: payloadId(),
    jsonrpc: "2.0",
    method: "eth_getTransactionReceipt",
    params: [txHash]
  });
  const { result } = response.data;
  return result;
};

export const apiGetAssetPrice = async (symbol: string) => {
  const response = await axios.get(
    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
    {
      headers: {
        "X-CMC_PRO_API_KEY": "c9e6675f-3d01-4b7e-bf86-809c5eead93c"
      }
    }
  );
  console.log("apiGetDaiPrice response.data", response.data); // tslint:disable-line
};

export const apiPinFile = async (
  formData: FormData
): Promise<string | null> => {
  const response = await axios.post("/ipfs", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  const { result } = response.data;
  return result;
};

export const apiFetchFile = async (fileHash: string): Promise<any> => {
  const response = await axios.get(`/ipfs?fileHash=${fileHash}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

  let data = null;

  if (response && response.data) {
    data = response.data;
  }

  return data;
};

export const apiSendEmail = async (email: string): Promise<boolean> => {
  const response = await axios.post(
    "/send-email",
    { email },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  const result = response.data.result;

  return result;
};

export const apiVerifyEmail = async (
  email: string,
  id: string
): Promise<boolean> => {
  const response = await axios.post(
    "/verify-email",
    { email, id },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

  const result = response.data.result;

  return result;
};
