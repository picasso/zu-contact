// WordPress dependencies

const { isNil } = lodash;

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

 // Gets JSON data from PHP
 export const pluginData = externalData('zucontact_blocks_data');
 const { prefix: cssPrefix = 'zuc' } = pluginData;

 export function prefixIt(name, divider = '-') {
    if(isNil(name)) return cssPrefix;
    if(divider === '[]') return `${cssPrefix}[${name}]`;
    return `${cssPrefix}${divider}${name}`;
 }
