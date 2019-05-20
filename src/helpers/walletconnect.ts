import WalletConnect from "@walletconnect/browser";
import { IJsonRpcRequest } from "@walletconnect/types";

let connector: any = null;

export async function initWalletConnect(): Promise<WalletConnect> {
  connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org"
  });
  console.log("[initWalletConnect] connector.connected", connector.connected); // tslint:disable-line
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
    console.log("session_update", payload); // tslint:disable-line
  });

  connector.on("disconnect", (error: Error, payload: IJsonRpcRequest) => {
    if (error) {
      throw error;
    }
    console.log("disconnect", payload); // tslint:disable-line
  });
}

export function killSession() {
  if (connector) {
    connector.killSession();
  }
  connector = null;
}

export async function sendTransaction(tx: any) {
  console.log("sendTransaction tx", tx); // tslint:disable-line
  const result = await connector.sendTransaction(tx);
  console.log("sendTransaction result", result); // tslint:disable-line
  return result;
}
