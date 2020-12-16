// WordPress dependencies

const {
	join,
	map,
	transform,
	reject,
	includes,
} = lodash;

const { __ } = wp.i18n;

// Internal dependencies

import { row, layout, iconColor } from './../../shared/assets.js';
import { layoutsXGrid, makeColumnAttributes } from './../../shared/on-responsive.js';

// Options & Values

const columnOptions = [
	{ value: 1, label: __('One Column'), layout: [100] },
	{ value: 2, label: __('Two Columns'), layout: [50, 50] },
	{ value: 3, label: __('Three Columns'), layout: [33, 33, 33] },
	{ value: 4, label: __('Four Columns'), layout: [25, 25, 25, 25]},
];

// Create options object based on layout options
// 		2: [
// 			 {  value: '50_50', label: __('50  %  50') },
export const layoutOptionsFull = transform(layoutsXGrid, (values, set, columns)  => {
	values[columns] = map(set, layout => {
		return { label:  join(layout, '  /  '), value: join(layout, '_') };
	});
});

// We do not use these layouts as primary options because we have space for 4 columns only
const skipOptions = ['33_66', '60_40', '25_75', '25_25_50'];
export const layoutOptions = transform(layoutOptionsFull, (values, set, columns)  => {
	values[columns] = reject(set, obj => { return includes(skipOptions, obj.value); });
});

export const columnBlock = 'zu/column';

export const allowedBlocks = [ columnBlock ];

// Create template object based on layout options
// 	'50_50': [
// 				[ columnBlock, { width: '50%' } ],
// 				[ columnBlock, { width: '50%' } ],
// 			 ],
export const template = transform(layoutsXGrid, (values, set, columns)  => {
	transform(set, (group, layout)  => {
		group[join(layout, '_')] = map(layout, (value, index) => {
			return [ columnBlock, makeColumnAttributes(columns, index, value, layout) ];
		});
	}, values);
});

export const assets = {
	columnOptions,
	layoutOptions,
	layoutOptionsFull,
	svg: { row: { src: row, foreground: iconColor }, layout: { src: layout, foreground: iconColor } },
};
