import { describe, expect, test } from "vitest";
import { clamp, roundFloat } from "./math";


describe("clamp", () => {
	test("should return the number if between minimum and maximum", () => {
		expect(clamp(1, 0, 2)).toBe(1);
		expect(clamp(0, 0, 2)).toBe(0);
		expect(clamp(2, 0, 2)).toBe(2);
	});

	test("should return the minimum if below the minimum", () => {
		expect(clamp(0, 1, 3)).toBe(1);
	});

	test("should return the maximum if above the maximum", () => {
		expect(clamp(3, 0, 2)).toBe(2);
	});

	test("should handle negative numbers", () => {
		expect(clamp(-3, -2, 0)).toBe(-2);
		expect(clamp(-2, -2, 0)).toBe(-2);
		expect(clamp(-1, -2, 0)).toBe(-1);
		expect(clamp(0, -2, 0)).toBe(0);
		expect(clamp(1, -2, 0)).toBe(0);
	});

	test("should handle floating point numbers", () => {
		expect(clamp(1.5, 0, 2)).toBe(1.5);
		expect(clamp(1.5, 0, 1)).toBe(1);
		expect(clamp(1.5, 0, 1.5)).toBe(1.5);
		expect(clamp(1.5, 0, 1.4)).toBe(1.4);
	});

	test("should handle NaN", () => {
		expect(clamp(NaN, 0, 2)).toBeNaN();
	});

	test("should handle Infinity", () => {
		expect(clamp(Infinity, 0, 2)).toBe(2);
		expect(clamp(-Infinity, 0, 2)).toBe(0);
		expect(clamp(1, -Infinity, Infinity)).toBe(1);
		expect(clamp(-Infinity, -Infinity, Infinity)).toBe(-Infinity);
	});

	test("should handle equal minimum and maximum values", () => {
		expect(clamp(1, 1, 1)).toBe(1);
	});

	test("should throw an error if the minimum value is greater than the maximum value", () => {
		expect(() => clamp(1, 2, 0)).toThrowError(RangeError);
	});

	test("should throw an error if the minimum value is not a number", () => {
		expect(() => clamp(1, NaN, 0)).toThrowError(RangeError);
	});

	test("should throw an error if the maximum value is not a number", () => {
		expect(() => clamp(1, 0, NaN)).toThrowError(RangeError);
	});
});

describe("roundFloat", () => {
	test("should round a positive number to the given amount of decimals", () => {
		expect(roundFloat(3.14159, 3)).toBe(3.142);
		expect(roundFloat(3.14159, 2)).toBe(3.14);
		expect(roundFloat(3.14159, 1)).toBe(3.1);
		expect(roundFloat(3.14159, 0)).toBe(3);
	});

	test("should round a negative number to the given amount of decimals", () => {
		expect(roundFloat(-3.14159, 3)).toBe(-3.142);
		expect(roundFloat(-3.14159, 2)).toBe(-3.14);
		expect(roundFloat(-3.14159, 1)).toBe(-3.1);
		expect(roundFloat(-3.14159, 0)).toBe(-3);
	});

	test("should return 0 if the input number is 0", () => {
		expect(roundFloat(0)).toBe(0);
	});

	test("should round a number with less decimals than the specified amount of digits", () => {
		expect(roundFloat(3.14, 3)).toBe(3.14);
		expect(roundFloat(3.1, 2)).toBe(3.1);
		expect(roundFloat(3, 1)).toBe(3);
	});

	test("should handle NaN and Infinity", () => {
		expect(roundFloat(NaN)).toBeNaN();
		expect(roundFloat(Infinity)).toBe(Infinity);
		expect(roundFloat(-Infinity)).toBe(-Infinity);
	});

	test("should throw an error if the amount of digits is negative", () => {
		expect(() => roundFloat(3.14159, -1)).toThrowError(RangeError);
	});

	test("should throw an error if the amount of digits is not an integer", () => {
		expect(() => roundFloat(3.14159, 1.5)).toThrowError(RangeError);
	});

	test("should throw an error if the amount of digits is not a number", () => {
		expect(() => roundFloat(3.14159, NaN)).toThrowError(RangeError);
	});
});
