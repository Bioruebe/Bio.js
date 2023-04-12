import { isNullOrUndefined } from "./value";

/**
 * Capitalize the first letter of a string
 * @param str The string to capitalize
 * @returns The capitalized string
 */
export function capitalize(str: string) {
	if (!str) return str;

	return str.charAt(0).toUpperCase() + str.substring(1);
}

/**
 * Compare two strings ignoring case
 * @param a The first string
 * @param b The second string
 * @returns True if the strings are equal, otherwise false
 */
export function compareCaseInsensitive(a: string, b: string): boolean {
	if (typeof a !== "string" || typeof b !== "string") return a == b;

	return a.toLowerCase() == b.toLowerCase();
}

/**
 * Check if a string contains at least one uppercase character
 * @param str The string to check
 * @returns True if the string contains at least one uppercase character, otherwise false
 */
export function hasUpperCase(str: string): boolean {
	for (let i = 0; i < str.length; i++) {
		if (isUpperCase(str.charAt(i))) return true;
	}

	return false;
}

/**
 * Check if a string is all uppercase
 * @param str The string to check
 * @returns True if the string is all uppercase, otherwise false
 */
export function isUpperCase(str: string): boolean {
	return str === str.toUpperCase() && str !== str.toLowerCase();
}

/**
 * Returns the last string between two substrings. If start or end is not found, an empty string is returned.
 * @param str The string to search in
 * @param start The start string to search for
 * @param end The end string to search for
 * @returns The last string between start and end
 */
export function lastStringBetween(str: string, start: string, end: string) {
	let startPos = -1;
	let endPos = -1;
	
	if (start == end) {
		endPos = str.lastIndexOf(end);
		if (endPos < 0) return "";

		startPos = str.lastIndexOf(start, endPos - end.length);
		if (startPos < 0) return "";
		startPos += start.length;
	}
	else {
		startPos = str.lastIndexOf(start);
		if (startPos < 0) return "";

		startPos += start.length;
		endPos = str.indexOf(end, startPos);
		if (endPos < 0) return "";
	}

	return str.substring(startPos, endPos);
}

/**
 * Replace newlines with <br> HTML tag
 * @param text The text to replace newlines in
 * @returns The text with newlines replaced
 */
export function nl2br(text: string) {
	if (isNullOrUndefined(text)) return text;
	if (typeof text !== "string") text = `${text}`;

	return text.replace(/(\r\n|\n|\\n|\r)/gm, "<br>");
}

/**
 * Returns the string between two substrings. If start or end is not found, an empty string is returned.
 * If multiple start ot end strings are found, the first one is used.
 * @param str The string to search in
 * @param start The start string to search for
 * @param end The end string to search for
 * @returns The string between start and end
 */
export function stringBetween(str: string, start: string, end: string) {
	if (!str) return "";

	let startPos = str.indexOf(start);
	if (startPos < 0) return "";
	startPos += start.length;

	let endPos = str.indexOf(end, startPos);
	if (endPos < 0) return "";

	return str.substring(startPos, endPos);
}

/**
 * Transforms 'true' and 'false' strings to their boolean equivalent.
 * Comparision is case-insensitive. Any other values are mapped to undefined.
 * @param string The string to transform
 * @returns A boolean or undefined
 */
export function toBoolean(string: string) {
	if (typeof string !== "string") return undefined;

	string = string.toLocaleLowerCase();
	if (string === "true") return true;
	if (string === "false") return false;

	return undefined;
}