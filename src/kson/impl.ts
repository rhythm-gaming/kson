import { type } from 'arktype';
import { exportType } from "../util/type.js";

export const ImplInfo = exportType(type("Record<string, unknown>"));
export type ImplInfo = typeof ImplInfo.infer;
