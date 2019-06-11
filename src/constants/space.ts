import { getAppVersion, formatConstantString } from "../helpers/utilities";
import { APP_NAME } from "./appMeta";

const SPACE_NAME = formatConstantString(APP_NAME);

export const SPACE_ID = `${SPACE_NAME}_V_${getAppVersion()}`;

export const DATA = `${SPACE_NAME}_DATA`;

export const MENU = `${SPACE_NAME}_MENU`;

export const ORDER_ID = `${SPACE_NAME}_ORDER_ID`;
