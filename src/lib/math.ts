/**
 * Clamp a number between a minimum and maximum value
 * @param number The number to clamp
 * @param min The minimum value
 * @param max The maximum value
 * @returns The clamped number
 */
export function clamp(number: number, min: number, max: number) {
	if (min > max) throw new RangeError("Minimum value must be less than or equal to the maximum value");
	if (isNaN(min)) throw new RangeError("Minimum value must be a number");
	if (isNaN(max)) throw new RangeError("Maximum value must be a number");

	return Math.max(min, Math.min(number, max));
}

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