import { type, type Type, type Traversal } from 'arktype';
import type { DefaultRaw, PipeArkType } from "../util/type.js";
import { ConsType } from "../util/type.js";

export const Uint: Type<number> = type("(number.safe & number.integer) >= 0");
export type Uint = typeof Uint.infer;

export const Double: Type<number> = type('number').narrow((v, ctx) => Number.isFinite(v) || ctx.mustBe("a finite value"));
export type Double = typeof Double.infer;

export const ByPulse = <TOut>(T: Type<TOut>) => ConsType(Uint, T);
export type ByPulse<TOut> = ReturnType<typeof ByPulse<TOut>>;

export const ByMeasureIdx = <TOut>(T: Type<TOut>) => ConsType(Uint, T);
export type ByMeasureIdx<TOut> = ReturnType<typeof ByMeasureIdx<TOut>>;

export const DefKeyValuePair = <TOut>(T: Type<TOut>) => ConsType(type('string'), T);
export type DefKeyValuePair<TOut> = ReturnType<typeof DefKeyValuePair<TOut>>;

export type GraphValue = [v: Double, vf: Double];
export const GraphValue: Type<GraphValue> = type([Double, Double]);

export type CoerceGraphValueArkType = GraphValue|PipeArkType<typeof Double, GraphValue>;
export const CoerceGraphValue: Type<CoerceGraphValueArkType> = GraphValue.or(Double.pipe((v): GraphValue => [v, v]));
export type CoerceGraphValue = typeof CoerceGraphValue.infer;

export type GraphCurveValue = [a: Double, b: Double];
export const GraphCurveValue: Type<GraphCurveValue> = type([Double, Double]);

export type GraphPointArkType = [number, CoerceGraphValueArkType, DefaultRaw<GraphCurveValue, [0, 0]>];
export const GraphPoint: Type<GraphPointArkType> = type([
    Uint,
    CoerceGraphValue,
    GraphCurveValue.default(() => [0, 0] as const),
]);
export type GraphPoint = typeof GraphPoint.infer;

export const GraphSectionPoint =  GraphPoint;
export type GraphSectionPoint = typeof GraphSectionPoint.infer;

export function isRecord(v: unknown): v is Record<string, unknown> {
    return v != null && (typeof v === 'object') && !Array.isArray(v);
}

export function checkIsRecord(v: unknown, ctx: Traversal): v is Record<string, unknown> {
    return isRecord(v) || ctx.mustBe("a record");
}
