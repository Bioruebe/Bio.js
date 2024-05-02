import { describe, expect, test } from "vitest";
import { addColumn, moveColumn, removeColumn } from "./matrix";


describe("addColumn", () => {
	test("should add a column with a single value", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = addColumn(array, 1, 10);
		expect(result).toEqual([[1, 10, 2, 3], [4, 10, 5, 6], [7, 10, 8, 9]]);
	});

	test("should add a column with an array of values", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = addColumn(array, 1, [10, 11, 12]);
		expect(result).toEqual([[1, 10, 2, 3], [4, 11, 5, 6], [7, 12, 8, 9]]);
	});

	test("should add a column at the beginning", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = addColumn(array, 0, 10);
		expect(result).toEqual([[10, 1, 2, 3], [10, 4, 5, 6], [10, 7, 8, 9]]);
	});

	test("should add a column at the end", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = addColumn(array, 3, 10);
		expect(result).toEqual([[1, 2, 3, 10], [4, 5, 6, 10], [7, 8, 9, 10]]);
	});

	test("should add a column to a single-row array", () => {
		const array = [[1, 2, 3]];
		const result = addColumn(array, 1, 10);
		expect(result).toEqual([[1, 10, 2, 3]]);
	});

	test("should add a column to a single-column array", () => {
		const array = [[1], [2], [3]];
		const result = addColumn(array, 1, 10);
		expect(result).toEqual([[1, 10], [2, 10], [3, 10]]);
	});

	test("should not add anything to an empty array", () => {
		const array: number[][] = [];
		const result = addColumn(array, 0, 10);
		expect(result).toEqual([]);
	});

	test("should insert from the end if the index is negative", () => {
		const array = [[1, 2, 3]];
		const result = addColumn(array, -1, 10);
		expect(result).toEqual([[1, 2, 10, 3]]);
	});

	test("should throw an error if the index is out of range", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		expect(() => addColumn(array, 4, 10)).toThrowError(RangeError);
	});

	test("should throw an error if the index is out of range for any row", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7], [8, 9, 10, 11]];
		expect(() => addColumn(array, 4, 10)).toThrowError(RangeError("Index out of range for row 1"));
	});
});

describe("removeColumn", () => {
	test("should remove a column from each row", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = removeColumn(array, 1);
		expect(result).toEqual([[1, 3], [4, 6], [7, 9]]);
	});

	test("should remove the first column from each row", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = removeColumn(array, 0);
		expect(result).toEqual([[2, 3], [5, 6], [8, 9]]);
	});

	test("should remove the last column from each row", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		const result = removeColumn(array, 2);
		expect(result).toEqual([[1, 2], [4, 5], [7, 8]]);
	});

	test("should remove a column from a single-row array", () => {
		const array = [[1, 2, 3]];
		const result = removeColumn(array, 1);
		expect(result).toEqual([[1, 3]]);
	});

	test("should remove a column from a single-column array", () => {
		const array = [[1], [2], [3]];
		const result = removeColumn(array, 0);
		expect(result).toEqual([[], [], []]);
	});

	test("should remove from the end if the index is negative", () => {
		const array = [[1, 2, 3]];
		const result = removeColumn(array, -1);
		expect(result).toEqual([[1, 2]]);
	});

	test("should throw an error if the array is empty", () => {
		const array: number[][] = [];
		expect(() => removeColumn(array, 0)).toThrowError(RangeError);
	});

	test("should throw an error if the index is out of range", () => {
		const array = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
		expect(() => removeColumn(array, 3)).toThrowError(RangeError);
	});
});

describe("moveColumn", () => {
	test("should move a column to a new index", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, 1, 2);
		expect(result).toEqual([[1, 3, 2, 4], [5, 7, 6, 8], [9, 11, 10, 12]]);
	});

	test("should move a column to the beginning", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, 3, 0);
		expect(result).toEqual([[4, 1, 2, 3], [8, 5, 6, 7], [12, 9, 10, 11]]);
	});

	test("should move a column to the end", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, 1, 3);
		expect(result).toEqual([[1, 3, 4, 2], [5, 7, 8, 6], [9, 11, 12, 10]]);
	});

	test("should return the same array if the indexes are the same", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, 1, 1);
		expect(result).toEqual([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]);
	});

	test("should move a column if index is negative", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, -1, 0);
		expect(result).toEqual([[4, 1, 2, 3], [8, 5, 6, 7], [12, 9, 10, 11]]);
	});

	test("should move a column if to is negative", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		const result = moveColumn(array, 1, -1);
		expect(result).toEqual([[1, 3, 4, 2], [5, 7, 8, 6], [9, 11, 12, 10]]);
	});

	test("should throw an error if the array is empty", () => {
		const array: number[][] = [];
		expect(() => moveColumn(array, 0, 1)).toThrowError(RangeError);
	});

	test("should throw an error if index is out of range", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		expect(() => moveColumn(array, 4, 1)).toThrowError(RangeError);
	});

	test("should throw an error if to is out of range", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		expect(() => moveColumn(array, 1, 4)).toThrowError(RangeError);
	});

	test("should throw an error if negative index is out of range", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		expect(() => moveColumn(array, -4, 1)).toThrowError(RangeError);
	});

	test("should throw an error if negative to is out of range", () => {
		const array = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
		expect(() => moveColumn(array, 1, -4)).toThrowError(RangeError);
	});
});