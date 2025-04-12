/// <reference path="../typings/template.d.ts" />
/**
 * @file ADD_DESCRIPTION.
 * @author Tori Rodriguez <vrodriguezfe@icloud.com>
 * @module template
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
import { constant } from "./utils.mjs";

/**
 * Template string with placeholder tags for dynamic content.
 *
 * @template {string} T
 * @template {string} [Start=DefaultStartTag]
 * @template {string} [End=DefaultEndTag]
 * @augments {String}
 */
export class TemplateString extends String {
  /**
   * Default start tag for placeholders.
   *
   * @default
   * @readonly
   */
  static DEFAULT_START_TAG = constant("{");
  /**
   * Default end tag for placeholders.
   *
   * @default
   * @readonly
   */
  static DEFAULT_END_TAG = constant("}");

  /**
   * Initializes a new `TemplateString` instance with the provided arguments.
   *
   * @template {string} T
   * @template {string} [Start=DefaultStartTag]
   * @template {string} [End=DefaultEndTag]
   * @param {ConstructorParameters<typeof TemplateString<T, Start, End>>} args
   * - Arguments for creating the template string.
   * @returns {TemplateString<T, Start, End>}
   * A new `TemplateString` instance.
   */
  static init(...args) {
    return new TemplateString(...args);
  }

  /**
   * Creates a new `TemplateString` instance from a given template and a set of
   * replacements.
   *
   * @template {AnyTemplateString} T
   * @template {Partial<T["replacements"]>} R
   * @param {T} template
   * - The original template string.
   * @param {R} replacements
   * - An object of replacements to apply.
   * @returns {TemplateString<
   *   Template.ApplyReplacements<GetRawTemplate<T>, [T["startTag"], T["endTag"]], R>,
   *   T["startTag"],
   *   T["endTag"]
   * >}
   * A new `TemplateString` instance with applied replacements.
   */
  static fromTemplate(template, replacements) {
    const _ = template.valueOf();
    /**
     * @typedef {[T["startTag"], T["endTag"]]} Tags
     */

    /**
     * @typedef {Template.ApplyReplacements<typeof _, Tags, R>} NewTemplate
     */

    /**
     * @type {NewTemplate}
     */
    const newTemplate = template.render(replacements, false);

    return new TemplateString(newTemplate, [template.startTag, template.endTag]);
  }

  /**
   * Gets the regular expression pattern for finding placeholders in a template.
   *
   * @param {string} start  - The start tag for placeholders.
   * @param {string} end    - The start tag for placeholders.
   * @returns {RegExp} The regular expression pattern.
   */
  static getPlaceholderPattern(start, end) {
    return new RegExp(
      `(?<![${start}|${start[0]}])${start}[A-Za-z0-9\-\_]+?${end}(?![${end}|${end[0]}] )`,
      "g",
    );
  }

  /**
   * Creates a new `TemplateString` instance.
   *
   * @param {T}                     template        - An string containing placeholders
   *                                                marked by start and end tags.
   * @param {[Start, End]}          [tags]          - An optional array containing start
   *                                                and end tags for placeholders. If not
   *                                                provided, default tags will be used.
   * @param {Partial<Replacements>} [replacements]  - An optional object containing
   *                                                initial replacement values for
   *                                                placeholders.
   */
  constructor(template, tags, replacements) {
    super(template);

    /**
     * The start tag for placeholders.
     */
    this.startTag = /**
     * @type {Start}
     */ (tags?.[0] || TemplateString.DEFAULT_START_TAG);

    /**
     * The end tag for placeholders.
     */
    this.endTag = /**
     * @type {End}
     */ (tags?.[1] || TemplateString.DEFAULT_END_TAG);

    /**
     * The regular expression pattern for finding placeholders in the template.
     */
    this.pattern = TemplateString.getPlaceholderPattern(this.startTag, this.endTag);

    /**
     * Array of placeholders found in the template.
     */
    this.placeholders = this.#getPlaceholders();

    /**
     * Mapping of placeholders to their corresponding property name in the replacements
     * object.
     */
    this.mapping = this.#getPlaceholderMapping();

    /**
     * Default replacement values for placeholders in the template string.
     */
    this.replacements = this.#getInitialReplacements(replacements);
  }

  /**
   * @typedef {Template.Placeholders<T, [Start, End]>} Placeholders
   */

  /**
   * @typedef {Template.PlaceholderPropertyMap<T, [Start, End]>} Mapping
   */

  /**
   * @typedef {Template.Replacements<T, [Start, End]>} Replacements
   */

  /**
   * Creates a new `TemplateString` instance with updated replacements.
   *
   * @template {Partial<Replacements>} R
   * @param {R} replacements
   * - Object containing replacement values.
   * @returns {TemplateString<
   *   Template.ApplyReplacements<T, [Start, End], R>,
   *   Start,
   *   End
   * >}
   * A new `TemplateString` instance.
   */
  fork(replacements) {
    // @ts-ignore: ¯\_(ツ)_/¯
    return TemplateString.fromTemplate(this, replacements);
  }

  /**
   * Renders the template by replacing placeholders with values from the provided
   * replacements object.
   *
   * Optionally, the method performs validation to ensure all placeholders have been
   * replaced.
   *
   * @param {Partial<Replacements>} replacements      - The replacement values for
   *                                                  placeholders.
   * @param {boolean}               [validate=false]  - Flag indicating whether to
   *                                                  validate the result. Defaults to
   *                                                  `false`.
   * @returns {string} The template string with replacements applied.
   */
  render(replacements = {}, validate = false) {
    let result = /**
     * @type {string}
     */ (this.valueOf());

    for (const placeholder in this.mapping) {
      const k = /**
       * @type {keyof Replacements}
       */ (this.mapping[placeholder]);
      const value = replacements[k] ?? this.replacements[k];

      if (typeof value !== "undefined" && value !== null) {
        result = result.replaceAll(placeholder, `${value}`);
      }
    }

    if (validate) {
      this.validate(result);
    }

    return result;
  }

  /**
   * Validates the template string by checking for any remaining placeholders.
   *
   * @param {string} value  - The template string after replacements.
   * @throws {Error} Throws an error if some placeholders haven't been replaced yet.
   */
  validate(value) {
    const remainingPlaceholders = this.#getRemainingPlaceholders(value);

    if (remainingPlaceholders.length > 0) {
      throw new Error("Some placeholders haven't been replaced yet", {
        cause: {
          template: `${this}`,
          missingReplacements: remainingPlaceholders,
        },
      });
    }
  }

  /**
   * Returns the primitive value of the template string.
   *
   * @returns {T & string} The primitive value of the template string.
   * @override
   */
  valueOf() {
    const value = /**
     * @type {T & string}
     */ (String.prototype.valueOf.call(this));

    return value;
  }

  /**
   * Generates initial replacements by iterating over the template's mapping and using
   * values from the provided fallback object.
   *
   * @param {Partial<Replacements>} fallback  - The fallback replacement values.
   * @returns {Replacements}
   */
  #getInitialReplacements(fallback = {}) {
    const replacements = /**
     * @type {Utils.SafeAny}
     */ ({});

    for (const key in this.mapping) {
      const prop = this.mapping[key];
      // @ts-ignore: ¯\_(ツ)_/¯
      const value = fallback[prop] ?? null;
      replacements[prop] = value;
    }

    return replacements;
  }

  /**
   * Generates a mapping of placeholders to their corresponding property names.
   *
   * @returns {Mapping} The mapping of placeholders to property names.
   */
  #getPlaceholderMapping() {
    const mapping = /**
     * @type {Utils.SafeAny}
     */ ({});

    for (let i = 0; i < this.placeholders.length; i++) {
      const placeholder = /**
       * @type {(typeof this)["placeholders"][number] &
       *   string}
       */ (this.placeholders[i]);
      const value = placeholder.replace(this.startTag, "").replace(this.endTag, "");
      mapping[placeholder] = value;
    }

    return mapping;
  }

  /**
   * Extracts and returns an array of placeholders in the template string.
   *
   * @returns {Placeholders}
   */
  #getPlaceholders() {
    const placeholders =
      /**
       * @type {Utils.SafeAny}
       */
      (this.#getRemainingPlaceholders(this.valueOf()));

    return placeholders;
  }

  /**
   * Extracts and returns an array of remaining placeholders in the template string.
   *
   * @param {string} value  - The template string after replacements.
   * @returns {string[]} An array of remaining placeholders.
   */
  #getRemainingPlaceholders(value) {
    const matches = value.matchAll(this.pattern);

    return Array.from(matches, (match) => match[0]);
  }
}

/**
 * @typedef {typeof TemplateString.DEFAULT_START_TAG} DefaultStartTag
 */

/**
 * @typedef {typeof TemplateString.DEFAULT_END_TAG} DefaultEndTag
 */

/**
 * Represents any possible `TemplateString`.
 *
 * @typedef {TemplateString<Utils.SafeAny, Utils.SafeAny, Utils.SafeAny>}
 * AnyTemplateString
 */

/**
 * Represents the raw template string obtained by calling the `valueOf` method on any
 * template string instance.
 *
 * @template {AnyTemplateString} T
 * @typedef {ReturnType<T["valueOf"]>} GetRawTemplate
 */
