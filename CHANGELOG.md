# catchbuddy

## 0.2.1

### Patch Changes

- Guard against non-serializable thrown values (circular references, BigInt) so `resolve`/`resolveSync` never throw while normalizing a non-Error rejection. Also fixed README `resolveSync` examples that invoked the function instead of passing it, and minor doc typos.

## 0.2.0

### Minor Changes

- Improved error handling for non-Error type errors.

## 0.1.1

### Patch Changes

- abb4fb5: Removed dependency on Typescript

## 0.1.0

### Minor Changes

- f8750c2: This is the initial version of CatchBuddy, ready to go on npm.
