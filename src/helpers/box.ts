import Box from "3box";

let box: any | null = null;

// export function getValue(parent: any, parentModel: any, path: string) {
//   const keys = path.split("/");

//   let result = null;

//   keys.forEach((key: string, idx: number) => {
//     const target = parentModel[key];
//     const value = parent[target.key];

//     if (idx === keys.length - 1) {
//       result = value;
//     } else {
//       parent = value;
//       parentModel = target.model;
//     }
//   });

//   return result;
// }

export async function init3Box(address: string, provider: any) {
  await openBox(address, provider);

  await openSpace();

  const profile = await getSpacePrivate("profile");

  return profile.name;
}

export async function getProfile(address: string) {
  const profile = await Box.getProfile(address);
  return profile;
}

export async function openBox(address: string, provider: any) {
  box = await Box.openBox(address, provider);
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

const SPACE_ID: string = "WALLETCONNECT_PAY_V1";

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
