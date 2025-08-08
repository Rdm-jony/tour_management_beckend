"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleZodeError = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const handleZodeError = (err) => {
    const errorSources = [];
    err.issues.forEach((errorObject) => errorSources.push({
        path: errorObject.path.length > 1 ? errorObject.path.reverse().join(" inside ") : errorObject.path[0],
        message: errorObject.message
    }));
    return {
        statusCode: 400,
        message: "Zod Error",
        errorSources
    };
};
exports.handleZodeError = handleZodeError;
