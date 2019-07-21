import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { payloadId } from "../helpers/utilities";
import { sha256, entropyToMnemonic, mnemonicToSeed, fromSeed } from "./ethers";

const RANDOM_BYTES = 24;
const BASE_PATH = "m/7696500'/0'/0'";
const ETH_PATH = "m/44'/60'/0'/0";

export function safeEthSend(provider: any, request: any): Promise<any> {
  const send = Boolean(provider.sendAsync) ? provider.sendAsync : provider.send;
  return new Promise((resolve, reject) => {
    send(request, (err: any, result: any) => {
      if (err) {
        reject(err);
      }
      if (result.error) {
        reject(result.error);
      }
      resolve(result.result);
    });
  });
}

export function openBoxConsent(
  address: string,
  provider: any
): Promise<string> {
  const text = "This app wants to view and update your 3Box profile.";
  const msg = "0x" + Buffer.from(text, "utf8").toString("hex");
  const params = [msg, address];
  const method = "personal_sign";
  const request = {
    jsonrpc: "2.0",
    id: payloadId(),
    method,
    params,
    address
  };
  console.log("[openBoxConsent] request", request); // tslint:disable-line
  return safeEthSend(provider, request);
}

export async function generateSeed(address: string, provider: any) {
  const normalizedAddress = address.toLowerCase();
  const sig = await openBoxConsent(normalizedAddress, provider);
  const entropy = "0x" + sha256(sig.slice(2));
  const mnemonic = entropyToMnemonic(entropy);
  const seed = mnemonicToSeed(mnemonic);
  return seed;
}

export function generateKeys(seed: string) {
  const seedNode = fromSeed(seed);
  const baseNode = seedNode.derivePath(BASE_PATH);

  const signingKey = baseNode.derivePath("0");
  const tmpEncKey = Buffer.from(
    baseNode.derivePath("2").privateKey.slice(2),
    "hex"
  );
  const asymEncryptionKey = nacl.box.keyPair.fromSecretKey(
    new Uint8Array(tmpEncKey)
  );
  const symEncryptionKey = new Uint8Array(
    Buffer.from(baseNode.derivePath("3").privateKey.slice(2), "hex")
  );

  const ethereumKey = seedNode.derivePath(ETH_PATH).derivePath("0");

  return {
    signingKey,
    asymEncryptionKey,
    symEncryptionKey,
    ethereumKey
  };
}

export function randomNonce() {
  return nacl.randomBytes(RANDOM_BYTES);
}

export function symEncrypt(
  msg: Uint8Array,
  symKey: Uint8Array,
  nonce: Uint8Array
) {
  nonce = nonce || randomNonce();
  if (typeof msg === "string") {
    msg = naclUtil.decodeUTF8(msg);
  }
  const ciphertext = nacl.secretbox(msg, nonce, symKey);
  return {
    nonce: naclUtil.encodeBase64(nonce),
    ciphertext: naclUtil.encodeBase64(ciphertext)
  };
}

export function symDecrypt(
  ciphertext: string,
  symKey: Uint8Array,
  nonce: string,
  toBuffer: boolean
) {
  const _ciphertext = naclUtil.decodeBase64(ciphertext);
  const _nonce = naclUtil.decodeBase64(nonce);
  const cleartext = nacl.secretbox.open(_ciphertext, _nonce, symKey);
  if (toBuffer) {
    return cleartext ? Buffer.from(cleartext) : null;
  }
  return cleartext ? naclUtil.encodeUTF8(cleartext) : null;
}

export function asymEncrypt(
  msg: Uint8Array,
  asymEncryptionKey: nacl.BoxKeyPair,
  toPublic: string,
  nonce: Uint8Array
) {
  nonce = nonce || randomNonce();
  const _toPublic = naclUtil.decodeBase64(toPublic);
  if (typeof msg === "string") {
    msg = naclUtil.decodeUTF8(msg);
  }
  const ciphertext = nacl.box(
    msg,
    nonce,
    _toPublic,
    asymEncryptionKey.secretKey
  );
  return {
    nonce: naclUtil.encodeBase64(nonce),
    ciphertext: naclUtil.encodeBase64(ciphertext)
  };
}

export function asymDecrypt(
  ciphertext: string,
  asymEncryptionKey: nacl.BoxKeyPair,
  fromPublic: string,
  nonce: string,
  toBuffer: boolean
) {
  const _fromPublic = naclUtil.decodeBase64(fromPublic);
  const _ciphertext = naclUtil.decodeBase64(ciphertext);
  const _nonce = naclUtil.decodeBase64(nonce);
  const cleartext = nacl.box.open(
    _ciphertext,
    _nonce,
    _fromPublic,
    asymEncryptionKey.secretKey
  );
  if (toBuffer) {
    return cleartext ? Buffer.from(cleartext) : null;
  }
  return cleartext ? naclUtil.encodeUTF8(cleartext) : null;
}
