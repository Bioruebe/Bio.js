import { describe, expect, test } from "vitest";
import { roundFloat } from "./math";


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
