import { getProperty } from "./object";
import { compareCaseInsensitive } from "./string";
import { isEmpty, isNullOrUndefined } from "./value";


/** An object */
type Object = Record<string, any>;

/** A sorting function, which can be used with Array.sort() */
export type SortingFunction = (a: Object, b: Object) => number;

/**
 * A parameter, which specifies how to sort an array of objects. This can either be
 * - the name of the property as a string
 * - the name of the property as a string prepended with a minus sign - will reverse the sort order
 * - a sorting function, which follows the same rules as the sorting function in Array.sort()
 * - a tuple with the property name and the desired value - if one object matches the value while the other doesn't, it will be sorted to the top
 */
export type SortingDefinition = string | [string, any] | ((a: Object, b: Object) => -1 | 0 | 1);


/**
 * Find the object with the maximum value for the given property in an array
 * @param array The array to search
 * @param property The object's property to calculate the maximum value for
 * @returns The object or null
 */
export function findMaxArrayObject<T extends Object>(array: T[], property: string) {
	if (array.length < 1) return null;
	if (array.length == 1) return array[0];

	return array.reduce((prev, current) => current[property] > prev[property]? current: prev);
}

/**
 * Returns the first and last element of the given array
 * @param array The array to get the first and last element from
 * @returns An array containing the first and last element (if available) or an empty array
 */
export function getOuterElements<T>(array: T[]) {
	const result: T[] = [];
	if (array.length < 1) return result;

	result.push(array[0]);
	if (array.length < 2) return result;

	result.push(array[array.length - 1]);
	return result;
}

/**
 * Determines whether a string array includes a certain value (case-insensitive)
 * @param array The array to search in
 * @param searchString The search string
 * @returns True or false
 */
export function includesCaseInsensitive(array: string[], searchString: string): boolean {
	if (!Array.isArray(array)) return false;

	return array.some((element) => compareCaseInsensitive(element, searchString));
}

/**
 * Returns true if the given object is an empty array
 * @param object The object to test
 * @returns True or false
 */
export function isEmptyArray(object: any) {
	return Array.isArray(object) && object.length < 1;
}

/**
 * Returns a new array from the input with duplicates removed.
 * @param array The array to clean
 * @returns A new array without duplicate values
 */
export function removeDuplicates<T>(array: T[]) {
	return Array.from(new Set(array));
}

/**
 * Returns a new array from the input, with duplicates and empty values (null, undefined, empty string) removed.
 * @param array The array to clean
 * @returns A new array without duplicates and empty values
 */
export function removeDuplicatesAndEmpty<T>(array: T[]) {
	return removeEmpty(removeDuplicates(array));
}

/**
 * Returns a new array with empty values (null, undefined, empty string) removed.
 * @param array The array to clean
 * @returns A new array with empty values removed.
 */
export function removeEmpty<T>(array: T[]) {
	return array.filter((el) => !isEmpty(el));
}

/**
 * Returns a copy of the given array with duplicates removed. Duplicates are determined by the given property only.
 * @param array The array to remove duplicates from
 * @param accessor A function, which returns the object's property value to compare for duplicates or a string with the property name
 * @returns A new array without duplicates
 */
export function removeDuplicatesBy<T extends Object>(array: T[], accessor: string | ((element: T) => any)) {
	let unique = new Set<T>();
	const accessorFunction = (typeof accessor === "string")? (element: T) => element[accessor]: accessor;

	return array.filter((x) => {
		const value = accessorFunction(x);
		if (value === undefined) return true;
		const isNew = !unique.has(value);

		if (isNew) unique.add(value);
		return isNew;
	});
}

/**
 * Shifts the elements of an array by a specified number of positions.
 * @param arr The array to shift
 * @param by The number of positions to shift the array
 * @returns A new array with the elements shifted
 */
export function shift<T>(arr: T[], by: number) {
	if (arr.length < 1) return arr;

	if (Math.abs(by) > arr.length) by = by % arr.length;
	return arr.slice(by).concat(arr.slice(0, by));
}

/**
 * Returns a sorting function, which will sort objects based on the given property and value:
 * if one object matches the value while the other doesn't, it will be sorted to the top
 * @param key The property to sort by
 * @param value The desired value to match
 * @returns A sorting function, which can be used with Array.sort()
 * @example
 * ```ts
 * const sortingFunction = sortByValue("state", "new");
 * array.sort(sortingFunction);
 * // All objects with state "new" will be at the top of the array.
 * // The order of the other objects remains unchanged.
 * ```
 */
export function sortByValue<T>(key: keyof T, value: T[keyof T], direction: "ASC" | "DESC" = "ASC") {
	const descending = direction === "DESC";

	return (a: T, b: T) => {
		let aEqual = (a[key] == value);
		let bEqual = (b[key] == value);

		if (aEqual && !bEqual) return descending? 1: -1;
		if (!aEqual && bEqual) return descending? -1: 1;

		return 0;
	};
}

/**
 * Returns a sorting function, which will sort an array based on the given literal order.
 * If a value is not found in the order, it will be sorted to the bottom.
 *
 * @example
 * ```ts
 * const values = ["new", "in progress", "completed"];
 * const array = ["canceled", "completed", "in progress", "new"];
 * array.sort(sortByValues(values));
 * // Result: ["new", "in progress", "completed", "canceled"]
 *
 * @param values The desired order of values
 * @returns A sorting function, which can be used with Array.sort()
 */
export function sortByValues<T>(values: T[]) {
	return (a: T, b: T) => {
		let indexA = values.indexOf(a);
		let indexB = values.indexOf(b);

		if (indexA < 0) indexA = values.length;
		if (indexB < 0) indexB = values.length;

		if (indexA > indexB) return 1;
		if (indexA < indexB) return -1;
		return 0;
	};
}

/**
 * Creates a nested sorting function, which can be used with Array.sort().
 * This makes it possible to sort an array of objects by multiple properties, without having to create a custom sorting function.
 * @param functionDefinitions An array of sorting definitions. Each one is applied in the order they are given. See `SortingDefinition` for more information.
 * @returns A sorting function, which can be used with Array.sort()
 * @example
 * ```ts
 * createChainedSortingFunction([
 *  "-confidence",
 *  ["verified", true],
 *  "size"
 * ])
 * ```
 * will sort by confidence in descending order, verified objects first, and then by size in ascending order.
 */
export function createChainedSortingFunction(functionDefinitions: SortingDefinition[]): SortingFunction {
	const sortFunctions = functionDefinitions.map((f) => {
		switch (typeof f) {
			case "object":
				if (!Array.isArray(f) || f.length !== 2) throw new Error("Invalid sorting function: " + f);
				return sortByValue(f[0], f[1]);
			case "string":
				// Shorthand for descending sort order
				if (f.startsWith("-")) return getPropertySorter(f.substring(1), dynamicComparerDescending);

				return getPropertySorter(f, dynamicComparer);
			case "function":
				return f;
			default:
				throw new Error("Invalid sorting function: " + f);
		}
	});

	return (a, b) => {
		let result = 0;

		for (const f of sortFunctions) {
			result = f(a, b);
			if (result !== 0) return result;
		}

		return result;
	};
}

const getPropertySorter = (property: string, comparer: (a: any, b: any) => number) =>
	(a: Object, b: Object) => {
		const aProperty = getProperty(a, property);
		const bProperty = getProperty(b, property);

		return comparer(aProperty, bProperty);
	}

/**
 * A sorting funtion to be used with Array.sort(), which sorts numbers and strings
 * correctly, and falls back to string comparison for other types. Ascending order.
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns A number indicating the sort order, as expected by Array.sort()
 */
export const dynamicComparer = (a: any, b: any) => {
	if (isNullOrUndefined(a) && isNullOrUndefined(b)) return 0;
	if (isNullOrUndefined(a)) return 1;
	if (isNullOrUndefined(b)) return -1;

	if (typeof a === "number" && typeof b === "number") return a - b;
	if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);

	return a.toString().localeCompare(b.toString());
}

/**
 * A sorting funtion to be used with Array.sort(), which sorts numbers and strings
 * correctly, and falls back to string comparison for other types. Descending order.
 * @param a The first value to compare
 * @param b The second value to compare
 * @returns A number indicating the sort order, as expected by Array.sort()
 */
export const dynamicComparerDescending = (a: any, b: any) => {
	if (isNullOrUndefined(a) && isNullOrUndefined(b)) return 0;
	if (isNullOrUndefined(a)) return -1;
	if (isNullOrUndefined(b)) return 1;

	if (typeof a === "number" && typeof b === "number") return b - a;
	if (typeof a === "string" && typeof b === "string") return b.localeCompare(a);

	return b.toString().localeCompare(a.toString());
}

/**
 * A reducer, which merges a number of arrays into a bigger array
 * @param accumulator The accumulator array
 * @param current The current sub-array
 * @returns An array containing all values from the sub-arrays
 */
export function joinReducer<T>(accumulator: T[], current: T[]) {
	return accumulator.concat(current);
}