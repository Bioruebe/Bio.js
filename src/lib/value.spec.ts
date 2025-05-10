import { describe, expect, test } from "vitest";
import { isEmpty, isNullOrUndefined, isPrimitive } from "./value";


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

describe("isPrimitive", () => {
	test("should return true for numbers", () => {
		expect(isPrimitive(42)).toBe(true);
	});

	test("should return true for strings", () => {
		expect(isPrimitive("test")).toBe(true);
	});

	test("should return true for booleans", () => {
		expect(isPrimitive(true)).toBe(true);
		expect(isPrimitive(false)).toBe(true);
	});

	test("should return false for objects", () => {
		expect(isPrimitive({})).toBe(false);
	});

	test("should return false for arrays", () => {
		expect(isPrimitive([])).toBe(false);
		expect(isPrimitive([1, 2, 3])).toBe(false);
	});

	test("should return true for null", () => {
		expect(isPrimitive(null)).toBe(true);
	});

	test("should return true for undefined", () => {
		expect(isPrimitive(undefined)).toBe(true);
	});

	test("should return true for symbols", () => {
		expect(isPrimitive(Symbol("test"))).toBe(true);
	});

	test("should return true for BigInt", () => {
		expect(isPrimitive(BigInt(42))).toBe(true);
	});

	test("should return false for Date", () => {
		expect(isPrimitive(new Date())).toBe(false);
	});

	test("should return false for RegExp", () => {
		expect(isPrimitive(/test/)).toBe(false);
	});

	test("should return false for Map", () => {
		expect(isPrimitive(new Map())).toBe(false);
	});

	test("should return false for Set", () => {
		expect(isPrimitive(new Set())).toBe(false);
	});

	test("should return false for functions", () => {
		expect(isPrimitive(function() {})).toBe(false);
		expect(isPrimitive(() => {})).toBe(false);
	});

	test("should return false for class instances", () => {
		class TestClass {}
		expect(isPrimitive(new TestClass())).toBe(false);
	});
});