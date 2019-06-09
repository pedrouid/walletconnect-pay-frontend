import { getAppVersion, formatConstantString } from "../helpers/utilities";
import { APP_NAME } from "./appMeta";

const SPACE_NAME = formatConstantString(APP_NAME);

export const SPACE_ID = `${SPACE_NAME}_V_${getAppVersion()}`;

export const BUSINESS_DATA = `${SPACE_NAME}_BUSINESS_DATA`;

export const BUSINESS_MENU = `${SPACE_NAME}_BUSINESS_MENU`;

export const ORDER_ID = `${SPACE_NAME}_ORDER_ID`;
