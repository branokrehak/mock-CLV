/**
 * Merges a union of types into a single type. Fields that were required in all of the types remain required in the resulting type.
 * All other fields become optional.
 */
export type Merge<T extends object> = {
  [k in CommonKeys<T>]: PickTypeOf<T, k>;
} & {
  [k in NonCommonKeys<T>]?: PickTypeOf<T, k>;
};

type CommonKeys<T extends object> = keyof T;

type AllKeys<T> = T extends any ? keyof T : never;

type Subtract<A, C> = A extends C ? never : A;
type NonCommonKeys<T extends object> = Subtract<AllKeys<T>, CommonKeys<T>>;

type PickType<T, K extends AllKeys<T>> = T extends { [k in K]?: any }
  ? T[K]
  : undefined;

type PickTypeOf<T, K extends string | number | symbol> =
  K extends AllKeys<T> ? PickType<T, K> : never;
