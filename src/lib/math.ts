/**
 * Round a float to the given amount of decimals
 * @param number The number to round
 * @param digits The amount of digits to round to
 * @returns The rounded number
 */
export function roundFloat(number: number, digits = 2) {
	if (digits < 0 || !Number.isInteger(digits)) throw new RangeError("Digits must be a positive integer");

	return Number(number.toFixed(digits));
}
