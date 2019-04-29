import WalletConnect from "walletconnect";

let walletConnector: any = null;

export async function initWalletConnect() {
  walletConnector = new WalletConnect({
    bridgeUrl: "https://test-bridge.walletconnect.org",
    dappName: "Bufficorn Cafe"
  });
  await walletConnector.initSession();
  return walletConnector.uri;
}

export async function getAccount() {
  await walletConnector.listenSessionStatus();
  return walletConnector.accounts[0];
}

export function killSession() {
  walletConnector.stopLastListener();
  walletConnector.killSession();
  walletConnector = null;
}

export async function sendTransaction(tx: any) {
  console.log("sendTransaction tx", tx); // tslint:disable-line
  const result = await walletConnector.sendTransaction(tx);
  console.log("sendTransaction result", result); // tslint:disable-line
  killSession();
  return result;
}
