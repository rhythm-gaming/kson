import { type } from 'arktype';
import { exportType } from "../../util/type.js";
import { checkIsRecord } from './common.js';

export const ImplInfo = exportType(type("Record<string, unknown>").narrow(checkIsRecord));
export type ImplInfo = typeof ImplInfo.infer;