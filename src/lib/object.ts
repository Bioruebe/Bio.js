import { isEmptyArray } from "./array";
import { isEmpty } from "./value";


/**
 * Gets a property value of an object. This function supports nested properties via dot notation, e.g. `date.last_changed`.
 * @param obj The object to get the property from
 * @param property The name of the property to get
 * @returns The property value or null if the property does not exist
 */
export function getProperty(obj: Record<string, any>, property: string) {
	if (!obj || !property || property.length == 0) return null;

	const nestedProperties = property.split(".");
	if (nestedProperties.length < 2) return obj[property] ?? null;

	// Make sure the property does not contain a dot, before recursing
	if (obj.hasOwnProperty(property)) return obj[property];

	const first = nestedProperties.shift()!;
	return _getProperty(obj[first], nestedProperties);
}

/**
 * Test if an object has any of the given properties. Nesting is supported, e.g. `date.last_changed`.
 * @param obj The object to test
 * @param properties An array of property names to test.
 * @returns True or false
 */
export function hasAnyProperty(obj: Record<string, any>, properties: string[]) {
	if (!obj || !Array.isArray(properties)) return false;

	for (const prop of properties) {
		if (hasProperty(obj, prop)) return true;
	}

	return false;
}

/**
 * Test if an object has a given property. The property must be defined, not null and not empty.
 * Nesting is supported, e.g. `date.last_changed`.
 * @param obj The object to test
 * @param property The property name to test
 * @returns True or false
 */
export function hasProperty(obj: Record<string, any>, property: string): boolean {
	const value = getProperty(obj, property);
	return !isEmpty(value);
}

/**
 * Test if an object has at least one valid property, e.g. to exclude objects with only null values.
 * Valid properties are defined, not null and not empty.
 * @param obj The object to test
 * @returns True or false
 */
export function hasValidProperty(obj: Record<string, any>) {
	if (!obj) return false;
	return Object.values(obj).some((v) => !isEmpty(v));
}

/**
 * Returns true if the given value is an empty object
 * @param value The value to test
 * @returns True or false
 */
export function isEmptyObject(value: any) {
	if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
	return !Object.keys(value).length;
}

/**
 * Test if an object property is equal to the given value. Nesting is supported, e.g. `date.last_changed`.
 * If value is an array, this function will return true if *any* of the array items matches.
 * @param obj The object to test
 * @param property The property name to test
 * @param value The value to test against
 * @returns True or false
 */
export function propertyIs(obj: Record<string, any>, property: string, value: any) {
	const objectValue = getProperty(obj, property);
	if (!Array.isArray(value)) {
		value = [value];
	}
	else if (value.length == 0) {
		return isEmptyArray(objectValue);
	}

	for (const alternative of value) {
		if (objectValue === alternative) return true;
	}

	return false;
}

/**
 * Remove the specified properties from the given object. Modifies the object in place.
 * @param obj The object to remove the properties from
 * @param properties The properties to remove
 * @returns The object without the specified properties
 */
export function removeProperties(obj: Record<string, any>, properties: string[]) {
	if (!obj) return obj;
	if (typeof obj !== "object") throw new Error("The given value is not an object");

	for (const property of properties) {
		delete obj[property];
	}

	return obj;
}


/* Internal helper function to keep the main function's typing clean */
function _getProperty(obj: Record<string, any>, property: string[]): any {
	if (!property || property.length == 0) return obj ?? null;

	if (!obj || typeof obj !== "object") return null;

	// In case the property contains dots, we need to join them again
	const joined = property.join(".");
	if (obj.hasOwnProperty(joined)) return obj[joined];

	const first = property.shift()!;
	return _getProperty(obj[first], property);
}