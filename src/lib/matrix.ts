/**
 * Add a column to a 2D array and return as a new array. If the index is negative, the column will be inserted from the end of the array.
 * @param array The array to add the column to
 * @param index The index to add the column at. If negative, the index will be counted from the end of the array.
 * @param value The value(s) to add to the column. If an array is given, the values will be added to the row at the corresponding index. If a single value is given, the same value will be used for each row. Optional.
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

/**
 * Move a column in a 2D array to a new index and return as a new array. If the index is negative, the column will be moved from the end of the array.
 * @param array The array to move the column in
 * @param index The index of the column to move. If negative, the index will be counted from the end of the array.
 * @param to The index to move the column to. If negative, the index will be counted from the end of the array.
 * @returns A new array with the column moved
 */
export function moveColumn<T>(array: T[][], index: number, to: number) {
	if (array.length < 1) throw new RangeError("Array must have at least one row");
	if (index === to) return array;

	const absoluteFrom = Math.abs(index);
	const absoluteTo = Math.abs(to);
	return array.map((row, i) => {
		if (absoluteFrom >= row.length) throw new RangeError(`Index out of range for row ${i}`);
		if (absoluteTo >= row.length) throw new RangeError(`To index out of range for row ${i}`);

		const indexFrom = index < 0? row.length + index: index;
		const indexTo = to < 0? row.length + to: to;

		const newRow = [...row];
		const [removedColumn] = newRow.splice(indexFrom, 1);
		newRow.splice(indexTo, 0, removedColumn);
		return newRow;
	});
}