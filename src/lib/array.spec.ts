import { beforeEach, describe, expect, test } from "vitest";
import {
	includesCaseInsensitive,
	isEmptyArray,
	removeDuplicates,
	removeEmpty,
	removeDuplicatesAndEmpty,
	findMaxArrayObject,
	getOuterElements,
	removeDuplicatesBy,
	joinReducer,
	sortByValue,
	createChainedSortingFunction,
	dynamicComparer,
	dynamicComparerDescending,
	sortByValues,
	shift
} from "./array";


const mixedArray = ["test", 2, 5, "test", -1, null, 5, undefined, ""];
const stringArray = ["test", "2", "5", "test", "test2", "Test", "TEST"];
const simpleObjectArray = [{ prop: 1 }, { prop: 2 }, { prop: 3 }];
const complexObjectArray = [{ prop: 1, prop2: 3 }, { prop: 2, prop2: 2 }, { prop: 3, prop2: 1 }];
const complexObjectWithMissingArray = [...complexObjectArray, { prop: 4 }, { prop: null, prop2: null }, { prop: undefined, prop2: 5 }];
const userArray = [
	{ id: 1, name: "John" },
	{ id: 2, name: "Mary" },
];
const userArrayWithDuplicates = [
	{ id: 1, name: "John" },
	{ id: 2, name: "Mary" },
	{ id: 3, name: "John" },
	{ id: 4, name: "Mary" },
];

describe("createChainedSortingFunction", () => {
	test("should return an empty sorting function if an empty array is given", () => {
		const sortFn = createChainedSortingFunction([]);
		expect(sortFn).toBeInstanceOf(Function);
	});

	test("should sort by a single property in ascending order", () => {
		const input = [{ age: 30 }, { age: 20 }, { age: 40 }];
		const expected = [{ age: 20 }, { age: 30 }, { age: 40 }];
		const sortingFunction = createChainedSortingFunction(["age"]);
		const result = input.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by a single property in descending order", () => {
		const input = [{ age: 30 }, { age: 20 }, { age: 40 }];
		const expected = [{ age: 40 }, { age: 30 }, { age: 20 }];
		const sortingFunction = createChainedSortingFunction(["-age"]);
		const result = input.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by value of key in object", () => {
		const input = [
			{ age: 30, verified: true },
			{ age: 20, verified: false },
			{ age: 40, verified: true },
			{ age: 20, verified: true }
		];
		const expected = [
			{ age: 20, verified: true },
			{ age: 30, verified: true },
			{ age: 40, verified: true },
			{ age: 20, verified: false }
		];
		const sortingFunction = createChainedSortingFunction([["verified", true], "age"]);
		const result = input.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by value of key in object with descending order", () => {
		const input = [
			{ age: 30, verified: true },
			{ age: 20, verified: false },
			{ age: 40, verified: true },
			{ age: 20, verified: true }
		];
		const expected = [
			{ age: 40, verified: true },
			{ age: 30, verified: true },
			{ age: 20, verified: true },
			{ age: 20, verified: false }
		];
		const sortingFunction = createChainedSortingFunction([["verified", false, "DESC"], "-age"]);
		const result = input.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by multiple properties with ascending order", () => {
		const data = [
			{ name: "Bob", age: 30, score: 80 },
			{ name: "Alice", age: 25, score: 90 },
			{ name: "Carl", age: 25, score: 70 }
		];
		const expected = [
			{ name: "Carl", age: 25, score: 70 },
			{ name: "Alice", age: 25, score: 90 },
			{ name: "Bob", age: 30, score: 80 }
		];
		const sortingFunction = createChainedSortingFunction(["age", "score"]);
		const result = data.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by multiple properties with descending order", () => {
		const data = [
			{ name: "Bob", age: 30, score: 80 },
			{ name: "Alice", age: 25, score: 90 },
			{ name: "Carl", age: 25, score: 70 }
		];
		const expected = [
			{ name: "Bob", age: 30, score: 80 },
			{ name: "Alice", age: 25, score: 90 },
			{ name: "Carl", age: 25, score: 70 }
		];
		const sortingFunction = createChainedSortingFunction(["-age", "-score"]);
		const result = data.sort(sortingFunction);
		expect(result).toEqual(expected);
	});

	test("should sort by multiple properties in ascending and descending order", () => {
		const data = [
			{ confidence: 1, verified: true, size: 10 },
			{ confidence: 2, verified: false, size: 20 },
			{ confidence: 2, verified: true, size: 5 },
			{ confidence: 3, verified: true, size: 10 },
			{ confidence: 3, verified: false, size: 20 },
		];
		const expected = [
			{ confidence: 3, verified: true, size: 10 },
			{ confidence: 3, verified: false, size: 20 },
			{ confidence: 2, verified: true, size: 5 },
			{ confidence: 2, verified: false, size: 20 },
			{ confidence: 1, verified: true, size: 10 }
		];
		const sortingFunction = createChainedSortingFunction(["-confidence", ["verified", true], "size"]);
		const sorted = data.sort(sortingFunction);
		expect(sorted).toEqual(expected);
	});

	test("should allow custom sorting functions to be used", () => {
		const data = [
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Alice" },
			{ id: 1, name: "Charlie" },
			{ id: 3, name: "Dave" },
		];
		const expected = [
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Charlie" },
			{ id: 3, name: "Dave" },
		];
		const sortFn = createChainedSortingFunction([
			(a, b) => a.name.localeCompare(b.name),
			(a, b) => a.id - b.id,
		]);
		const result = data.sort(sortFn);
		expect(result).toEqual(expected);
	});

	test("should handle objects with missing properties", () => {
		const data = [
			{ id: 2 },
			{ id: 1 },
			{ id: 3, name: "Alice" }
		];
		const expected = [
			{ id: 3, name: "Alice" },
			{ id: 1 },
			{ id: 2 },
		];
		const sortFn = createChainedSortingFunction(["name", "id"]);
		const result = data.sort(sortFn);
		expect(result).toEqual(expected);
	});

	test("should handle objects with nested properties", () => {
		const data = [
			{ id: 2, user: { name: "Bob" } },
			{ id: 1, user: { name: "Alice" } },
			{ id: 1, user: { name: "Charlie" } },
			{ id: 3, user: { name: "Dave" } },
		];
		const expected = [
			{ id: 1, user: { name: "Alice" } },
			{ id: 2, user: { name: "Bob" } },
			{ id: 1, user: { name: "Charlie" } },
			{ id: 3, user: { name: "Dave" } },
		];
		const sortFn = createChainedSortingFunction(["user.name"]);
		const result = data.sort(sortFn);
		expect(result).toEqual(expected);
	});

	test("should handle objects with null or undefined properties", () => {
		const data = [
			{ id: 2, name: null },
			{ id: 1 },
			{ id: 3, name: undefined
		}];
		const expected = [
			{ id: 1 },
			{ id: 2, name: null },
			{ id: 3, name: undefined }
		];
		const sortFn = createChainedSortingFunction(["name", "id"]);
		const result = data.sort(sortFn);
		expect(result).toEqual(expected);
	});

	test("should throw an error if an invalid sorting definition is given", () => {
		expect(() => createChainedSortingFunction([123 as any])).toThrowError("Invalid sorting function: 123");
		expect(() => createChainedSortingFunction(["", { foo: "bar" } as any])).toThrowError("Invalid sorting function:");
		expect(() => createChainedSortingFunction([{ foo: "bar" }, () => {}] as any)).toThrowError("Invalid sorting function:");
		expect(() => createChainedSortingFunction([["foo", "bar", "ASC", "baz"] as any])).toThrowError("Invalid sorting function:");
	});

	test("should keep original order if all sorting functions return 0", () => {
		const data = [
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Alice" },
			{ id: 1, name: "Charlie" },
			{ id: 3, name: "Dave" },
		];
		const expected = [
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Alice" },
			{ id: 1, name: "Charlie" },
			{ id: 3, name: "Dave" },
		];
		const sortFn = createChainedSortingFunction([() => 0, () => 0, () => 0]);
		const result = data.sort(sortFn);
		expect(result).toEqual(expected);
	});
});

describe("findMaxArrayObject", () => {
	test("empty array", () => {
		expect(findMaxArrayObject([], "test")).toBeNull();
	});

	test("array with one element", () => {
		expect (findMaxArrayObject([simpleObjectArray[0]], "prop")).toBe(simpleObjectArray[0]);
	});

	test("array with multiple elements", () => {
		expect(findMaxArrayObject(simpleObjectArray, "prop")).toBe(simpleObjectArray[2]);
	});

	test("array with multiple elements and multiple properties", () => {
		expect(findMaxArrayObject(complexObjectArray, "prop")).toBe(complexObjectArray[2]);
		expect(findMaxArrayObject(complexObjectArray, "prop2")).toBe(complexObjectArray[0]);
	});

	test("array with multiple elements and multiple properties, including null", () => {
		expect(findMaxArrayObject(complexObjectWithMissingArray, "prop")).toBe(complexObjectWithMissingArray[3]);
		expect(findMaxArrayObject(complexObjectWithMissingArray, "prop2")).toBe(complexObjectWithMissingArray[5]);
	});
});

describe("getOuterElements", () => {
	test("empty array", () => {
		expect(getOuterElements([])).toEqual([]);
	});

	test("array with one element", () => {
		expect(getOuterElements([1])).toEqual([1]);
	});

	test("array with multiple elements", () => {
		expect(getOuterElements([1, 2, 3])).toEqual([1, 3]);
		expect(getOuterElements(mixedArray)).toEqual(["test", ""]);
		expect(getOuterElements(stringArray)).toEqual(["test", "TEST"]);
		expect(getOuterElements(simpleObjectArray)).toEqual([simpleObjectArray[0], simpleObjectArray[2]]);
	});
});

describe("includesCaseInsensitve", () => {
	test("empty array", () => {
		expect(includesCaseInsensitive([], "test")).toBeFalsy();
	});

	test("not an array", () => {
		expect(includesCaseInsensitive("test" as any, "test")).toBeFalsy();
	});

	test("empty search string", () => {
		// expect(includesCaseInsensitive(stringArray, null)).toBeFalsy();
		expect(includesCaseInsensitive(stringArray, "")).toBeFalsy();
	});

	test("array contains string", () => {
		expect(includesCaseInsensitive(stringArray, "test")).toBeTruthy();
		expect(includesCaseInsensitive(stringArray, "Test")).toBeTruthy();
		expect(includesCaseInsensitive(stringArray, "tEst")).toBeTruthy();
		expect(includesCaseInsensitive(stringArray, "TEST")).toBeTruthy();
	});

	test("array does not contain string", () => {
		expect(includesCaseInsensitive(stringArray, "best")).toBeFalsy();
		expect(includesCaseInsensitive(stringArray, "Best")).toBeFalsy();
		expect(includesCaseInsensitive(stringArray, "bEst")).toBeFalsy();
		expect(includesCaseInsensitive(stringArray, "BEST")).toBeFalsy();
	});
});

describe("isEmptyArray", () => {
	test("empty array", () => {
		expect(isEmptyArray([])).toBe(true);
	});

	test("not array", () => {
		expect(isEmptyArray(undefined)).toBe(false);
		expect(isEmptyArray(null)).toBe(false);
	});

	test("non-empty array", () => {
		expect(isEmptyArray(mixedArray)).toBe(false);
		expect(isEmptyArray(stringArray)).toBe(false);
		expect(isEmptyArray([undefined])).toBe(false);
	});
});

describe("removeDuplicates", () => {
	test("empty array", () => {
		expect(removeDuplicates([])).toEqual([]);
	});

	test("array without duplicates", () => {
		expect(removeDuplicates(simpleObjectArray)).toEqual(simpleObjectArray);
	});

	test("array with duplicates", () => {
		const expected = ["test", "2", "5", "test2", "Test", "TEST"]
		expect(removeDuplicates(stringArray)).toEqual(expected);
	});

	test("array with duplicates and empty values", () => {
		const expected = ["test", 2, 5, -1, null, undefined, ""];
		expect(removeDuplicates(mixedArray)).toEqual(expected);
	});
});

describe("removeDuplicatesAndEmpty", () => {
	test("empty array", () => {
		expect(removeDuplicatesAndEmpty([])).toEqual([]);
	});

	test("array without duplicates", () => {
		expect(removeDuplicates(simpleObjectArray)).toEqual(simpleObjectArray);
	});

	test("array with duplicates", () => {
		const expected = ["test", "2", "5", "test2", "Test", "TEST"]
		expect(removeDuplicates(stringArray)).toEqual(expected);
	});

	test("array with duplicates and empty values", () => {
		const expected = ["test", 2, 5, -1];
		expect(removeDuplicatesAndEmpty(mixedArray)).toEqual(expected);
	});
});

describe("removeDuplicatesBy", () => {
	describe("String accessor", () => {
		test("empty array", () => {
			expect(removeDuplicatesBy([], "test")).toEqual([]);
		});

		test("array with one element", () => {
			expect(removeDuplicatesBy([simpleObjectArray[0]], "prop")).toEqual([simpleObjectArray[0]]);
		});

		test("array without duplicates", () => {
			expect(removeDuplicatesBy(simpleObjectArray, "prop")).toEqual(simpleObjectArray);
			expect(removeDuplicatesBy(userArray, "name")).toEqual(userArray);
		});

		test("array with duplicates", () => {
			expect(removeDuplicatesBy(userArrayWithDuplicates, "name")).toEqual(userArray);
		});
	});

	describe("Function accessor", () => {
		test("empty array", () => {
			expect(removeDuplicatesBy([], () => {})).toEqual([]);
		});

		test("array with one element", () => {
			expect(removeDuplicatesBy([simpleObjectArray[0]], ((o) => o.prop))).toEqual([simpleObjectArray[0]]);
		});

		test("array without duplicates", () => {
			expect(removeDuplicatesBy(simpleObjectArray, ((o) => o.prop))).toEqual(simpleObjectArray);
			expect(removeDuplicatesBy(userArray, (u) => u.name)).toEqual(userArray);
		});

		test("array with duplicates", () => {
			expect(removeDuplicatesBy(userArrayWithDuplicates, (u) => u.name)).toEqual(userArray);
		});
	});

	describe("Invalid accessor", () => {
		test("string accessor", () => {
			expect(removeDuplicatesBy(simpleObjectArray, "test")).toEqual(simpleObjectArray);
		});

		test("function accessor", () => {
			expect(removeDuplicatesBy(simpleObjectArray, () => {})).toEqual(simpleObjectArray);
		});
	});
});

describe("removeEmpty", () => {
	test("empty array", () => {
		expect(removeEmpty([])).toEqual([]);
	});

	test("array without empty values", () => {
		expect(stringArray).toEqual(stringArray);
		expect(simpleObjectArray).toEqual(simpleObjectArray);
	});

	test("array with duplicates and empty values", () => {
		const expected = ["test", 2, 5, "test", -1, 5];
		expect(removeEmpty(mixedArray)).toEqual(expected);
	});
});

describe("shift", () => {
	test("should shift the array", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, 2);
		expect(shifted).toEqual([3, 4, 5, 1, 2]);
	});

	test("should shift the array with negative by value", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, -2);
		expect(shifted).toEqual([4, 5, 1, 2, 3]);
	});

	test("should return the same array if by is 0", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, 0);
		expect(shifted).toEqual(arr);
	});

	test("should return empty array if input is empty", () => {
		const arr: number[] = [];
		const shifted = shift(arr, 2);
		expect(shifted).toEqual([]);
	});

	test("should use modulo if by is greater than the array length", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, 7);
		expect(shifted).toEqual([3, 4, 5, 1, 2]);
	});

	test("should use modulo if by is less than the negative array length", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, -7);
		expect(shifted).toEqual([4, 5, 1, 2, 3]);
	});

	test("should return the same array if by is equal to the array length", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, arr.length);
		expect(shifted).toEqual(arr);
	});

	test("should return the same array if by is equal to the negative array length", () => {
		const arr = [1, 2, 3, 4, 5];
		const shifted = shift(arr, -arr.length);
		expect(shifted).toEqual(arr);
	});
});

describe("sortByValue", () => {
	let arr: { id: number, name: string }[];
	beforeEach(() => {
		arr = [
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 3, name: "Charlie" },
			{ id: 4, name: "Alice" }
		];
	});

	test("should return the original array if the key does not exist on the objects", () => {
		const sortedArr = arr.sort(sortByValue("age" as any, 30));
		expect(sortedArr).toEqual(arr);
	});

	test("should sort objects with the given value to the top", () => {
		const sortedArr = arr.sort(sortByValue("name", "Alice"));
		expect(sortedArr).toEqual([
			{ id: 1, name: "Alice" },
			{ id: 4, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 3, name: "Charlie" }
		]);
	});

	test("should sort objects with the given value to the top regardless of type", () => {
		const sortedArr = arr.sort(sortByValue("id", 3));
		expect(sortedArr).toEqual([
			{ id: 3, name: "Charlie" },
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob" },
			{ id: 4, name: "Alice" }
		]);
	});

	test("should not change the order of objects that do not match the given value", () => {
		const sortedArr = arr.sort(sortByValue("name", "Bob"));
		expect(sortedArr).toEqual([
			{ id: 2, name: "Bob" },
			{ id: 1, name: "Alice" },
			{ id: 3, name: "Charlie" },
			{ id: 4, name: "Alice" }
		]);
	});

	test("should sort descending if the parameter is true", () => {
		const sortedArr = arr.sort(sortByValue("name", "Alice", "DESC"));
		expect(sortedArr).toEqual([
			{ id: 2, name: "Bob" },
			{ id: 3, name: "Charlie" },
			{ id: 1, name: "Alice" },
			{ id: 4, name: "Alice" }
		]);
	});

	test("should sort objects with the given value to the top, then sort by another key", () => {
		const multiPropertyArr = [
			{ id: 1, name: "Alice", age: 25 },
			{ id: 2, name: "Bob", age: 50 },
			{ id: 3, name: "Charlie", age: 30 },
			{ id: 4, name: "Alice", age: 35 },
		];
		const sortedArr = multiPropertyArr.sort(sortByValue("name", "Alice")).sort(sortByValue("age", 30));
		expect(sortedArr).toEqual([
			{ id: 3, name: "Charlie", age: 30 },
			{ id: 1, name: "Alice", age: 25 },
			{ id: 4, name: "Alice", age: 35 },
			{ id: 2, name: "Bob", age: 50 }
		]);
	});

	test("should sort objects with the given value to the bottom, then sort by another key", () => {
		const multiPropertyArr = [
			{ id: 1, name: "Alice", age: 25 },
			{ id: 2, name: "Bob", age: 50 },
			{ id: 3, name: "Charlie", age: 30 },
			{ id: 4, name: "Alice", age: 35 },
		];

		const sortedArr = multiPropertyArr.sort(sortByValue("name", "Alice", "DESC")).sort(sortByValue("age", 30, "DESC"));
		expect(sortedArr).toEqual([
			{ id: 2, name: "Bob", age: 50 },
			{ id: 1, name: "Alice", age: 25 },
			{ id: 4, name: "Alice", age: 35 },
			{ id: 3, name: "Charlie", age: 30 }
		]);
	});

	test("should handle objects with missing keys", () => {
		const arrWithMissingKeys = [
			{ id: 1, name: "Alice" },
			{ id: 2, name: "Bob", age: 25 },
			{ id: 3, name: "Charlie", age: 30 },
			{ id: 4, age: 25 }
		];
		const sortedArr = arrWithMissingKeys.sort(sortByValue("age", 25));
		expect(sortedArr).toEqual([
			{ id: 2, name: "Bob", age: 25 },
			{ id: 4, age: 25 },
			{ id: 1, name: "Alice" },
			{ id: 3, name: "Charlie", age: 30 }
		]);
	});
});

describe("sortByValues", () => {
	test("should return the original array if the values array is empty", () => {
		const arr = ["canceled", "completed", "in progress", "new"];
		const sortedArr = arr.sort(sortByValues([] as string[]));
		expect(sortedArr).toEqual(arr);
	});

	test("should sort a string array based on the given order", () => {
		const values = ["new", "in progress", "completed", "canceled"];
		const array = ["canceled", "completed", "in progress", "new"];
		array.sort(sortByValues(values));
		expect(array).toEqual(["new", "in progress", "completed", "canceled"]);
	});

	test("should sort a string array based on the given order, ignoring values not in the order", () => {
		const values = ["new", "in progress", "completed", "canceled"];
		const array = ["canceled", "completed", "in progress", "new", "unknown"];
		array.sort(sortByValues(values));
		expect(array).toEqual(["new", "in progress", "completed", "canceled", "unknown"]);
	});

	test("should sort a number array based on the given order", () => {
		const values = [3, 1, 2];
		const array = [1, 2, 3];
		array.sort(sortByValues(values));
		expect(array).toEqual([3, 1, 2]);
	});

	test("should sort a mixed array based on the given order", () => {
		const values = ["new", 2, "completed", 1];
		const array = [1, "completed", 2, "new"];
		array.sort(sortByValues(values));
		expect(array).toEqual(["new", 2, "completed", 1]);
	});
});

describe("dynamicComparer", () => {
	test("should keep the order if both values are undefined", () => {
		const result = [undefined, undefined].sort(dynamicComparer);
		expect(result).toEqual([undefined, undefined]);
	});

	test("should sort numbers in ascending order", () => {
		const result = [5, 2].sort(dynamicComparer);
		expect(result).toEqual([2, 5]);
	});

	test("should sort strings in alphabetical order", () => {
		const result = ["banana", "apple"].sort(dynamicComparer);
		expect(result).toEqual(["apple", "banana"]);
	});

	test("should handle null values", () => {
		const result = [null, "foo", null, "bar"].sort(dynamicComparer);
		expect(result).toEqual(["bar", "foo", null, null]);
	});

	test("should handle mixed number and string values", () => {
		const result = [2, "foo", 1, "bar"].sort(dynamicComparer);
		expect(result).toEqual([1, 2, "bar", "foo"]);
	});

	test("should handle empty arrays", () => {
		const result = [].sort(dynamicComparer);
		expect(result).toEqual([]);
	});

	test("should handle arrays with one element", () => {
		const result = ["foo"].sort(dynamicComparer);
		expect(result).toEqual(["foo"]);
	});

	test("should handle arrays with identical elements", () => {
		const result = ["foo", "foo"].sort(dynamicComparer);
		expect(result).toEqual(["foo", "foo"]);
	});

	test("should handle arrays with non-primitive elements", () => {
		const obj1 = { id: 1, name: "foo" };
		const obj2 = { id: 2, name: "bar" };
		const result = [obj1, obj2].sort(dynamicComparer);
		expect(result).toEqual([obj1, obj2]);
	});
});

describe("dynamicComparerDescending", () => {
	test("should keep the order if both values are undefined", () => {
		const result = [undefined, undefined].sort(dynamicComparerDescending);
		expect(result).toEqual([undefined, undefined]);
	});

	test("should sort numbers in descending order", () => {
		const result = [5, 2].sort(dynamicComparerDescending);
		expect(result).toEqual([5, 2]);
	});

	test("should sort strings in reverse alphabetical order", () => {
		const result = ["banana", "apple"].sort(dynamicComparerDescending);
		expect(result).toEqual(["banana", "apple"]);
	});

	test("should handle null values", () => {
		const result = [null, "foo", null, "bar"].sort(dynamicComparerDescending);
		expect(result).toEqual([null, null, "foo", "bar"]);
	});

	test("should handle mixed number and string values", () => {
		const result = [2, "foo", 1, "bar"].sort(dynamicComparerDescending);
		expect(result).toEqual(["foo", "bar", 2, 1]);
	});

	test("should handle empty arrays", () => {
		const result = [].sort(dynamicComparerDescending);
		expect(result).toEqual([]);
	});

	test("should handle arrays with one element", () => {
		const result = ["foo"].sort(dynamicComparerDescending);
		expect(result).toEqual(["foo"]);
	});

	test("should handle arrays with identical elements", () => {
		const result = ["foo", "foo"].sort(dynamicComparerDescending);
		expect(result).toEqual(["foo", "foo"]);
	});

	test("should handle arrays with non-primitive elements", () => {
		const obj1 = { id: 1, name: "foo" };
		const obj2 = { id: 2, name: "bar" };
		const result = [obj1, obj2].sort(dynamicComparerDescending);
		expect(result).toEqual([obj1, obj2]);
	});
});

describe("joinReducer", () => {
	test("should return an empty array when called with an empty accumulator and an empty array", () => {
		const result = [].reduce(joinReducer, []);
		expect(result).toEqual([]);
	});

	test("should return the original accumulator when called with an empty array", () => {
		const accumulator = [1, 2, 3];
		const result = [].reduce(joinReducer, accumulator);
		expect(result).toEqual(accumulator);
	});

	test("should merge two arrays", () => {
		const arr1 = [1, 2];
		const arr2 = [3, 4];
		const result = [arr1, arr2].reduce(joinReducer, []);
		expect(result).toEqual([1, 2, 3, 4]);
	});

	test("should merge multiple arrays", () => {
		const arr1 = [1, 2];
		const arr2 = [3, 4];
		const arr3 = [5, 6];
		const result = [arr1, arr2, arr3].reduce(joinReducer, []);
		expect(result).toEqual([1, 2, 3, 4, 5, 6]);
	});

	test("should handle arrays with different data types", () => {
		const arr1 = [1, "a"];
		const arr2 = ["b", true];
		const result = [arr1, arr2].reduce(joinReducer, [] as any[]);
		expect(result).toEqual([1, "a", "b", true]);
	});
});