/**
 * @description Date and year validation helpers for temporal calendar calculations.
 * @module
 */

import type { DateInput } from "../types.ts";

/**
 * Validate a year input
 * @param year YYYY between 1583 and 9999
 * @returns the year if valid
 * @throws {RangeError} if the year is invalid
 * @throws {TypeError} if the year is not a number
 */
export function validateYear(year: number): number {
  if (typeof year !== "number") {
    throw new TypeError("Invalid date: Input must be a number");
  }
  if (!Number.isInteger(year)) {
    throw new RangeError("Invalid date: Year must be an integer");
  }
  // To avoid weirdness with the Julian calendar
  if (year < 1583 || year > 9999) {
    throw new RangeError("Invalid date: Year must be >= 1583 and <= 9999");
  }
  return year;
}

/**
 * Validate and normalize date input to a Temporal.PlainDate
 * @param date YYYY-MM-DD, YYYY, PlainDate, or PlainDateLike
 * @returns a validated Temporal.PlainDate
 * @throws {RangeError} if the date is invalid
 * @throws {TypeError} if the input type is invalid
 */
export function validateDate(date: DateInput): Temporal.PlainDate {
  if (date instanceof Temporal.PlainDate) {
    return date;
  }

  if (typeof date === "number") {
    const year = validateYear(date);
    return new Temporal.PlainDate(year, 1, 1);
  }

  if (typeof date === "string") {
    try {
      return Temporal.PlainDate.from(date, { overflow: "reject" });
    } catch (err) {
      if (err instanceof RangeError || err instanceof TypeError) {
        throw new RangeError(`Invalid date: ${date}`);
      }
      throw err;
    }
  }

  if (typeof date === "object" && date !== null && !Array.isArray(date)) {
    // Check if object has the required properties for a PlainDateLike
    const hasYear = "year" in date;
    const hasMonth = "month" in date;
    const hasDay = "day" in date;

    // If it's not a proper PlainDateLike object, throw TypeError
    if (!hasYear || !hasMonth || !hasDay) {
      throw new TypeError("Invalid date: input must be a string, number, Temporal.PlainDate, or PlainDateLike object");
    }

    // Validate year if present in the object
    if (hasYear && typeof date.year === "number") {
      validateYear(date.year);
    }

    try {
      return Temporal.PlainDate.from(date, { overflow: "reject" });
    } catch (err) {
      if (err instanceof RangeError || err instanceof TypeError) {
        throw new RangeError(`Invalid date: ${JSON.stringify(date)}`);
      }
      throw err;
    }
  }

  throw new TypeError("Invalid date: input must be a string, number, Temporal.PlainDate, or PlainDateLike object");
}

/**
 * Normalize DateInput to a calendar year (YYYY).
 * @param date YYYY-MM-DD, YYYY, PlainDate, or PlainDateLike
 * @returns the calendar year if valid
 */
export function getCalendarYear(date: DateInput): number {
  if (typeof date === "number") {
    return validateYear(date);
  }
  return validateDate(date).year;
}
