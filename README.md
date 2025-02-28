# Welcome to CatchBuddy! 👋🏻

This package is a wrapper around a common pattern in Javascript: the try/catch statement.

# Quick start

## Installation

Use your favorite package manager to install CatchBuddy.

```bash
npm install catchbuddy
```

# Usage

## Problem

Let's start with an example of a common try-catch statement in Javascript.

```javascript
try {
    mightThrow();
} catch (err) {
    console.error(err);
}
```

If you plan on keeping your application as simple as this, you might not need `catchbuddy`.
Once you start adding more calls that might throw, handling errors become messy really quickly.

```javascript
try {
    mightThrow();
    mightThrowSomeError();
    mightThrowAnotherError();
} catch (err) {
    console.error(err);
}
```

Now you have three different errors to handle. Sure, you could use an if statement or switch through them
but you can see that this becomes a pain in the ass really quickly. Let's say the third function call throws an error,
and you'd still want to handle the results of the first two successful calls. Well, you can't really do that because of
how the try-catch blocks are scoped.

```javascript
try {
    const result1 = mightThrow();
    const result2 = mightThrowSomeError();
    const result3 = mightThrowAnotherError(); // throws an error

    doSomethingWithResults(result1, result2, result3);
} catch (err) {
    console.error(err);
    // result1, result2 and result3 are undefined here
}
```

What if you wrap the three calls in their own try-catch blocks?

```javascript
try {
    const result1 = mightThrow();
} catch (err) {
    console.error(err);
}

// Can't access result1 here.

try {
    const result2 = mightThrowSomeError();
} catch (err) {
    console.error(err);
}

// Can't access result1 and result2 here.

try {
    const result3 = mightThrowAnotherError(); // throws an error
} catch (err) {
    console.error(err);
}

// result1, result2 and result2 are undefined here.
doSomethingWithResults(result1, result2, result3);
```

## Solution

Let's apply `resolveSync` from CatchBuddy on the last example.

```javascript
import { resolveSync } from "catchbuddy";

const [err1, result1] = resolveSync(mightThrow());
const [err2, result2] = resolveSync(mightThrowSomeError());
const [err3, result3] = resolveSync(mightThrowAnotherError());

if (err1) {
    console.error("We have a problem with mightThrow.", err1);
}
if (err2) {
    console.error(
        `We have a problem with mightThrowSomeError, but ${result1} is fine!`,
    );
}
if (err3) {
    console.error(
        `Oops, mightThrowAnotherError failed, but ${result1} and ${result2} are fine!`,
    );
}

// We can do anything we like with either result or error. Great! :)
doSomethingWithResults(result1, result2, result3);
```

You see, with `resolveSync`, you can handle errors and results in a more organized way.
You can also access the results of the successful calls outside of the try-catch block.

## Handling Async Function Calls

CatchBuddy is not limited to synchronous operations. It can also be used to simplify asynchronous function calls, such as those that return a promise. Here’s how you can handle async function calls with `resolve`:

### Problem

When dealing with async operations, you often use `try/catch` blocks with `await`:

```javascript
async function handleAsyncOperations() {
    try {
        const result1 = await asyncMightThrow();
        const result2 = await asyncMightThrowSomeError();
        const result3 = await asyncMightThrowAnotherError();
        doSomethingWithResults(result1, result2, result3);
    } catch (err) {
        console.error("One of the async operations failed", err);
    }
}
```

If one of the async operations throws an error, the entire block fails, and the subsequent operations are not executed. This makes it hard to work with partially completed results.

### Solution

With `resolve`, you can handle async operations more granularly without worrying about the scope of a try/catch block. It takes advantage of the promise's ability to resolve errors and values consistently. Here's how you could rewrite the above logic:

```javascript
import { resolve } from "catchbuddy";

async function handleAsyncWithResolve() {
    const [err1, result1] = await resolve(asyncMightThrow());
    const [err2, result2] = await resolve(asyncMightThrowSomeError());
    const [err3, result3] = await resolve(asyncMightThrowAnotherError());

    if (err1) {
        console.error("Error in asyncMightThrow:", err1);
    } else {
        console.log("Result from asyncMightThrow:", result1);
    }

    if (err2) {
        console.error("Error in asyncMightThrowSomeError:", err2);
    } else {
        console.log("Result from asyncMightThrowSomeError:", result2);
    }

    if (err3) {
        console.error("Error in asyncMightThrowAnotherError:", err3);
    } else {
        console.log("Result from asyncMightThrowAnotherError:", result3);
    }

    // All results (successful or not) are still accessible here
    doSomethingWithResults(result1, result2, result3);
}
```

### Benefits of Using `resolve` with Async

- **Error Isolation**: Errors in one async function do not affect others. Each function's result or error is handled independently.
- **Simplified Syntax**: No nested `try/catch` blocks or complex chaining of promises.
- **Access to Partial Results**: You can access the successful results even when some operations fail, which is particularly useful in workflows that can continue despite some errors.

### Example

Here's a full example with mocked async functions to demonstrate:

```javascript
import { resolve } from "catchbuddy";

async function asyncMightThrow() {
    // Simulated async success
    return "Result from asyncMightThrow";
}

async function asyncMightThrowSomeError() {
    // Simulated async failure
    throw new Error("Something went wrong in asyncMightThrowSomeError");
}

async function asyncMightThrowAnotherError() {
    // Simulated async success
    return "Result from asyncMightThrowAnotherError";
}

async function handleExample() {
    const [err1, result1] = await resolve(asyncMightThrow());
    const [err2, result2] = await resolve(asyncMightThrowSomeError());
    const [err3, result3] = await resolve(asyncMightThrowAnotherError());

    if (err1) console.error(err1);
    else console.log(result1);

    if (err2) console.error(err2);
    else console.log(result2);

    if (err3) console.error(err3);
    else console.log(result3);
}
```

CatchBuddy simplifies error handling for both synchronous and asynchronous operations, making your code easier to read and maintain.

# Contributing

If you have any ideas on how to improve CatchBuddy, feel free to open an issue or a pull request. We're always open to new ideas and improvements.
