/// <reference path="../typings/utils.d.ts" />
/**
 * @file Generic utilities.
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @module utils
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

/**
 * Deeply merges two objects together recursively.
 *
 * This will merge all properties from both objects recursively, overwriting values from
 * `first` with values from `second`. Objects will be merged together recursively. Arrays
 * can be merged or replaced based on the `options`.
 *
 * @example
 *
 * ```js
 * import { deepMerge } from "./utils.mjs";
 *
 * const winter = {
 *   dressing: {
 *     juice: "🍋",
 *     sweetener: "sucralose",
 *     spices: ["mint", "black pepper"],
 *   },
 *   salad: [
 *     { fruit: "🍌", quantity: 1 },
 *     { fruit: "🍎", quantity: 2 },
 *   ],
 *   calories: 120,
 * };
 *
 * const summer = {
 *   dressing: {
 *     juice: "🍊",
 *     sweetener: "brown sugar",
 *     spices: ["cinnamon"],
 *   },
 *   salad: [
 *     { fruit: "🍈", quantity: 0.5 },
 *     { fruit: "🍇", quantity: 20 },
 *     { fruit: "🍑", quantity: 1 },
 *   ],
 *   note: "refrigerate for 30 minutes",
 * };
 *
 * const allSeason = deepMerge(winter, summer, { arrays: "merge" });
 * const fall = deepMerge(summer, winter, { arrays: "replace" });
 *
 * const { assert } = console;
 *
 * assert(allSeason.dressing.juice === summer.dressing.juice);
 * assert(fall.dressing.juice === winter.dressing.juice);
 *
 * assert(allSeason.dressing.sweetener === summer.dressing.sweetener);
 * assert(fall.dressing.sweetener === winter.dressing.sweetener);
 *
 * const totalFruits = summer.salad.length + winter.salad.length
 * assert(allSeason.salad.length === totalFruits);
 * assert(fall.salad.length === winter.salad.length);
 *
 * assert(allSeason.note === summer.note);
 * assert(allSeason.calories === winter.calories);
 * assert(fall.note === summer.note);
 * assert(fall.calories === winter.calories);
 * ```
 *
 * @template {Utils.AnyRecord} R  - The type of the fist object to merge.
 * @template {Utils.AnyRecord} O  - The type of the second object to merge.
 * @param {R}                        first    - The first object to merge.
 * @param {Utils.DeepPartial<R> & O} second   - The second object to merge.
 * @param {Utils.DeepMergeOptions}   options  - Options for merging.
 * @returns {R & O} A new object containing properties from both `first` and `second`.
 */
export function deepMerge(first, second, options = {}) {
  const result = structuredClone({ ...first, ...second });

  for (const key in result) {
    const valueInRecord = first[key];
    const valueInOther = second[key];

    if (isObject(valueInRecord) && isObject(valueInOther)) {
      result[key] = deepMerge(valueInRecord, valueInOther, options);
      continue;
    }

    if (
      Array.isArray(valueInRecord) &&
      Array.isArray(valueInOther) &&
      options.arrays !== "replace"
    ) {
      result[key] = mergeArrays(valueInRecord, valueInOther);
      continue;
    }
  }

  return result;
}

/**
 * Filters an object's keys based on a predicate function.
 *
 * This returns a new object with only the keys from the original object that pass the
 * predicate function test.
 *
 * @example
 *
 * ```js
 * import { filterKeys } from "./utils.mjs";
 *
 * const animals = {
 *   cat: "mammal",
 *   lizard: "reptile",
 *   dog: "mammal",
 *   snake: "reptile",
 *   crocodile: "reptile",
 *   cow: "mammal",
 *   crow: "bird",
 * };
 *
 * const { assert } = console;
 *
 * const mammals = filterKeys(animals, (_, value) => value === "mammal");
 * const expectedMammals = JSON.stringify({ cat: "mammal", dog: "mammal", cow: "mammal" });
 *
 * assert(JSON.stringify(mammals) === expectedMammals);
 *
 * const firstLetterC = filterKeys(animals, (key) => key.startsWith("c"));
 * const expectedFirstLetterC = JSON.stringify({
 *   cat: "mammal",
 *   crocodile: "reptile",
 *   cow: "mammal",
 *   crow: "bird",
 * });
 *
 * assert(JSON.stringify(firstLetterC) === expectedFirstLetterC);
 * ```
 *
 * @template {Utils.AnyRecord} R
 * - The type of the input object.
 * @param {R} record
 * - The object whose keys to filter.
 * @param {(key: string, value: Utils.SafeAny) => boolean} predicate
 * - Function that gets passed each key and value to determine whether to keep the key.
 * @returns {Partial<R>}
 * A new object containing only the filtered keys.
 */
export function filterKeys(record, predicate) {
  /**
   * @type {Partial<R>}
   */
  const result = {};

  for (const key in record) {
    const value = record[key];

    if (predicate(key, value)) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * @param {unknown} value
 * @returns {value is Map<Utils.SafeAny, Utils.SafeAny>}
 */
export function isMap(value) {
  return value instanceof Map;
}

/**
 * Checks if a value is a plain JavaScript object.
 *
 * This returns `true` if the value is an `object`, not `null`, and not an `array`.
 *
 * @example
 *
 * ```js
 * import { isObject } from "./utils.mjs";
 *
 * console.assert(isObject({}));
 * console.assert(isObject([]) === false);
 * console.assert(isObject(null) === false);
 * ```
 *
 * @param {unknown} value  - The value to check.
 * @returns {value is Utils.AnyRecord} `true` if the value is a plain object, `false`
 *                                     otherwise.
 */
export function isObject(value) {
  return typeof value === "object" && Boolean(value) && !Array.isArray(value);
}

/**
 * Merges two arrays together into a new array.
 *
 * This takes two arrays of the same type, concatenates them together, and returns a new
 * array containing all the elements from both arrays.
 *
 * **IMPORTANT**: The original arrays are not modified.
 *
 * @example
 *
 * ```js
 * import { mergeArrays } from "./utils.mjs";
 *
 * const veggies = ["🥒", "🥕"];
 * const fruits = ["🍇", "🍏"];
 * const veggiesAndFruits = mergeArrays(veggies, fruits);
 *
 * console.assert(veggiesAndFruits.includes(veggies[0]));
 * console.assert(veggiesAndFruits.includes(veggies[1]));
 * console.assert(veggiesAndFruits.includes(fruits[0]));
 * console.assert(veggiesAndFruits.includes(fruits[1]));
 * console.assert(veggies.length === 2);
 * console.assert(fruits.length === 2);
 * console.assert(veggiesAndFruits.length === 4);
 * ```
 *
 * @template {Utils.AnyArray} T  - The array type.
 * @param {T} arr1  - The first array to merge.
 * @param {T} arr2  - The second array to merge.
 * @returns {T} A new array containing all elements from both `arr1` and `arr2`.
 */
export function mergeArrays(arr1, arr2) {
  return structuredClone([...arr1, ...arr2]);
}
