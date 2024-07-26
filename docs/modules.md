CommonJS Exports:

Individual Exports: Export each function separately (e.g., module.exports.function1 = function1).
Whole Module Export: Export an object containing functions (e.g., module.exports = { function1, function2 }).
Namespaces:

Creating Namespaces: Use objects to group related functions and variables, preventing naming conflicts.
ES6 Modules: Use import and export for modular code, which also provides namespacing naturally.
Export Syntax:

export const or export function: Used to export constants and functions directly.
Inline Exporting: Declare and then export constants/functions in a single step (e.g., export { myConstant, myFunction }).

EXAMPLES

// commonjs - individual
function fn1() {}
module.exports.fn1 = fn1;

// commonjs - whole mod
function fn1() {}
module.exports = { fn1 };

// namespace objects
const MyNS = { fn1() {} };
module.exports = MyNS;

// namespace es6 mods
export function fn1() {}

// export direct syntax
export const myConst = 42;

// export inline exporting
const myConst = 42;
export { myConst };
