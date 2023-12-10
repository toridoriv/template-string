/**
 * @file `TemplateString` related type definitions.
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @module typings/template
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
export as namespace Template;

import {
  Expand,
  GetAllSurrounded,
  IsEmpty,
  Nullable,
  Primitive,
  ReplaceAll,
  Unwrap,
  GetValues,
} from "./utils.d.ts";

/**
 * Type alias for the placeholder tag pair.
 *
 * Placeholder tags are represented as a tuple of two strings - the opening and closing
 * tag.
 */
export type AnyPlaceholderTags = [string, string];

/**
 * Applies a replacement to a specific placeholder in the given string.
 *
 * @template S            - The original string.
 * @template Placeholder  - The placeholder tag to replace.
 * @template Value        - The value to replace the placeholder with.
 */
export type ApplyReplacement<
  S extends string,
  Placeholder extends string,
  Value,
> = Value extends Nullable
  ? S
  : Value extends NonNullable<Primitive>
    ? ReplaceAll<S, Placeholder, `${Value}`>
    : S;

/**
 * Applies multiple replacements to placeholders in the given string.
 *
 * @template S     - The original string.
 * @template Tags  - The placeholder tags.
 * @template R     - The replacement values for each placeholder.
 * @template P     - The list of placeholders in the string.
 */
export type ApplyReplacements<
  S extends string,
  Tags extends AnyPlaceholderTags,
  R extends Partial<Replacements<S, Tags>>,
  P extends string[] = Placeholders<S, Tags>,
> = IsEmpty<P> extends true
  ? S
  : P extends [infer F, ...infer Rest]
    ? F extends string
      ? Unwrap<F, Tags[0], Tags[1]> extends keyof R
        ? Rest extends string[]
          ? ApplyReplacements<
              ApplyReplacement<S, F, R[Unwrap<F, Tags[0], Tags[1]>]>,
              Tags,
              R,
              Rest
            >
          : ApplyReplacement<S, F, R[Unwrap<F, Tags[0], Tags[1]>]>
        : Rest extends string[]
          ? ApplyReplacements<S, Tags, R, Rest>
          : S
      : Rest extends string[]
        ? ApplyReplacements<S, Tags, R, Rest>
        : S
    : S;

/**
 * Extracts all placeholders surrounded by the specified start and end tags in a given
 * string.
 *
 * @template S     - The string to search within.
 * @template Tags  - The placeholder tags.
 */
export type Placeholders<
  S extends string,
  Tags extends AnyPlaceholderTags,
> = string extends S ? string[] : GetAllSurrounded<S, Tags[0], Tags[1]>;

/**
 * Maps each placeholder in the string to the corresponding property name it will have in
 * the replacements object. The placeholders are extracted based on the specified start
 * and end tags.
 *
 * @template S     - The original string.
 * @template Tags  - The placeholder tags.
 */
export type PlaceholderPropertyMap<
  S extends string,
  Tags extends AnyPlaceholderTags,
> = Expand<{
  [K in GetAllSurrounded<S, Tags[0], Tags[1]>[number]]: Unwrap<K, Tags[0], Tags[1]>;
}>;

/**
 * Defines a set of replacement values for each placeholder in the string.
 *
 * @template S     - The original string.
 * @template Tags  - The placeholder tags.
 */
export type Replacements<S extends string, Tags extends AnyPlaceholderTags> = Expand<{
  // @ts-ignore: ¯\_(ツ)_/¯
  [K in GetValues<PlaceholderPropertyMap<S, Tags>>[number]]: Primitive;
}>;
