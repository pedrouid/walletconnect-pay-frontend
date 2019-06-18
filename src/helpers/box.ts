import { SPACE_ID } from "../constants/space";

const Box =
  typeof window !== "undefined" && typeof window.Box !== "undefined"
    ? window.Box
    : null;

let box: any | null = null;

export async function getProfile(address: string) {
  if (!Box) {
    throw new Error("Box library is not available in window");
  }
  const profile = await Box.getProfile(address);
  return profile;
}

export function openBox(address: string, provider: any): Promise<any> {
  if (!Box) {
    throw new Error("Box library is not available in window");
  }
  return new Promise(async (resolve, reject) => {
    try {
      box = await Box.openBox(address, provider);
      box.onSyncDone(() => {
        resolve(true)
      })
    } catch (error){
      reject(error)
    }
  })
}

export async function setPublic(key: string, value: any) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await box.public.set(key, value);
}

export async function getPublic(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  let result = await box.public.get(key);
  try {
    result = JSON.parse(result);
  } catch (error) {
    // ignore error
  }
  return result;
}

export async function removePublic(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.public.remove(key);
}

export async function setPrivate(key: string, value: any) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await box.private.set(key, value);
}

export async function getPrivate(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  let result = await box.private.get(key);
  try {
    result = JSON.parse(result);
  } catch (error) {
    // ignore error
  }
  return result;
}

export async function removePrivate(key: string) {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  await box.private.remove(key);
}

let space: any = null;

export async function openSpace() {
  if (!box) {
    throw new Error("Box is not open yet");
  }
  space = await box.openSpace(SPACE_ID);
}

export async function setSpacePrivate(key: string, value: any) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await space.private.set(key, value);
}

export async function getSpacePrivate(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  let result = await space.private.get(key);
  try {
    result = JSON.parse(result);
  } catch (error) {
    // ignore error
  }
  return result;
}

export async function removeSpacePrivate(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  await space.private.remove(key);
}

export async function setSpacePublic(key: string, value: any) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await space.public.set(key, value);
}

export async function getSpacePublic(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  let result = await space.public.get(key);
  try {
    result = JSON.parse(result);
  } catch (error) {
    // ignore error
  }
  return result;
}

export async function removeSpacePublic(key: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  await space.public.remove(key);
}

let thread: any = null;

export async function joinThread(threadName: string) {
  if (!space) {
    throw new Error("Space is not open yet");
  }
  thread = await space.joinThread(threadName);
}

export async function getThreadPosts() {
  if (!thread) {
    throw new Error("Thread is not open yet");
  }
  const posts = await thread.getPosts();
  return posts;
}

export async function postToThread(message: any) {
  if (!thread) {
    throw new Error("Thread is not open yet");
  }
  if (typeof message !== "string") {
    message = JSON.stringify(message);
  }
  await thread.post(message);
}

export async function subscribeToThread(callback: any) {
  if (!thread) {
    throw new Error("Thread is not open yet");
  }
  thread.onUpdate(callback);
}
