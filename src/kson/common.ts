import { type, type Type, type Traversal } from 'arktype';
import { ConsType, exportType, type PublicType } from "../util/type.js";

export const Int = exportType(type("number.safe & number.integer"));
export type Int = typeof Int.infer;

export const Uint = exportType(type("(number.safe & number.integer) >= 0"));
export type Uint = typeof Uint.infer;

export const Double = exportType(type('number').narrow((v, ctx) => Number.isFinite(v) || ctx.mustBe("a finite value")));
export type Double = typeof Double.infer;

type WithPrefix<T, U> = [T, U];
type WithPrefixReturnType<T> = <U extends Type>(u: U) => PublicType<[T, U['inferOut']]>;
const WithPrefix = <T extends Type>(t: T): WithPrefixReturnType<T['inferOut']> => <U extends Type>(u: U) => ConsType(t, u) as never;

export type ByPulse<T> = WithPrefix<Uint, T>;
export const ByPulse = WithPrefix(Uint);

export type ByMeasureIdx<T> = WithPrefix<Uint, T>;
export const ByMeasureIdx = WithPrefix(Uint);

export type DefKeyValuePair<T> = WithPrefix<string, T>;
export const DefKeyValuePair = WithPrefix(type('string'));

export const GraphValue = exportType(type([Double, Double]));
export type GraphValue = typeof GraphValue.infer;

export const CoerceGraphValue = exportType(GraphValue.or(Double.pipe((v): GraphValue => [v, v])));

export const GraphCurveValue = exportType(type([Double, Double]));
export type GraphCurveValue = typeof GraphCurveValue.infer;

export const GraphPoint = exportType(type([Uint, CoerceGraphValue, GraphCurveValue.optional()]));
export type GraphPoint = typeof GraphPoint.infer;

export const GraphSectionPoint = GraphPoint;
export type GraphSectionPoint = typeof GraphSectionPoint.infer;

export const GraphSectionPointArray = exportType(GraphSectionPoint.array());
export type GraphSectionPointArray = typeof GraphSectionPointArray.infer;

function isRecord(v: unknown): v is Record<string, unknown> {
    return v != null && (typeof v === 'object') && !Array.isArray(v);
}

export function checkIsRecord<T>(v: T, ctx: Traversal): v is T {
    return isRecord(v) || ctx.mustBe("a record");
}
