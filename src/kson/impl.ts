import { type, type Type } from 'arktype';

export type ImplInfo = Record<string, unknown>;
export const ImplInfo: Type<ImplInfo> = type("Record<string, unknown>");