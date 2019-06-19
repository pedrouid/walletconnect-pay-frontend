import WalletConnect from "@walletconnect/browser";
import { IJsonRpcRequest } from "@walletconnect/types";
import { logMessage } from "./dev";

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
    logMessage("session_update", payload);
  });

  connector.on("disconnect", (error: Error, payload: IJsonRpcRequest) => {
    if (error) {
      throw error;
    }
    logMessage("disconnect", payload);
  });
}

export function killSession() {
  if (connector) {
    connector.killSession();
  }
  connector = null;
}

export async function sendTransaction(tx: any) {
  logMessage("sendTransaction tx", tx);
  const result = await connector.sendTransaction(tx);
  logMessage("sendTransaction result", result);
  return result;
}
