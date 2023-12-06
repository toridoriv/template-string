import type { Expand, ObjectEntries, ReplaceAll, UnionToTuple } from "./utils.d.ts";

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

export type ApplyReplacement<
  T extends string,
  StartTag extends string,
  EndTag extends string,
  Rep extends ReplacementPair,
  Cache extends string = T,
  Templates extends string[] = ExtractPlaceholdersInText<Cache, StartTag, EndTag>,
> = Rep[0] extends Templates[number]
  ? ReplaceAll<T, `${StartTag}${Rep[0]}${EndTag}`, `${Rep[1]}`>
  : T;

/**
 * Represents the application of replacements to a template string.
 * It takes a template string (`T`) and a set of replacements (`R`) and produce a new
 * string with the specified replacements applied.
 *
 * @param T  - A template string.
 * @param R  - An object containing key-value pairs.
 */
export type ApplyReplacements<
  T extends string,
  StartTag extends string,
  EndTag extends string,
  R,
> = UnionToTuple<ObjectEntries<R>> extends ReplacementPair[]
  ? ReplaceAllPlaceholders<T, StartTag, EndTag, UnionToTuple<ObjectEntries<R>>>
  : T;

export type ExtractPlaceholdersInText<
  T extends string,
  StartTag extends string,
  EndTag extends string,
  Cache extends string[] = [],
> = T extends TextWithPlaceholders<Placeholder<StartTag, EndTag>>
  ? T extends `${string}${StartTag}${infer S}${EndTag}${infer Rest}`
    ? ExtractPlaceholdersInText<Rest, StartTag, EndTag, [...Cache, S]>
    : Cache
  : Cache;

/**
 * Same as {@link Template.Replacements} but all properties are marked as optional.
 */
export type PartialReplacements<
  T extends string,
  StartTag extends string,
  EndTag extends string,
> = Partial<Replacements<T, StartTag, EndTag>>;

export type Placeholder<S extends string, E extends string> = `${S}${string}${E}`;

/**
 * Type mapping string template placeholders to their possible replacement values.
 */
export type Replacements<
  T extends string,
  StartTag extends string,
  EndTag extends string,
> = Expand<{
  [K in ExtractPlaceholdersInText<T, StartTag, EndTag>[number]]:
    | string
    | number
    | boolean;
}>;

export type TextWithPlaceholders<P extends AnyPlaceholder> = `${string}${P}${string}`;

type AnyPlaceholder = Placeholder<string, string>;

type ReplaceAllPlaceholders<
  T extends string,
  StartTag extends string,
  EndTag extends string,
  Rep extends ReplacementPair[],
> = Rep["length"] extends 0
  ? T
  : Rep extends [infer F, ...infer R]
    ? F extends ReplacementPair
      ? R extends ReplacementPair[]
        ? ReplaceAllPlaceholders<
            ApplyReplacement<T, StartTag, EndTag, F>,
            StartTag,
            EndTag,
            R
          >
        : ReplaceAllPlaceholders<
            ApplyReplacement<T, StartTag, EndTag, F>,
            StartTag,
            EndTag,
            []
          >
      : T
    : T;

type ReplacementPair = [string, string | number | boolean];
