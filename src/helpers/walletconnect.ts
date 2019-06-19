import WalletConnect from "@walletconnect/browser";
import { IJsonRpcRequest } from "@walletconnect/types";
import { logMsg } from "./dev";

let connector: any = null;

export async function initWalletConnect(): Promise<WalletConnect> {
  connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org"
  });
  if (!connector.connected) {
    await connector.createSession();
  }
  subscribeToEvents();
  return connector;
}

export async function subscribeToEvents() {
  connector.on("session_update", (error: Error, payload: IJsonRpcRequest) => {
    if (error) {
      throw error;
    }
    logMsg("session_update", payload);
  });

  connector.on("disconnect", (error: Error, payload: IJsonRpcRequest) => {
    if (error) {
      throw error;
    }
    logMsg("disconnect", payload);
  });
}

export function killSession() {
  if (connector) {
    connector.killSession();
  }
  connector = null;
}

export async function sendTransaction(tx: any) {
  logMsg("sendTransaction tx", tx);
  const result = await connector.sendTransaction(tx);
  logMsg("sendTransaction result", result);
  return result;
}
