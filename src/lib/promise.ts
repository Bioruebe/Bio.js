/**
 * Wait for a given time
 * @param ms The time to wait in milliseconds
 * @returns A promise that resolves after the given time
 */
export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}