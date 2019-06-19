import { utils } from "ethers";

export function sha256(str: string): string {
  return utils.sha256(utils.toUtf8Bytes(str));
}

export function isHexString(value: any): boolean {
  return utils.isHexString(value);
}

export function entropyToMnemonic(entropy: string): string {
  return utils.HDNode.entropyToMnemonic(entropy);
}

export function mnemonicToSeed(mnemonic: string): string {
  return utils.HDNode.mnemonicToSeed(mnemonic);
}

export function fromSeed(seed: string): utils.HDNode.HDNode {
  return utils.HDNode.fromSeed(seed);
}
