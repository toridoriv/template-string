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

/**
 * Type mapping string template placeholders to their possible replacement values.
 */
export type Replacements<T extends string> = Expand<{
  [K in ExtractTemplatePlaceholders<T>[number]]: string | number | boolean;
}>;

/**
 * Same as {@link Template.Replacements} but all properties are marked as optional.
 */
export type PartialReplacements<T extends string> = Partial<Replacements<T>>;

/**
 * Represents the application of replacements to a template string.
 * It takes a template string (`T`) and a set of replacements (`R`) and produce a new
 * string with the specified replacements applied.
 *
 * @param T  - A template string.
 * @param R  - An object containing key-value pairs.
 */
export type ApplyReplacements<T extends string, R> = UnionToTuple<
  ObjectEntries<R>
> extends ReplacementPair[]
  ? ReplaceAllInTemplate<T, UnionToTuple<ObjectEntries<R>>>
  : T;

/**
 * @ignore
 */
type ExtractTemplatePlaceholders<
  T extends string,
  Cache extends string[] = [],
> = T extends MultiPlaceholderTemplate
  ? T extends `${string}{${infer S}}${infer Rest}`
    ? ExtractTemplatePlaceholders<Rest, [...Cache, S]>
    : Cache
  : Cache;

/**
 * @ignore
 */
type ReplacementPair = [string, string | number | boolean];

/**
 * @ignore
 */
type ApplyReplacementToTemplate<
  T extends string,
  Rep extends ReplacementPair,
  Cache extends string = T,
  Templates extends string[] = ExtractTemplatePlaceholders<Cache>,
> = Rep[0] extends Templates[number] ? ReplaceAll<T, `{${Rep[0]}}`, `${Rep[1]}`> : T;

/**
 * @ignore
 */
type ReplaceAllInTemplate<
  T extends string,
  Rep extends ReplacementPair[],
> = Rep["length"] extends 0
  ? T
  : Rep extends [infer F, ...infer R]
    ? F extends ReplacementPair
      ? R extends ReplacementPair[]
        ? ReplaceAllInTemplate<ApplyReplacementToTemplate<T, F>, R>
        : ReplaceAllInTemplate<ApplyReplacementToTemplate<T, F>, []>
      : T
    : T;

/**
 * @ignore
 */
type SinglePlaceholderTemplate = `{${string}}`;

/**
 * @ignore
 */
type MultiPlaceholderTemplate = `${string}${SinglePlaceholderTemplate}${string}`;
