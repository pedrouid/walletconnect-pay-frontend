import { readAndCompressImage } from "browser-image-resizer";
import MIME_TYPES from "../constants/mimeTypes";

interface IResizeImageConfig {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  autoRotate?: boolean;
  debug?: boolean;
  mimeType?: string;
}

const defaultConfig: IResizeImageConfig = {
  quality: 0.5,
  maxWidth: 500,
  maxHeight: 500,
  autoRotate: true,
  debug: process.env.NODE_ENV === "development"
};

export async function resizeImage(file: File, config: IResizeImageConfig = {}) {
  const blob = await readAndCompressImage(file, {
    ...defaultConfig,
    mimeType: file.type,
    ...config
  });
  const result = new File([blob], file.name, { type: file.type });
  return result;
}

export function getFileName(filePath: string) {
  const fileName = filePath.replace(/^.*[\\\/]/, "");
  if (fileName) {
    return fileName;
  }
  return "";
}

export function getFileExtension(fileName: string) {
  const regex = /(?:\.([^.]+))?$/;
  const fileExtension = regex.exec(fileName); // "txt"
  if (fileExtension && fileExtension[1]) {
    return fileExtension[1];
  }
  return "";
}

export function removeFileExtension(fileName: string) {
  const fileExtension = getFileExtension(fileName);
  return fileName.replace(`.${fileExtension}`, "");
}

export function updateFileName(prevFileName: string, newFileName: string) {
  const fileExtension = getFileExtension(prevFileName);
  const fileNameWithoutExt = removeFileExtension(newFileName);
  return `${fileNameWithoutExt}.${fileExtension}`;
}

export function appendToFileName(prevFileName: string, toAppend: string) {
  const fileExtension = getFileExtension(prevFileName);
  const fileNameWithoutExt = removeFileExtension(prevFileName);
  return `${fileNameWithoutExt}${toAppend}.${fileExtension}`;
}

export function getMimeType(fileName: string) {
  const fileExtension = getFileExtension(fileName);
  const mimeType = MIME_TYPES[fileExtension];
  if (mimeType) {
    return mimeType;
  }
  return "";
}

export function getBase64ImgSrc(base64: string, mime: string) {
  const prefix = `data:${mime};base64,`;
  const imgSrc = `${prefix}${base64}`;
  return imgSrc;
}

export function isImage(filePath: string) {
  return /\.(jpe?g|png|gif|bmp)$/i.test(filePath);
}
