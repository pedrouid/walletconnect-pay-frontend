import Eth from "ethjs";

export function createHttpProvider(rpcUrl: string) {
  const provider = new Eth.HttpProvider(rpcUrl);
  return provider;
}

export function keccak256(str: string) {
  const result = Eth.keccak256(str);
  return result;
}
