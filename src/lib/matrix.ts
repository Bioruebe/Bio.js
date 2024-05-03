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

/**
 * Move a cell to a new position in a 2D array and return as a new array. If the index is negative, the cell will be moved from the end of the array.
 * If the new position is outside the bounds of the array, the array will be resized to fit the new position.
 * @param array The array to move the cell in
 * @param fromRow The row index of the cell to move. If negative, the index will be counted from the end of the array.
 * @param fromColumn The column index of the cell to move. If negative, the index will be counted from the end of the array.
 * @param toRow The row index to move the cell to. If negative, the index will be counted from the end of the array.
 * @param toColumn The column index to move the cell to. If negative, the index will be counted from the end of the array.
 */
export function moveCell<T>(array: T[][], fromRow: number, fromColumn: number, toRow: number, toColumn: number, defaultValue?: T) {
	const absoluteFromRow = Math.abs(fromRow);
	const absoluteFromColumn = Math.abs(fromColumn);
	if (absoluteFromRow >= array.length) throw new RangeError(`From row index out of range`);
	if (absoluteFromColumn >= array[absoluteFromRow].length) throw new RangeError(`From column index out of range`);

	const fromRowIndex = fromRow < 0? array.length + fromRow: fromRow;
	const fromColumnIndex = fromColumn < 0? array[fromRowIndex].length + fromColumn: fromColumn;
	const toRowIndex = toRow < 0? array.length + toRow: toRow;
	const toColumnIndex = toColumn < 0? array[toRowIndex].length + toColumn: toColumn;

	const cell = array[fromRowIndex][fromColumnIndex];
	const newArray = array.map((row, i) => {
		if (i === fromRowIndex) return row.filter((_, j) => j !== fromColumnIndex);
		return row;
	});

	// Add empty rows if neccessary
	while (toRowIndex >= newArray.length) {
		newArray.push([]);
	}

	// Add empty columns if neccessary
	if (toColumnIndex > newArray[toRowIndex].length) {
		const cells = toColumnIndex - newArray[toRowIndex].length + 1;
		newArray[toRowIndex].push(...Array.from({ length: cells }, () => defaultValue as T));
		newArray[toRowIndex][toColumnIndex] = cell;
	}
	else {
		// Insert the cell at the new position
		newArray[toRowIndex].splice(toColumnIndex, 0, cell);
	}

	return newArray;
}

/**
 * Ensure that every row in a 2D array has the same length by filling empty cells with a default value. Returns a new array.
 * @param array The array to make rectangular
 * @param defaultValue The value to fill empty cells with
 * @returns A new rectangular array
 */
export function toRectangular<T>(array: T[][], defaultValue?: T) {
	const maxColumns = Math.max(...array.map((row) => row.length));
	return array.map((row) => {
		const cells = maxColumns - row.length;
		return [...row, ...Array.from({ length: cells }, () => defaultValue as T)];
	});
}

/**
 * Ensure that a 2D array has the same number of rows and columns by filling empty cells with a default value. Returns a new array.
 * @param array The array to make square
 * @param defaultValue The value to fill empty cells with
 * @returns A new square array
 */
export function toSquare<T>(array: T[][], defaultValue?: T) {
	if (array.length < 1) return array;

	const rectangular = toRectangular(array, defaultValue);

	const columns = rectangular[0].length;
	const missingRows = columns - rectangular.length;
	if (missingRows > 0) {
		const cells = Array.from({ length: missingRows }, () => Array.from({ length: columns }, () => defaultValue as T));
		rectangular.push(...cells);
	}

	return rectangular;
}