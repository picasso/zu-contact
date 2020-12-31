// // WordPress dependencies
//
// const _ = lodash;
//

// Zukit dependencies

export const {
    externalData,
    mergeClasses,
    isNum,
    toBool,
    toJSON,
    uniqueValue,

    getColor,
    hexToRGBA,
    brandAssets,

    registerCollection,
    registerCategory,
 } = wp.zukit.utils;

 // Import debug object and make it available from global scope
 window.Zubug = { ...(wp.zukit.debug  || {}) };
