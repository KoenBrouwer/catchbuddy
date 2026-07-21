export type Result<TResult, TError = Error> =
    | [TError, undefined]
    | [undefined, TResult];

/**
 * Normalizes an unknown thrown value into an `Error` instance.
 *
 * If the value is already an `Error`, it is returned as-is. Otherwise a
 * descriptive `Error` is created that includes the value's type and a string
 * representation of it.
 *
 * @param {unknown} err - The thrown value to normalize.
 * @returns {Error} An `Error` describing the thrown value.
 */
function normalizeError(err: unknown): Error {
    if (err instanceof Error) {
        return err;
    }

    // Create a more descriptive error for non-Error objects
    const errorType = err === null ? "null" : typeof err;
    let errorMessage = String(err);
    if (errorType === "object") {
        try {
            errorMessage = JSON.stringify(err);
        } catch {
            // Fall back to String(err) for circular or otherwise
            // non-serializable objects.
            errorMessage = String(err);
        }
    }
    return new Error(
        `An error of type "${errorType}" was thrown: ${errorMessage}`,
    );
}

/**
 * Resolves a given asynchronous function, returning a result in a tuple format.
 *
 * @template T
 * @param {Promise<T>} promise - The promise to resolve.
 * @returns {Promise<Result<T>>} A promise that resolves to a tuple where the first element is an error object (if the promise was rejected) or `undefined`, and the second element is the data (if resolved successfully) or `undefined`.
 */
export async function resolve<T>(promise: Promise<T>): Promise<Result<T>> {
    try {
        const data = await promise;
        return [undefined, data];
    } catch (err) {
        return [normalizeError(err), undefined];
    }
}

/**
 * Executes a provided function with optional arguments and returns its result or any error thrown.
 *
 * @template T
 * @template Args
 * @param {(...args: Args) => T} fn - The function to execute.
 * @param {...Args} args - The arguments to pass to the function.
 * @return {Result<T>} A tuple containing any error encountered and the result of the function execution.
 *                     If the function executes successfully, the first element is `undefined` and
 *                     the second element is the result.
 *                     If the function throws an error, the first element is the error and
 *                     the second element is `undefined`.
 */
export const resolveSync = <T = unknown, Args extends unknown[] = never[]>(
    fn: (...args: Args) => T,
    ...args: Args
): Result<T> => {
    try {
        const data = fn(...args);
        return [undefined, data];
    } catch (err) {
        return [normalizeError(err), undefined];
    }
};
