// External dependencies

// import classnames from 'classnames';
//
// // WordPress dependencies
//
// const _ = lodash;
//
// // Gets JSON data from PHP
// export function externalData(key) {
// 	const { data = {} } =  window[key] || {};
// 	return data;
// }
//
// // Just a more familiar name
// export const mergeClasses = classnames;
//
// // Checks if value can be converted to Number
// export function isNum(n) {
// 	return !_.isNaN(parseFloat(n)) && isFinite(n);
// }
//
// // convert argument to Boolean value
// // works for true, false, 0, 1, "true", "false", "TRUE", "FALSE", "0", "1", undefined
// export function toBool(val) {
// 	let num;
// 	return val != null && (!_.isNaN(num = +val) ? !!num : !!String(val).toLowerCase().replace(!!0,''));
// }
//
// export function toRange(num, min, max, useMinOnErr = true) {
// 	let value = _.isNaN(+num) ? (useMinOnErr ? min : max) : num;
// 	return  _.clamp(_.round(value), min, max);
// }
//
// // Create key for react components from 'value' or other params
// export function getKey(value, more) {
// 	const source = _.isString(value) || isNum(value) ? String(value) : String(more);
// 	let hash = 0, i;
// 	for(i = 0; i < source.length; i++) {
// 		hash = ((hash << 5) - hash) + source.charCodeAt(i);
// 		hash |= 0; // Convert to 32bit integer
// 	}
// 	return String(hash);
// }
//
// export function isWrongId(id) {
// 	return _.isNil(id) || (isNum(id) && parseInt(id, 10) === 0);
// }
//
// // Convert object to JSON
// export function toJSON(obj) {
// 	if(obj) {
//
// 		try {
// 			obj = JSON.stringify(obj);
// 		} catch(err) {
// 			obj = '{}';
// 		}
// 	}
// 	return obj || '{}';
// }
//
// // Returns SVG with a reference to an already loaded SVG set
// export function getSvg(id, icon = false, moreClasses = '') {
//
// 	const size = 24;	// change viewBox values according to Icons Set
// 	return (
// 		<svg
// 			className={ classnames('zu-svg', { icon }, `icon-${id}`, moreClasses) }
// 			role="img"
// 			aria-labelledby="title"
// 			viewBox={ `0 0 ${size} ${size}` }
// 			preserveAspectRatio="xMidYMin slice"
// 		>
// 			<use href={ `#${id}` }/>
// 		</svg>
// 	);
// }
