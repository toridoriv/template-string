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
 * @template {Utils.Primitive} T
 * @param {T} value
 * @returns {T}
 */
export function constant(value) {
  return value;
}
