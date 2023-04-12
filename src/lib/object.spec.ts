import { describe, expect, test } from "vitest";
import { getProperty, hasAnyProperty, hasProperty, hasValidProperty, isEmptyObject, propertyIs, removeProperties } from "./object";


describe("getProperty", () => {
	const obj = { name: "John", age: 30 };
	test("should return null when property is empty", () => {
		const result = getProperty(obj, "");
		expect(result).toBeNull();
	});

	test("should return null when property does not exist", () => {
		expect(getProperty(obj, "address")).toBeNull();
		expect(getProperty(obj, "address.street")).toBeNull();
		expect(getProperty({ address: {} }, "address.street")).toBeNull();
	});

	test("should return property value when property exists", () => {
		const result = getProperty(obj, "age");
		expect(result).toEqual(30);
	});

	test("should return nested property value when property exists", () => {
		const result = getProperty(
			{ name: "John", address: { street: "123 Main St", city: "New York" } },
			"address.street"
		);
		expect(result).toEqual("123 Main St");
	});

	test("should return null when nested property does not exist", () => {
		const result = getProperty({ name: "John", address: { city: "New York" } }, "address.street");
		expect(result).toBeNull();
	});

	test("should return null when obj is not an object", () => {
		expect(getProperty(null as any, "name")).toBeNull();
		expect(getProperty(undefined as any, "name")).toBeNull();
		expect(getProperty("John" as any, "name")).toBeNull();
		expect(getProperty(123 as any, "name")).toBeNull();
		expect(getProperty(true as any, "name")).toBeNull();
	});

	test("should return property value when property contains a dot", () => {
		const result = getProperty({ "full.name": "John Smith" }, "full.name");
		expect(result).toEqual("John Smith");
	});

	test("should return property value when property contains square brackets", () => {
		const result = getProperty({ "user[email]": "john@example.com" }, "user[email]");
		expect(result).toEqual("john@example.com");
	});

	test("should return nested property value when nested property contains a dot", () => {
		const result = getProperty(
			{ name: "John", address: { "street.name": "123 Main St", "city": "New York" } },
			"address.street.name"
		);
		expect(result).toEqual("123 Main St");
	});
});

describe("hasAnyProperty", () => {
	test("should return true if object has any of the given properties", () => {
		const obj = { name: "John", age: 30 };
		expect(hasAnyProperty(obj, ["name"])).toBe(true);
		expect(hasAnyProperty(obj, ["age"])).toBe(true);
		expect(hasAnyProperty(obj, ["name", "age"])).toBe(true);
	});

	test("should return false if object does not have any of the given properties", () => {
		const obj = { name: "John", age: 30 };
		expect(hasAnyProperty(obj, ["email"])).toBe(false);
		expect(hasAnyProperty(obj, ["address"])).toBe(false);
		expect(hasAnyProperty(obj, ["email", "address"])).toBe(false);
	});

	test("should handle nested properties", () => {
		const obj = {
			user: {
				name: "John",
				age: 30,
				address: {
					city: "New York"
				}
			}
		};
		expect(hasAnyProperty(obj, ["user"])).toBe(true);
		expect(hasAnyProperty(obj, ["user.name"])).toBe(true);
		expect(hasAnyProperty(obj, ["user.age"])).toBe(true);
		expect(hasAnyProperty(obj, ["user.address"])).toBe(true);
		expect(hasAnyProperty(obj, ["user.address.city"])).toBe(true);
	});

	test("should return false if object is null or undefined", () => {
		const result = hasAnyProperty(null as any, ["a"]);

		expect(result).toBe(false);
	});

	test("should return false if properties array is empty", () => {
		const result = hasAnyProperty({ a: 1 }, []);

		expect(result).toBe(false);
	});

	test("should return false if properties array is null or undefined", () => {
		const result = hasAnyProperty({ a: 1 }, null as any);

		expect(result).toBe(false);
	});

	test("should return false if properties array contains empty strings", () => {
		const result = hasAnyProperty({ a: 1 }, ["", ""]);

		expect(result).toBe(false);
	});

	test("should return false if properties array contains null or undefined", () => {
		const result = hasAnyProperty({ a: 1 }, [null as any, undefined as any]);

		expect(result).toBe(false);
	});
});

describe("hasProperty", () => {
	test("should return true when property exists and is not null or empty", () => {
		const obj = { name: "John Doe" };
		expect(hasProperty(obj, "name")).toBe(true);
	});

	test("should return false when property does not exist", () => {
		const obj = { name: "John Doe" };
		expect(hasProperty(obj, "age")).toBe(false);
	});

	test("should return false when property exists but is null", () => {
		const obj = { name: null };
		expect(hasProperty(obj, "name")).toBe(false);
	});

	test("should return false when property exists but is empty", () => {
		const obj = { name: "" };
		expect(hasProperty(obj, "name")).toBe(false);
	});

	test("should return true when nested property exists and is not null or empty", () => {
		const obj = { person: { name: "John Doe" } };
		expect(hasProperty(obj, "person.name")).toBe(true);
	});

	test("should return false when nested property does not exist", () => {
		const obj = { person: { name: "John Doe" } };
		expect(hasProperty(obj, "person.age")).toBe(false);
	});

	test("should return false when nested property exists but is null", () => {
		const obj = { person: { name: null } };
		expect(hasProperty(obj, "person.name")).toBe(false);
	});

	test("should return false when nested property exists but is empty", () => {
		const obj = { person: { name: "" } };
		expect(hasProperty(obj, "person.name")).toBe(false);
	});
});

describe("hasValidProperty", () => {
	test("should return false for null", () => {
		expect(hasValidProperty(null as any)).toBe(false);
	});

	test("should return false for undefined", () => {
		expect(hasValidProperty(undefined as any)).toBe(false);
	});

	test("should return false for empty object", () => {
		expect(hasValidProperty({})).toBe(false);
	});

	test("should return false for object with null properties only", () => {
		expect(hasValidProperty({ a: null, b: null })).toBe(false);
	});

	test("should return false for object with undefined properties only", () => {
		expect(hasValidProperty({ a: undefined, b: undefined })).toBe(false);
	});

	test("should return false for object with empty string properties only", () => {
		expect(hasValidProperty({ a: "", b: "" })).toBe(false);
	});

	test("should return true for object with one valid property", () => {
		expect(hasValidProperty({ a: null, b: "", c: 0, d: false, e: "valid" })).toBe(true);
	});

	test("should return true for object with multiple valid properties", () => {
		expect(hasValidProperty({ a: null, b: "", c: 0, d: false, e: "valid", f: 1 })).toBe(true);
	});
});

describe("isEmptyObject", () => {
	test("should return true if the value is an empty object", () => {
		expect(isEmptyObject({})).toBe(true);
	});

	test("should return false if the value is null", () => {
		expect(isEmptyObject(null)).toBe(false);
	});

	test("should return false if the value is undefined", () => {
		expect(isEmptyObject(undefined)).toBe(false);
	});

	test("should return false if the value is not an object", () => {
		expect(isEmptyObject(123)).toBe(false);
		expect(isEmptyObject("")).toBe(false);
		expect(isEmptyObject(true)).toBe(false);
	});

	test("should return false if the value is an array", () => {
		expect(isEmptyObject([])).toBe(false);
	});

	test("should return false if the value is an object with properties", () => {
		expect(isEmptyObject({ foo: "bar" })).toBe(false);
		expect(isEmptyObject({ a: 1, b: 2 })).toBe(false);
	});

	test("should return false if the value is a function", () => {
		expect(isEmptyObject(() => {})).toBe(false);
	});
});

describe("propertyIs", () => {
	test("should return true if property value matches the given value", () => {
		const obj = {
			name: "John",
			age: 30
		};
		expect(propertyIs(obj, "name", "John")).toBe(true);
		expect(propertyIs(obj, "age", 30)).toBe(true);
	});

	test("should return true if nested property value matches the given value", () => {
		const obj = {
			address: {
				city: "New York",
				country: "USA"
			}
		};
		expect(propertyIs(obj, "address.city", "New York")).toBe(true);
		expect(propertyIs(obj, "address.country", "USA")).toBe(true);
	});

	test("should return true if property value matches any of the values in the array", () => {
		const obj = {
			name: "John",
			age: 30
		};
		expect(propertyIs(obj, "name", ["John", "Jane"])).toBe(true);
		expect(propertyIs(obj, "age", [20, 30, 40])).toBe(true);
	});

	test("should return false if property value does not match the given value or any of the values in the array", () => {
		const obj = {
			name: "John",
			age: 30
		};
		expect(propertyIs(obj, "name", "Jane")).toBe(false);
		expect(propertyIs(obj, "age", [20, 40])).toBe(false);
	});

	test("should return false if property does not exist in the object", () => {
		const obj = {
			name: "John",
			age: 30
		};
		expect(propertyIs(obj, "address", "New York")).toBe(false);
	});

	test("should return false if object is null or undefined", () => {
		expect(propertyIs(null as any, "name", "John")).toBe(false);
		expect(propertyIs(undefined as any, "name", "John")).toBe(false);
	});

	test("should return true if the value is an empty array and the property value is also an empty array", () => {
		const obj = {
			emptyArray: []
		};
		expect(propertyIs(obj, "emptyArray", [])).toBe(true);
	});

	test("should return false if the value is an empty array and the property value is not an empty array", () => {
		const obj = {
			nonEmptyArray: [1, 2, 3]
		};
		expect(propertyIs(obj, "nonEmptyArray", [])).toBe(false);
	});

	test("should handle a property with a numeric name", () => {
		const obj = {
			1: "one",
			2: "two"
		};
		expect(propertyIs(obj, "1", "one")).toBe(true);
		expect(propertyIs(obj, "2", "two")).toBe(true);
	});

	test("should handle a property with a special character in the name", () => {
		const obj = {
			"property.with.dots": "value",
			"property_with_underscores": "value",
			"property-with-dashes": "value"
		};
		expect(propertyIs(obj, "property.with.dots", "value")).toBe(true);
		expect(propertyIs(obj, "property_with_underscores", "value")).toBe(true);
		expect(propertyIs(obj, "property-with-dashes", "value")).toBe(true);
	});
});

describe("removeProperties", () => {
	test("should remove specified properties from the object", () => {
		const obj = { name: "Alice", age: 30 };
		removeProperties(obj, ["age"]);
		expect(obj).toEqual({ name: "Alice" });
	});

	test("should modify the object in place", () => {
		const obj = { name: "Bob", age: 25 };
		const result = removeProperties(obj, ["age"]);
		expect(result).toBe(obj);
	});

	test("should return the same object if no properties are specified", () => {
		const obj = { name: "David", age: 35 };
		const result = removeProperties(obj, []);
		expect(result).toBe(obj);
	});

	test("should not throw an error if the object is null or undefined", () => {
		expect(() => removeProperties(null as any, ["name"])).not.toThrow();
		expect(() => removeProperties(undefined as any, ["name"])).not.toThrow();
	});

	test("should not throw an error if the object does not have the specified property", () => {
		const obj = { name: "Eva", age: 40 };
		expect(() => removeProperties(obj, ["foo"])).not.toThrow();
		expect(obj).toEqual({ name: "Eva", age: 40 });
	});

	test("should handle removing properties from an empty object", () => {
		const obj = {};
		const result = removeProperties(obj, ["foo", "bar"]);
		expect(result).toEqual({});
	});

	test("should throw an error if the object is not an object", () => {
		expect(() => removeProperties(123 as any, ["name"])).toThrow();
		expect(() => removeProperties("foo" as any, ["name"])).toThrow();
		expect(() => removeProperties(true as any, ["name"])).toThrow();
	});
});