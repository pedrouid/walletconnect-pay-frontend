import Box from "3box";
import { createHttpProvider } from "./eth";
import { getChainData } from "./utilities";

let box: any | null = null;

export async function getProfile(address: string) {
  const profile = await Box.getProfile(address);
  return profile;
}

export async function openBox(address: string, chainId: number = 1) {
  const rpcUrl = getChainData(chainId).rpc_url;
  const provider = createHttpProvider(rpcUrl);
  box = await Box.openBox(address, provider);
}

export async function setPublic(key: string, value: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.public.set(key, value);
}

export async function getPublic(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  const result = await box.public.get(key);
  return result;
}

export async function removePublic(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.public.remove(key);
}

export async function setPrivate(key: string, value: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.private.set(key, value);
}

export async function getPrivate(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  const result = await box.private.get(key);
  return result;
}

export async function removePrivate(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.private.remove(key);
}

const SPACE_ID: string = "WALLETCONNECT_PAY_V1";
let space: any = null;

export async function openSpace(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  space = await box.openSpace(SPACE_ID);
}

export async function setSpacePrivate(key: string, value: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  await space.private.set(key, value);
}

export async function getSpacePrivate(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  const result = await space.private.get(key);
  return result;
}

export async function removeSpacePrivate(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  await space.private.remove(key);
}
