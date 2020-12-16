// WordPress dependencies

const { registerBlockType } = wp.blocks;

// Import debug object and make it available from global scope
// import zubug from './shared/debug.js';
// window.Zubug = zubug;

// Zukit dependencies

const { registerCollection, registerCategory, brandAssets } = wp.zukit.utils;

// Internal dependencies

// import { registerPlugins } from './zu-plugins.js';
// import { editorInit } from './zu-admin.js';

// Register ZU blocks collection or category
const supportsCollections = registerCollection();
if(!supportsCollections) registerCategory();

//  Register Blocks
import * as form from './blocks/form/index.js';
import * as field from './blocks/field/index.js';

export function registerBlocks() {
	[
		form,
		field,

	].forEach(block => {

		if(!block) return;

		const { name, settings } = block;
		if(!supportsCollections) settings.category = brandAssets.slug;
		registerBlockType(name, settings);

	} );
}

registerBlocks();
