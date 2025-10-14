import { type, type Type, type Traversal } from 'arktype';
import type { PipeArkType } from "../util/type.js";
import { ConsType } from "../util/type.js";

export const Int: Type<number> = type("number.safe & number.integer");
export type Int = typeof Int.infer;

export const Uint: Type<number> = type("(number.safe & number.integer) >= 0");
export type Uint = typeof Uint.infer;

export const Double: Type<number> = type('number').narrow((v, ctx) => Number.isFinite(v) || ctx.mustBe("a finite value"));
export type Double = typeof Double.infer;

export type ByPulseArkType<TOut> = [Uint, TOut];
export const ByPulse = <TOut>(T: Type<TOut>): Type<ByPulseArkType<TOut>> => ConsType(Uint, T);
export type ByPulse<TOut> = ReturnType<typeof ByPulse<TOut>>['infer'];

export type ByMeasureIdxArkType<TOut> = [Uint, TOut];
export const ByMeasureIdx = <TOut>(T: Type<TOut>): Type<ByMeasureIdxArkType<TOut>> => ConsType(Uint, T);
export type ByMeasureIdx<TOut> = ReturnType<typeof ByMeasureIdx<TOut>>['infer'];

export type DefKeyValuePairArkType<TOut> = [string, TOut];
export const DefKeyValuePair = <TOut>(T: Type<TOut>): Type<DefKeyValuePairArkType<TOut>> => ConsType(type('string'), T);
export type DefKeyValuePair<TOut> = ReturnType<typeof DefKeyValuePair<TOut>>['infer'];

export type GraphValue = [v: Double, vf: Double];
export const GraphValue: Type<GraphValue> = type([Double, Double]);

export type CoerceGraphValueArkType = GraphValue|PipeArkType<typeof Double, GraphValue>;
export const CoerceGraphValue: Type<CoerceGraphValueArkType> = GraphValue.or(Double.pipe((v): GraphValue => [v, v]));
export type CoerceGraphValue = typeof CoerceGraphValue.infer;

export type GraphCurveValue = [a: Double, b: Double];
export const GraphCurveValue: Type<GraphCurveValue> = type([Double, Double]);

export type GraphPointArkType = [y: Uint, v: CoerceGraphValueArkType, curve?: GraphCurveValue];
export const GraphPoint: Type<GraphPointArkType> = type([Uint, CoerceGraphValue, GraphCurveValue.optional()]);
export type GraphPoint = typeof GraphPoint.infer;

export type GraphSectionPointArkType = GraphPointArkType;
export const GraphSectionPoint = GraphPoint;
export type GraphSectionPoint = typeof GraphSectionPoint.infer;

export type GraphSectionPointArrayArkType = GraphSectionPointArkType[];
export const GraphSectionPointArray: Type<GraphSectionPointArrayArkType> = GraphSectionPoint.array();
export type GraphSectionPointArray = typeof GraphSectionPointArray.infer;

export function isRecord(v: unknown): v is Record<string, unknown> {
    return v != null && (typeof v === 'object') && !Array.isArray(v);
}

export function checkIsRecord(v: unknown, ctx: Traversal): v is Record<string, unknown> {
    return isRecord(v) || ctx.mustBe("a record");
}
