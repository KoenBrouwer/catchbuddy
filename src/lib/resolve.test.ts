import { describe, it, expect } from "vitest";
import { resolve, resolveSync } from "./resolve";

describe("resolve", () => {
    it("returns resolved value in tuple format", async () => {
        const promise = Promise.resolve("success");
        const [err, result] = await resolve(promise);

        expect(err).toBeUndefined();
        expect(result).toBe("success");
    });

    it("returns error in tuple format for rejected promises", async () => {
        const error = new Error("failure");
        const promise = Promise.reject(error);
        const [err, result] = await resolve(promise);

        expect(result).toBeUndefined();
        expect(err).toBe(error);
    });

    it("handles non-Error rejections correctly", async () => {
        const promise = Promise.reject("string error");
        const [err, result] = await resolve(promise);

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe(
            `An error of type "string" was thrown: string error`,
        );
    });

    it("handles asynchronous functions that throw", async () => {
        const asyncFn = async () => {
            throw new Error("Async thrown error");
        };
        const [err, result] = await resolve(asyncFn());

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe("Async thrown error");
    });

    it("handles asynchronous functions that throw with arguments", async () => {
        const asyncFn = async (arg1: number, arg2: string) => {
            throw new Error(`Thrown with ${arg1} and ${arg2}`);
        };
        const [err, result] = await resolve(asyncFn(42, "example"));

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe("Thrown with 42 and example");
    });

    it("handles promise rejections with arguments", async () => {
        const rejectFn = (arg1: number, arg2: string) =>
            new Promise((_, reject) =>
                reject(new Error(`Rejected with ${arg1} and ${arg2}`)),
            );
        const [err, result] = await resolve(rejectFn(42, "example"));

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe("Rejected with 42 and example");
    });

    it("handles asynchronous functions that resolve to undefined", async () => {
        const asyncFn = async () => undefined;
        const [err, result] = await resolve(asyncFn());

        expect(err).toBeUndefined();
        expect(result).toBeUndefined();
    });

    it("handles asynchronous functions that resolve to null", async () => {
        const asyncFn = async () => null;
        const [err, result] = await resolve(asyncFn());

        expect(err).toBeUndefined();
        expect(result).toBeNull();
    });

    it("handles asynchronous rejection with non-Error types (number, boolean, object)", async () => {
        const promise = Promise.reject(42);
        const [err, result] = await resolve(promise);

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe(`An error of type "number" was thrown: 42`);

        const booleanPromise = Promise.reject(false);
        const [errBool, resultBool] = await resolve(booleanPromise);

        expect(resultBool).toBeUndefined();
        expect(errBool).toBeInstanceOf(Error);
        expect(errBool?.message).toBe(
            `An error of type "boolean" was thrown: false`,
        );

        const objectPromise = Promise.reject({ message: "Custom error" });
        const [errObj, resultObj] = await resolve(objectPromise);

        expect(resultObj).toBeUndefined();
        expect(errObj).toBeInstanceOf(Error);
        expect(errObj?.message).toBe(
            `An error of type "object" was thrown: {\"message\":\"Custom error\"}`,
        );
    });

    it("handles asynchronous functions with delayed rejection", async () => {
        const delayedFn = () =>
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error("Delayed rejection")), 100);
            });

        const [err, result] = await resolve(delayedFn());

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe("Delayed rejection");
    });
});

describe("resolveSync", () => {
    it("returns result in tuple format when function executes successfully", () => {
        const fn = (a: number, b: number) => a + b;
        const [err, result] = resolveSync(fn, 2, 3);

        expect(err).toBeUndefined();
        expect(result).toBe(5);
    });

    it("returns error in tuple format when function throws an error", () => {
        const error = new Error("failure");
        const fn = () => {
            throw error;
        };
        const [err, result] = resolveSync(fn);

        expect(result).toBeUndefined();
        expect(err).toBe(error);
    });

    it("handles non-Error thrown values correctly", () => {
        const fn = () => {
            throw "string error";
        };
        const [err, result] = resolveSync(fn);

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe(
            'An error of type "string" was thrown: string error',
        );
    });

    it("handles synchronous functions that throw errors with arguments", () => {
        const fn = (arg1: number, arg2: string) => {
            throw new Error(`Thrown with ${arg1} and ${arg2}`);
        };
        const [err, result] = resolveSync(fn, 42, "example");

        expect(result).toBeUndefined();
        expect(err).toBeInstanceOf(Error);
        expect(err?.message).toBe("Thrown with 42 and example");
    });

    it("handles functions that return undefined", () => {
        const fn = () => undefined;
        const [err, result] = resolveSync(fn);

        expect(err).toBeUndefined();
        expect(result).toBeUndefined();
    });

    it("handles functions that return null", () => {
        const fn = () => null;
        const [err, result] = resolveSync(fn);

        expect(err).toBeUndefined();
        expect(result).toBeNull();
    });

    it("handles a function with no arguments", () => {
        const fn = () => "no args";
        const [err, result] = resolveSync(fn);

        expect(err).toBeUndefined();
        expect(result).toBe("no args");
    });

    it("handles functions with variable arguments", () => {
        const fn = (...args: number[]) => args.reduce((a, b) => a + b, 0);
        const [err, result] = resolveSync(fn, 1, 2, 3, 4, 5);

        expect(err).toBeUndefined();
        expect(result).toBe(15);
    });

    it("handles functions with object and array arguments", () => {
        const fn = (obj: { name: string }, arr: number[]) =>
            `${obj.name} - ${arr.join(", ")}`;
        const [err, result] = resolveSync(fn, { name: "Test" }, [1, 2, 3]);

        expect(err).toBeUndefined();
        expect(result).toBe("Test - 1, 2, 3");
    });

    it("handles functions that depend on their binding of this", () => {
        const obj = {
            value: 42,
            getValue() {
                return this.value;
            },
        };

        const boundFn = obj.getValue.bind(obj);
        const [err, result] = resolveSync(boundFn);

        expect(err).toBeUndefined();
        expect(result).toBe(42);
    });
});
