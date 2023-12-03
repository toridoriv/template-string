/**
 * @file Shared type definitions for this library.
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @module typings/shared
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

declare global {
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
  export type AnyRecord = Record<PropertyKey, SafeAny>;

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
   * @param T  - The type to be expanded.
   * @see {@link https://stackoverflow.com/a/69288824/62937 Source}
   */
  export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;

  /**
   * Takes a union type `U` and extracts the last type in the union.
   *
   * @param U  - The union type from which to extract the last type.
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
   * @param T  - The object type from which to extract key-value pairs.
   */
  export type ObjectEntries<T> = {
    [K in keyof T]-?: [K, RemoveUndefined<T[K]>];
  }[keyof T];

  /**
   * Takes a type `T` and removes the `undefined` type from its properties.
   *
   * @param T  - The type from which to remove `undefined`.
   */
  export type RemoveUndefined<T> = [T] extends [undefined] ? T : Exclude<T, undefined>;

  /**
   * Takes a string `S` and replaces all occurrences of substring `From` with substring
   * `To`.
   *
   * @param S     - The string in which to perform replacements.
   * @param From  - The substring to be replaced.
   * @param To    - The substring to replace occurrences of `From`.
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
   * Instead of adding a `disable` directive, use this value to indicate that an any type
   * is expected that way purposely.
   */
  // deno-lint-ignore no-explicit-any
  export type SafeAny = any;

  /**
   * Takes a union type `U` and transforms it into an intersection type.
   *
   * @param U  - The union type to be transformed.
   */
  export type UnionToIntersection<U> = (
    U extends unknown ? (arg: U) => 0 : never
  ) extends (arg: infer I) => 0
    ? I
    : never;

  /**
   * Takes a union type `U` and transforms it into a tuple type.
   *
   * @param U  - The union type to be transformed into a tuple.
   */
  export type UnionToTuple<U, Last = LastInUnion<U>> = [U] extends [never]
    ? []
    : [...UnionToTuple<Exclude<U, Last>>, Last];
}

export {};
