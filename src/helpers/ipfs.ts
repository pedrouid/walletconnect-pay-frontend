import isIPFS from "is-ipfs";
import { IPFS_GATEWAY } from "../constants/ipfs";

export function isIpfsHash(value: string): boolean {
  return isIPFS.multihash(value);
}

export function isIpfsCid(value: string): boolean {
  return isIPFS.cid(value);
}

export function isIpfsBase32Cid(value: string): boolean {
  return isIPFS.base32cid(value);
}

export function isIpfsPath(value: string): boolean {
  return isIPFS.path(value);
}

export function isIpfsUrl(value: string): boolean {
  return isIPFS.url(value);
}

export function isIpfsMultiAddr(value: string): boolean {
  return isIPFS.multiaddr(value);
}

export function getIpfsUrl(fileHash: string) {
  const result = `${IPFS_GATEWAY}${fileHash}`;
  return result;
}

export function getIpfsHash(url: string) {
  const result = url.replace(IPFS_GATEWAY, "");
  return result;
}
