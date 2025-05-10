import { isEmptyArray } from "./array";
import { isEmptyObject } from "./object";


/**
 * Test if a value is empty, i.e. null, undefined, empty string, empty array or empty object
 * @param value The value to test
 * @returns True or false
 */
export function isEmpty(value: any){
	return isNullOrUndefined(value) || value === "" || isEmptyArray(value) || isEmptyObject(value);
}

/**
 * Test if a value is null or undefined
 * @param value The value to test
 * @returns True or false
 */
export function isNullOrUndefined(value: any){
	return value === null || value === undefined;
}

/**
 * Test if a value is a primitive type
 * @param value The value to test
 * @returns True or false
 */
export function isPrimitive(value: any){
	return value !== Object(value);
}