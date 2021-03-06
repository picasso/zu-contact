// // WordPress dependencies

const { isNil, map } = lodash;
const { __ } = wp.i18n;
// const { compose } = wp.compose;
const { Spinner, SelectControl, TextControl, Button, PanelBody } = wp.components; // ToggleControl, PanelRow
const { RawHTML, useState } = wp.element;

// Zukit dependencies

const { toggleOption } = wp.zukit.render;
const { useFolders, useGalleries, useLoaders } = wp.zukit.data;

// Internal dependencies

import {
	useSvgFromFile,
	useGetOptions,
	useUpdateOptions,
	useGetOption,
	useSetOption,
	pluginOptions,
	optionsData,
	recaptchaTheme
} from './store.js';

const PluginOptionsEdit = () => {

	const options = useGetOptions(pluginOptions, false);
	const updateOptions = useUpdateOptions();
    const setOption = useSetOption();
    const theme = useGetOption(recaptchaTheme.key);

	const [ svgName, setSvgName ] = useState('');
	const [ currentSvg, setCurrentSvg ] = useState('');

	const rawSvg = useSvgFromFile(currentSvg);

	const loader3 = useLoaders(3);
	const folde65 = useFolders(65);
	const gallery474 = useGalleries(474);

	const folderOptions = useFolders(null, true);
	const galleries = useGalleries();

	if(options === null) return (
		<div className="components-base-control __flex_center">
			<Spinner />
		</div>
	);

	const svgIcon = isNil(rawSvg) ? null : (
		<RawHTML className="zu-svg">
			{ rawSvg }
		</RawHTML>
	);

	// const folderOptions = map(folders, val => ({ label: val.title, value: val.id }) )
	const galleryOptions = map(galleries, val => ({ label: val.title, value: val.id }) )

	return (
		<>
			{ !loader3 ? <Spinner/> : (
				<div>
				Loader with Id <strong>3</strong>
				<RawHTML className="zu-svg">
					{ loader3 }
				</RawHTML>
				</div>
			) }

			{ !folde65 ? <Spinner/> : (
				<div>
				Folder with Id <strong>{ folde65.id }</strong>
				<h2>
					{ folde65.title }
				</h2>
				</div>
			) }

			{ !folderOptions ? <Spinner/> : (
				<SelectControl
					id="folders"
					label={ 'Folders' }
					value={ 0 }
					onChange={ value => console.log('Folder with Id=', value) }
					options={ folderOptions }
				/>
			) }

			{ !gallery474 ? <Spinner/> : (
				<div>
				Gallery with Id <strong>{ gallery474.id }</strong>
				<h2>
					{ gallery474.title }
				</h2>
				</div>
			) }

			{ !galleries ? <Spinner/> : (
				<SelectControl
					id="galleries"
					label={ 'Galleries' }
					value={ 0 }
					onChange={ value => console.log('Gallery with Id=', value) }
					options={ galleryOptions }
				/>
			) }


			{ toggleOption(optionsData, options, updateOptions) }

			{ theme === null ? <Spinner/> : (
				<SelectControl
					id="theme"
					label={ recaptchaTheme.label }
					value={ theme }
					onChange={ value => setOption(recaptchaTheme.key, value) }
					options={ recaptchaTheme.options }
                />
            ) }
			<PanelBody title={ __('SVG Tester', 'zu-contact') } initialOpen={ true }>
				{ svgIcon }
				<TextControl
					label={ __('SVG Name', 'zu-contact') }
					value={ svgName }
					onChange={ setSvgName }
				/>
				<Button
					isSecondary
					onClick={ () => setCurrentSvg(svgName) }
				>
					{ 'Update SVG' }
				</Button>
			</PanelBody>
		</>
	);

}

export default PluginOptionsEdit;
