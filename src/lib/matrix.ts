/**
 * Add a row to a 2D array and return as a new array. If the index is negative, the row will be inserted from the end of the array.
 * @param array The array to add the column to
 * @param index The index to add the column at. If negative, the index will be counted from the end of the array.
 * @param value The value to add to the column. If an array is given, the values will be added to the column at the corresponding index. If a single value is given, the same value will be added to each row. Optional.
 * @returns A new array with the column added
 */
export function addColumn<T>(array: T[][], index: number, value?: T | T[]) {
	const absoluteIndex = Math.abs(index);
	return array.map((row, i) => {
		if (absoluteIndex > row.length) throw new RangeError(`Index out of range for row ${i}`);

		const rowValue = Array.isArray(value)? value[i]: value;
		return [...row.slice(0, index), rowValue, ...row.slice(index)];
	}) as T[][];
}

/**
 * Remove a column from a 2D array and return as a new array. If the index is negative, the column will be removed from the end of the array.
 * @param array The array to remove the column from
 * @param index The index of the column to remove. If negative, the index will be counted from the end of the array.
 * @returns A new array with the column removed
 */
export function removeColumn<T>(array: T[][], index: number) {
	if (array.length < 1) throw new RangeError("Array must have at least one row");

	const absoluteIndex = Math.abs(index);
	return array.map((row, i) => {
		if (absoluteIndex >= row.length) throw new RangeError(`Index out of range for row ${i}`);

		const indexToRemove = index < 0? row.length + index: index;
		return row.filter((_, i) => i !== indexToRemove);
	});
}