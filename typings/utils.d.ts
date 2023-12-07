/**
 * @file Utility types and types for the utils module.
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @module typings/utils
 * @license GPL-3.0-or-later.
 *
 *          **Copyright (C) 2023 Tori Rodriguez.**
 *
 *          This program is free software: you can redistribute it and/or modify it
 *          under the terms of the GNU General Public License as published by the
 *          Free Software Foundation, either version 3 of the License, or any later
 *          version.
 *
 *          This program is distributed in the hope that it will be useful,
 *          but **WITHOUT ANY WARRANTY**; without even the implied warranty of
 *          **MERCHANTABILITY** or **FITNESS FOR A PARTICULAR PURPOSE**. See the GNU
 *          General Public License for more details.
 *
 *          You should have received a copy of the GNU General Public License along
 *          with this program. If not, @see {@link https://www.gnu.org/licenses}
 */

export as namespace Utils;

/**
 * Options for deep merging objects.
 *
 * @see {@link MergingStrategy}
 */
export type DeepMergeOptions = {
  arrays?: MergingStrategy;
};

/**
 * The possible merging strategies when deep merging objects.
 *
 * - `"replace"`: replaces target with source.
 * - `"merge"`: merges target and source.
 */
export type MergingStrategy = "replace" | "merge";

/**
 * Represents any possible array.
 */
export type AnyArray = Array<SafeAny>;

/**
 * Represents an object type where the keys can be either strings or numbers, and the
 * values are any type.
 *
 * This is useful for representing loose object types where the keys and values are not
 * known ahead of time.
 */
export type AnyRecord = {
  [key: PropertyKey]: AnyRecordValue;
};

/**
 * Represents the possible values for keys in the {@link AnyRecord} type. Can be a
 * primitive, an array of primitives or other records, or another record. Allows
 * nested/recursive records.
 */
export type AnyRecordValue = Primitive | Array<Primitive | AnyRecord> | AnyRecord;

/**
 * Makes all properties in T optional.
 */
export type DeepPartial<T> = T extends NativeObject
  ? T
  : T extends AnyRecord
    ? {
        [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

/**
 * Takes a type `T` and expands it into an object type with the same properties as `T`.
 *
 * @template T  - The type to be expanded.
 * @see {@link https://stackoverflow.com/a/69288824/62937 Source}
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

/**
 * Calculates the length of a string or array type `T`.
 *
 * If `T` extends `string`, recursively splits it into characters and counts the length.
 *
 * If `T` has a `length` property, returns the type of that property.
 *
 * Otherwise returns `never`.
 *
 * @template {T} -  The type to split.
 */
export type GetLength<T> = T extends string
  ? GetLength<Split<T, "">>
  : T extends { length: infer L }
    ? L extends number
      ? L
      : never
    : never;
/**
 * Takes a union type `U` and extracts the last type in the union.
 *
 * @template U  - The union type from which to extract the last type.
 */
export type LastInUnion<U> = UnionToIntersection<
  U extends unknown ? (x: U) => 0 : never
> extends (x: infer L) => 0
  ? L
  : never;

// deno-lint-ignore ban-types
export type NativeObject = Date | String | Number | Function;

/**
 * Takes an object type `T` and transforms it into an array of key-value pairs,
 * where each value has `undefined` removed.
 *
 * @template T  - The object type from which to extract key-value pairs.
 */
export type ObjectEntries<T> = {
  [K in keyof T]-?: [K, RemoveUndefined<T[K]>];
}[keyof T];

/**
 * Represents a primitive value.
 */
export type Primitive = string | number | null | undefined | boolean;

/**
 * Takes a type `T` and removes the `undefined` type from its properties.
 *
 * @template T  - The type from which to remove `undefined`.
 */
export type RemoveUndefined<T> = [T] extends [undefined] ? T : Exclude<T, undefined>;

/**
 * Takes a string `S` and replaces all occurrences of substring `From` with substring
 * `To`.
 *
 * @template S     - The string in which to perform replacements.
 * @template From  - The substring to be replaced.
 * @template To    - The substring to replace occurrences of `From`.
 */
export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = From extends ""
  ? S
  : S extends `${infer R1}${From}${infer R2}`
    ? `${R1}${To}${ReplaceAll<R2, From, To>}`
    : S;

/**
 * Instead of adding a `disable` directive, use this value to indicate that an any type is
 * expected that way purposely.
 */
// deno-lint-ignore no-explicit-any
export type SafeAny = any;

/**
 * Splits a string `S` into substrings separated by `SEP`.
 *
 * This is a type-level implementation of `String.split()`.
 *
 * @template S    - The string to split.
 * @template SEP  - The separator string to split on.
 */
export type Split<S extends string, SEP extends string> = string extends S
  ? string[]
  : S extends `${infer A}${SEP}${infer B}`
    ? [A, ...(B extends "" ? [] : Split<B, SEP>)]
    : SEP extends ""
      ? []
      : [S];

/**
 * Takes a union type `U` and transforms it into an intersection type.
 *
 * @template U  - The union type to be transformed.
 */
export type UnionToIntersection<U> = (U extends unknown ? (arg: U) => 0 : never) extends (
  arg: infer I,
) => 0
  ? I
  : never;

/**
 * Takes a union type `U` and transforms it into a tuple type.
 *
 * @template U  - The union type to be transformed into a tuple.
 */
export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
  ? []
  : [...UnionToTuple<Exclude<U, Last>>, Last];

/**
 * Represents a line break character.
 */
export type LineBreak = "\n";

/**
 * Represents a space character.
 */
export type Space = " ";

/**
 * Represents a tab character.
 */
export type Tab = "\t";

/**
 * Represents a whitespace characters.
 */
export type WhiteSpace = Space | LineBreak | Tab;

/**
 * Represents any empty string or {@link WhiteSpace}
 */
export type EmptySpace = WhiteSpace | "";

/**
 * Filters a tuple type `T` to include only elements that extend `P`.
 *
 * @template T  - The tuple type to filter.
 * @template P  - The type to filter for.
 */
export type Filter<T extends unknown[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? [F, ...Filter<R, P>]
    : Filter<R, P>
  : [];

/**
 * Filters a tuple type `T` to exclude elements that extend `P`.
 *
 * @template T  - The tuple type to filter.
 * @template P  - The type to filter out.
 */
export type FilterOut<T extends unknown[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? FilterOut<R, P>
    : [F, ...FilterOut<R, P>]
  : [];

/**
 * Checks if two types `T` and `U` are equal.
 */
export type IsEqual<T, U> = U extends T ? (T extends U ? true : false) : false;

/**
 * Finds the index of the first occurrence of type `U` in type `T`.
 *
 * @template T              - The type to search.
 * @template U              - The type to search for.
 * @template Index          - The index to start searching from.
 * @template OriginalValue  - The original type before searching.
 */
export type IndexOf<T, U, Index extends number = 0, OriginalValue = T> = T extends string
  ? IndexOf<SplitByLength<T, GetLength<U>>, U, Index, OriginalValue>
  : T extends [infer F, ...infer R]
    ? IsEqual<F, U> extends true
      ? OriginalValue extends string
        ? Multiply<Index, GetLength<U>>
        : Index
      : IndexOf<R, U, Add<Index, 1>, OriginalValue>
    : -1;

/**
 * Converts a numeric type to its positive counterpart or returns the original number.
 *
 * @template N    - The numeric type to be converted to its positive counterpart.
 * @template Arr  - The array type from which to extract elements if `N` is negative.
 */
export type ToPositive<
  N extends number,
  Arr extends unknown[],
> = `${N}` extends `-${infer P extends number}` ? Slice<Arr, P>["length"] : N;

/**
 * Extracts the initial subset of elements from an array up to a specified length.
 *
 * This type recursively builds an array subset by taking the initial elements of the
 * input array `Arr` up to the specified length `N`.
 *
 * @template Arr    - The input array from which to extract the initial subset.
 * @template N      - The desired length of the subset.
 * @template Cache  - Internal accumulator array to keep track of the subset being
 *                  built.
 */
export type InitialSubset<
  Arr extends unknown[],
  N extends number,
  Cache extends unknown[] = [],
> = Cache["length"] extends N | Arr["length"]
  ? Cache
  : InitialSubset<Arr, N, [...Cache, Arr[Cache["length"]]]>;

/**
 * Extracts a portion of elements from an array based on the specified start and end
 * indices.
 *
 * This type uses the {@link InitialSubset} type to extract a subset of elements from the
 * input array `Arr` starting from the specified `Start` index up to, but not including,
 * the specified `End` index.
 *
 * @template Arr    - The input array from which to extract the slice.
 * @template Start  - The starting index of the slice (defaults to 0)
 * @template End    - The ending index of the slice (defaults to the length of the
 *                  array).
 */
export type Slice<
  Arr extends unknown[],
  Start extends number = 0,
  End extends number = Arr["length"],
> = InitialSubset<Arr, ToPositive<End, Arr>> extends [
  ...InitialSubset<Arr, ToPositive<Start, Arr>>,
  ...infer Rest,
]
  ? Rest
  : [];

/**
 * Joins elements of an array with a specified separator.
 *
 * @template T  - The array type whose elements are to be joined.
 * @template U  - The separator type to be used between joined elements.
 */
export type Join<T extends SafeAny[], U extends string | number> = T extends [
  infer F,
  ...infer R,
]
  ? R["length"] extends 0
    ? `${F & string}`
    : `${F & string}${U}${Join<R, U>}`
  : never;

/**
 * Ensures that a given number is an integer.
 *
 * This type takes a numeric type `N` and checks if it represents an integer.
 *
 * If `N` is a decimal (float), the type resolves to `never`; otherwise, it remains as
 * `N`.
 *
 * @template N  - The numeric type to check.
 */
export type Integer<N extends number> = `${N}` extends `${string}.${string}` ? never : N;

/**
 * Ensures that a given number is a positive integer.
 *
 * This type takes a numeric type `N` and checks if it represents a positive integer.
 * If `N` is not an integer or is a negative number, the type resolves to `never`;
 * otherwise, it remains as `N`.
 *
 * @template N  - The numeric type to check.
 */
export type PositiveInteger<N extends number> = Integer<N> extends never
  ? never
  : `${N}` extends `-${string}`
    ? never
    : N;

/**
 * Checks if a value is a positive integer.
 *
 * @template N  - The numeric type to check.
 */
export type IsPositiveInteger<N extends number> = PositiveInteger<N> extends never
  ? false
  : true;

/**
 * Builds a tuple of a specified length by extending a given array or a default array.
 *
 * This type takes a numeric type `N` representing the desired length of the tuple and an
 * array type `List` (defaults to an empty array) from which to extend.
 * The resulting tuple has a length equal to `N`.
 *
 * If `N` is not a positive integer the type resolves to `never`. Otherwise, it
 * recursively extends the list until the tuple reaches the specified length.
 *
 * @template N     - The numeric type representing the desired length of the tuple.
 * @template List  - The array type to extend (defaults to an empty array).
 */
export type BuildTuple<
  N extends number,
  List extends AnyArray = [],
> = IsPositiveInteger<N> extends false
  ? never
  : List extends { length: N }
    ? List
    : BuildTuple<N, Push<List, SafeAny>>;

/**
 * Checks if two given numbers are positive integers.
 *
 * @template X  - The first numeric type to check.
 * @template Y  - The second numeric type to check.
 */
export type ArePositiveIntegers<
  X extends number,
  Y extends number,
> = IsPositiveInteger<X> extends false
  ? false
  : IsPositiveInteger<Y> extends false
    ? false
    : true;

/**
 * Adds two positive integers and returns the result.
 *
 * This type takes two positive integer types, `X` and `Y`, and adds them together.
 * If either `X` or `Y` is not a positive integer, the type resolves to `0`.
 * Otherwise, it calculates the sum of the two integers and returns the result.
 *
 * @template X  - The first positive integer to be added.
 * @template Y  - The second positive integer to be added.
 */
export type Add<X extends number, Y extends number> = ArePositiveIntegers<
  X,
  Y
> extends false
  ? 0
  : GetLength<[...BuildTuple<X>, ...BuildTuple<Y>]>;

/**
 * Checks if an array is empty.
 *
 * If the array has a length of 0, the type resolves to `true`; otherwise, it resolves to
 * `false`.
 *
 * @template T  - The array type to check for emptiness.
 */
export type IsEmpty<T extends unknown[]> = IsEqual<GetLength<T>, 0> extends true
  ? true
  : false;

/**
 * Appends an element to the end of an array.
 *
 * @template T  - The array type to which the element is appended.
 * @template U  - The type of the element to be appended.
 */
export type Push<T extends unknown[], U> = [...T, U];

/**
 * Splits a string or array into chunks of a specified length.
 *
 * @template T      - The string or array type to be split.
 * @template L      - The length of each chunk.
 * @template Cache  - Internal cache array to store the chunks (optional, initialized
 *                  to an empty array by default).
 */
export type SplitByLength<
  T,
  L extends number,
  Cache extends string[] = [],
> = T extends string
  ? SplitByLength<Split<T, "">, L, Cache>
  : T extends [...infer Items]
    ? IsEmpty<Items> extends true
      ? Cache
      : SplitByLength<Slice<Items, L>, L, [...Cache, Join<Slice<Items, 0, L>, "">]>
    : never;

/**
 * Adds a number to itself multiple times.
 *
 * @template N  - The number to be added.
 * @template A  - The accumulator or initial value.
 * @template I  - The number of times to add `N` to `A`.
 */
export type RepeatAddition<
  N extends number,
  A extends number,
  I extends number,
> = I extends 0 ? A : RepeatAddition<N, Add<N, A>, Subtract<I, 1>>;

/**
 * Subtracts one positive integer from another.
 *
 * If either `X` or `Y` is not a positive integer, the type resolves to `never`.
 * Otherwise, it returns the result of subtracting `Y` from `X`.
 *
 * @template X  - The positive integer from which the subtraction is performed.
 * @template Y  - The positive integer to subtract from `X`.
 */
export type Subtract<X extends number, Y extends number> = ArePositiveIntegers<
  X,
  Y
> extends false
  ? never
  : BuildTuple<X> extends [...infer A, ...BuildTuple<Y>]
    ? GetLength<A>
    : never;

/**
 * Multiplies two positive integers.
 *
 * @template A  - The first positive integer to be multiplied.
 * @template B  - The second positive integer to be multiplied.
 */
export type Multiply<A extends number, B extends number> = RepeatAddition<A, 0, B>;
