export type Result<TResult, TError = Error> =
    | [undefined, TResult]
    | [TError, undefined];

/**
 * Resolves a given asynchronous function, returning a result in a tuple format.
 *
 * @template T
 * @param {Promise<T>} promise - The asynchronous function to resolve.
 * @returns {Promise<Result<T>>} A promise that resolves to a tuple where the first element is the data (if resolved successfully) or `undefined`, and the second element is an error object (if the promise was rejected) or `undefined`.
 */
export async function resolve<T>(promise: Promise<T>): Promise<Result<T>> {
    try {
        const data = await promise;
        return [undefined, data];
    } catch (err) {
        return [err instanceof Error ? err : new Error(String(err)), undefined];
    }
}

/**
 * Executes a provided function with optional arguments and returns its result or any error thrown.
 *
 * @template T
 * @template Args
 * @param {(...args: Args[]) => T} fn - The function to execute.
 * @param {Args[]} args - The arguments to pass to the function.
 * @return {Result<T>} A tuple containing the result of the function execution
 *                     and any error encountered. If the function executes successfully,
 *                     the first element is the result and the second element is `undefined`.
 *                     If the function throws an error, the first element is `undefined` and
 *                     the second element is the error.
 */
export const resolveSync = <T = unknown, Args extends unknown[] = never[]>(
    fn: (...args: Args) => T,
    ...args: Args
): Result<T> => {
    try {
        const data = fn(...args);
        return [undefined, data];
    } catch (err) {
        return [err instanceof Error ? err : new Error(String(err)), undefined];
    }
};
