import { describe, expect, test } from "vitest";
import { sleep } from "./promise";


describe("sleep", () => {
	test("should return a promise", async () => {
		expect(sleep(1)).toBeInstanceOf(Promise);
	});
});