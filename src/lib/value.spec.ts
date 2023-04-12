import { describe, expect, test } from "vitest";
import { isEmpty, isNullOrUndefined } from "./value";


describe("isNullOrUndefined", () => {
	test("should return true if value is null", () => {
		expect(isNullOrUndefined(null)).toBe(true);
	});

	test("should return true if value is undefined", () => {
		expect(isNullOrUndefined(undefined)).toBe(true);
	});

	test("should return false if value is not null or undefined", () => {
		expect(isNullOrUndefined("hello")).toBe(false);
		expect(isNullOrUndefined(false)).toBe(false);
		expect(isNullOrUndefined(0)).toBe(false);
		expect(isNullOrUndefined([])).toBe(false);
		expect(isNullOrUndefined({})).toBe(false);
		expect(isNullOrUndefined(() => {})).toBe(false);
	});
});

describe("isEmpty", () => {
	test("should return true if value is null or undefined", () => {
		expect(isEmpty(null)).toBe(true);
		expect(isEmpty(undefined)).toBe(true);
	});

	test("should return true if value is empty string", () => {
		expect(isEmpty("")).toBe(true);
	});

	test("should return true if value is empty array", () => {
		expect(isEmpty([])).toBe(true);
	});

	test("should return true if value is empty object", () => {
		expect(isEmpty({})).toBe(true);
	});

	test("should return false if value is not empty", () => {
		expect(isEmpty("hello")).toBe(false);
		expect(isEmpty(false)).toBe(false);
		expect(isEmpty(0)).toBe(false);
		expect(isEmpty(1)).toBe(false);
		expect(isEmpty([1, 2, 3])).toBe(false);
		expect(isEmpty({ name: "Alice" })).toBe(false);
		expect(isEmpty(() => {})).toBe(false);
	});
});