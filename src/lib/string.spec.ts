import { describe, expect, test } from "vitest";
import { capitalize, compareCaseInsensitive, extractNumbers, hasUpperCase, isUpperCase, lastStringBetween, nl2br, stringBetween, toBoolean, wordCount } from "./string";


const UPPER = "TEST";
const LOWER = "test";
const MIXED = "TeSt";
const OTHER = "Best";
const LOREM_IPSUM = "Lorem ipsum dolor sit amet";
const LOREM_IPSUM_REPETITION = "Lorem ipsum dolor sit ipsum dolor amet";

describe("capitalize", () => {
	test("should return an empty string when given an empty string", () => {
		expect(capitalize("")).toBe("");
	});

	test("should capitalize a single character", () => {
		expect(capitalize("a")).toBe("A");
	});

	test("should capitalize the first letter of multiple characters", () => {
		expect(capitalize(LOWER)).toBe("Test");
	});

	test("should not change the string if already capitalized", () => {
		expect(capitalize(UPPER)).toBe("TEST");
	});

	test("should capitalize the first letter of mixed case strings", () => {
		expect(capitalize("tEsT")).toBe("TEsT");
	});

	test("should capitalize the first letter of a multi-word string", () => {
		expect(capitalize("test test")).toBe("Test test");
	});
});

describe("compareCaseInsensitive", () => {
	test("should handle null values", () => {
		expect(compareCaseInsensitive(null as any, null as any)).toBe(true);
		expect(compareCaseInsensitive(null as any, "")).toBe(false);
	});

	test("should handle empty strings", () => {
		expect(compareCaseInsensitive("", "")).toBe(true);
		expect(compareCaseInsensitive("", LOWER)).toBe(false);
	});

	test("should return true for equal strings", () => {
		expect(compareCaseInsensitive(UPPER, LOWER)).toBe(true);
		expect(compareCaseInsensitive(LOWER, MIXED)).toBe(true);
		expect(compareCaseInsensitive(MIXED, UPPER)).toBe(true);
		expect(compareCaseInsensitive(UPPER, UPPER)).toBe(true);
	});

	test("should return false for non-equal strings", () => {
		expect(compareCaseInsensitive(UPPER, OTHER)).toBe(false);
		expect(compareCaseInsensitive(LOWER, OTHER)).toBe(false);
		expect(compareCaseInsensitive(MIXED, OTHER)).toBe(false);
	});
});

describe("extractNumbers", () => {
	test("should return an empty array for an empty string", () => {
		expect(extractNumbers("")).toEqual([]);
	});

	test("should return an empty array for a string without numbers", () => {
		expect(extractNumbers(LOWER)).toEqual([]);
	});

	test("should extract integers", () => {
		expect(extractNumbers("test 123 test")).toEqual([123]);
	});

	test("should extract negative integers", () => {
		expect(extractNumbers("test -123 test")).toEqual([-123]);
	});

	test("should extract floating point numbers", () => {
		expect(extractNumbers("test 1.23 test")).toEqual([1.23]);
	});

	test("should extract negative floating point numbers", () => {
		expect(extractNumbers("test -1.23 test")).toEqual([-1.23]);
	});

	test("should extract multiple numbers", () => {
		expect(extractNumbers("test 123 test 456")).toEqual([123, 456]);
		expect(extractNumbers("test -123 test 456")).toEqual([-123, 456]);
		expect(extractNumbers("test 1.23 test 4.56")).toEqual([1.23, 4.56]);
		expect(extractNumbers("test -1.23 test 4.56")).toEqual([-1.23, 4.56]);
	});

	test("should handle non-string values", () => {
		expect(extractNumbers(null as any)).toEqual([]);
		expect(extractNumbers(undefined as any)).toEqual([]);
		expect(extractNumbers(123 as any)).toEqual([123]);
		expect(extractNumbers(true as any)).toEqual([]);
		expect(extractNumbers(false as any)).toEqual([]);
	});

	test("should handle strings with only numbers", () => {
		expect(extractNumbers("123")).toEqual([123]);
		expect(extractNumbers("-123")).toEqual([-123]);
		expect(extractNumbers("1.23")).toEqual([1.23]);
		expect(extractNumbers("-1.23")).toEqual([-1.23]);
	});
});

describe("hasUpperCase", () => {
	test("should detect upper case", () => {
		expect(hasUpperCase(UPPER)).toBe(true);
	});

	test("should not detect lower case", () => {
		expect(hasUpperCase(LOWER)).toBe(false);
	});

	test("should detect mixed case", () => {
		expect(hasUpperCase(MIXED)).toBe(true);
	});
});

describe("isUpperCase", () => {
	test("should return true for uppercase strings", () => {
		expect(isUpperCase(UPPER)).toBe(true);
	});

	test("should return false for lowercase strings", () => {
		expect(isUpperCase(LOWER)).toBe(false);
	});

	test("should return false for mixed case strings", () => {
		expect(isUpperCase(MIXED)).toBe(false);
	});
});

describe("lastStringBetween", () => {
	test("should return empty string for empty input", () => {
		expect(lastStringBetween("", "", "")).toBe("");
	});

	test("should return empty string if start string not found", () => {
		expect(lastStringBetween("test", "a", "t")).toBe("");
	});

	test("should return empty string if end string not found", () => {
		expect(lastStringBetween("test", "t", "a")).toBe("");
	});

	test("should return empty string if start and end strings not present", () => {
		expect(lastStringBetween("test", "foo", "bar")).toBe("");
	});

	test("should handle equal start and end string", () => {
		expect(lastStringBetween("test", "t", "t")).toBe("es");
		expect(lastStringBetween("test", "e", "e")).toBe("");
		expect(lastStringBetween("test", "r", "r")).toBe("");
	});

	test("should return last string between start and end strings in a sentence", () => {
		expect(lastStringBetween(LOREM_IPSUM, "dolor", "amet")).toBe(" sit ");
	});

	test("should return last string between start and end strings with multiple search strings", () => {
		expect(lastStringBetween(LOREM_IPSUM_REPETITION, "Lorem", "dolor")).toBe(" ipsum ");
	});
});

describe("nl2br", () => {
	test("should return empty string for empty input", () => {
		expect(nl2br("")).toBe("");
	});

	test("should return input as it is for single line string", () => {
		expect(nl2br(LOWER)).toBe(LOWER);
	});

	test("should convert new lines to <br>", () => {
		expect(nl2br("test\nline")).toBe("test<br>line");
		expect(nl2br("test\n\n\nline\nline")).toBe("test<br><br><br>line<br>line");
	});

	test("should handle non-string values", () => {
		expect(nl2br(null as any)).toBeNull();
		expect(nl2br(undefined as any)).toBeUndefined();
		expect(nl2br(0 as any)).toBe("0");
		expect(nl2br(1 as any)).toBe("1");
		expect(nl2br(true as any)).toBe("true");
	});
});

describe("stringBetween", () => {
	test("should return empty string when input is empty", () => {
		expect(stringBetween("", "", "")).toBe("");
	});

	test("should return empty string when start string not found", () => {
		expect(stringBetween("test", "a", "t")).toBe("");
	});

	test("should return empty string when end string not found", () => {
		expect(stringBetween("test", "t", "a")).toBe("");
	});

	test("should return empty string when start and end string not present", () => {
		expect(stringBetween("test", "foo", "bar")).toBe("");
	});

	test("should return substring between start and end strings when they are the same", () => {
		expect(stringBetween("test", "t", "t")).toBe("es");
		expect(stringBetween("test", "e", "e")).toBe("");
		expect(stringBetween("test", "r", "r")).toBe("");
	});

	test("should return substring between start and end strings in a sentence", () => {
		expect(stringBetween(LOREM_IPSUM, "dolor", "amet")).toBe(" sit ");
	});

	test("should return substring between start and end strings when there are multiple end strings", () => {
		expect(stringBetween(LOREM_IPSUM_REPETITION, "Lorem", "dolor")).toBe(" ipsum ");
	});

	test("should return substring between start and end strings when there are multiple occurrences of start and end strings", () => {
		expect(stringBetween(LOREM_IPSUM_REPETITION, "dolor", "amet")).toBe(" sit ipsum dolor ");
	});

	test("should return empty string when start and end strings overlap", () => {
		expect(stringBetween(LOREM_IPSUM_REPETITION, "ipsum", "dolor")).toBe(" ");
	});
});

describe("toBoolean", () => {
	test("should convert truthy values to true", () => {
		expect(toBoolean("true")).toBe(true);
		expect(toBoolean("True")).toBe(true);
		expect(toBoolean("TRUE")).toBe(true);
	});

	test("should convert falsy values to false", () => {
		expect(toBoolean("false")).toBe(false);
		expect(toBoolean("False")).toBe(false);
		expect(toBoolean("FALSE")).toBe(false);
	});

	test("should return undefined for invalid values", () => {
		expect(toBoolean("test")).toBeUndefined();
		expect(toBoolean("")).toBeUndefined();
		expect(toBoolean(" ")).toBeUndefined();
	});

	test("should return undefined for non-string values", () => {
		expect(toBoolean(null as any)).toBeUndefined();
		expect(toBoolean(undefined as any)).toBeUndefined();
		expect(toBoolean(1 as any)).toBeUndefined();
		expect(toBoolean({} as any)).toBeUndefined();
		expect(toBoolean([] as any)).toBeUndefined();
	});
});

describe("wordCount", () => {
	test("should return 0 for empty string", () => {
		expect(wordCount("")).toBe(0);
	});

	test("should return 0 for string with only spaces", () => {
		expect(wordCount("   ")).toBe(0);
	});

	test("should return 0 for only punctuation", () => {
		expect(wordCount(".,;")).toBe(0);
	});

	test("should return 0 for only new lines", () => {
		expect(wordCount("\n\n\n")).toBe(0);
	});

	test("should return 0 for non-printable characters", () => {
		expect(wordCount("\x00\x01\x02")).toBe(0);
	});

	test("should return 0 for emoji", () => {
		expect(wordCount("👍👎")).toBe(0);
	});

	test("should return 1 for single word", () => {
		expect(wordCount("test")).toBe(1);
	});

	test("should return correct count for multiple words", () => {
		expect(wordCount("Lorem ipsum dolor sit amet")).toBe(5);
	});

	test("should return correct count for Chinese characters", () => {
		expect(wordCount("你好世界")).toBe(4);
	});

	test("should return correct count for Japanese characters", () => {
		expect(wordCount("こんにちは世界")).toBe(7);
	});

	test("should return correct count for Korean characters", () => {
		expect(wordCount("안녕하세요 세계")).toBe(7);
	});

	test("should return correct count for mixed characters", () => {
		expect(wordCount("Hello, 你好!")).toBe(3);
	});
});