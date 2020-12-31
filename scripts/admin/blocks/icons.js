// WordPress dependencies

const { keys, has, transform } = lodash;
const { Path, G, SVG } = wp.components;

// Internal dependencies

import { getColor, hexToRGBA } from './utils.js';

// Custom foreground icon color based on the Zu Blocks branding
export const iconColor = getColor('violet');
export { getColor };

// ZU Blocks icons

export const form = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M0.545,19.636 C0.847,19.636 1.091,19.881 1.091,20.182 L1.091,22.909 L3.818,22.909 C4.119,22.909 4.364,23.153 4.364,23.455 C4.364,23.756 4.119,24 3.818,24 L0.545,24 C0.244,24 -0,23.756 0,23.455 L0,20.182 C-0,19.881 0.244,19.636 0.545,19.636 L0.545,19.636 z M23.455,19.636 L23.455,19.636 C23.153,19.636 22.909,19.881 22.909,20.182 L22.909,22.909 L20.182,22.909 C19.881,22.909 19.636,23.153 19.636,23.455 C19.636,23.756 19.881,24 20.182,24 L23.455,24 C23.755,24 24,23.756 24,23.455 L24,20.182 C24,19.881 23.755,19.636 23.455,19.636 z M10.364,22.909 L7.091,22.909 C6.79,22.909 6.545,23.153 6.545,23.454 C6.545,23.756 6.79,24 7.091,24 L10.364,24 C10.664,24 10.909,23.756 10.909,23.454 C10.909,23.153 10.664,22.909 10.364,22.909 z M16.909,22.909 L13.636,22.909 C13.335,22.909 13.091,23.153 13.091,23.454 C13.091,23.756 13.335,24 13.636,24 L16.909,24 C17.209,24 17.455,23.756 17.455,23.454 C17.455,23.153 17.209,22.909 16.909,22.909 z M0.545,13.091 C0.244,13.091 0,13.335 0,13.636 L0,16.909 C0,17.21 0.244,17.455 0.545,17.455 C0.847,17.455 1.091,17.21 1.091,16.909 L1.091,13.636 C1.091,13.335 0.847,13.091 0.545,13.091 z M23.455,13.091 C23.153,13.091 22.909,13.335 22.909,13.636 L22.909,16.909 C22.909,17.21 23.153,17.455 23.455,17.455 C23.755,17.455 24,17.21 24,16.909 L24,13.636 C24,13.335 23.755,13.091 23.454,13.091 z M23.455,6.545 C23.153,6.545 22.909,6.79 22.909,7.091 L22.909,10.364 C22.909,10.665 23.153,10.909 23.455,10.909 C23.755,10.909 24,10.665 24,10.364 L24,7.091 C24,6.79 23.755,6.545 23.454,6.545 z M0.545,6.545 C0.244,6.545 0,6.79 0,7.091 L0,10.364 C0,10.665 0.244,10.909 0.545,10.909 C0.847,10.909 1.091,10.665 1.091,10.364 L1.091,7.091 C1.091,6.79 0.847,6.545 0.545,6.545 z M3.818,-0 L0.545,-0 C0.244,-0 -0,0.244 0,0.545 L0,3.818 C-0,4.119 0.244,4.364 0.545,4.364 C0.847,4.364 1.091,4.119 1.091,3.818 L1.091,1.091 L3.818,1.091 C4.119,1.091 4.364,0.847 4.364,0.545 C4.364,0.244 4.119,-0 3.818,-0 z M23.455,-0 L20.182,-0 C19.881,-0 19.636,0.244 19.636,0.545 C19.636,0.847 19.881,1.091 20.182,1.091 L22.909,1.091 L22.909,3.818 C22.909,4.119 23.153,4.364 23.455,4.364 C23.755,4.364 24,4.119 24,3.818 L24,0.545 C24,0.244 23.755,-0 23.455,-0 z M10.364,-0 L7.091,-0 C6.79,-0 6.545,0.244 6.545,0.545 C6.545,0.847 6.79,1.091 7.091,1.091 L10.364,1.091 C10.664,1.091 10.909,0.847 10.909,0.545 C10.909,0.244 10.664,-0 10.364,-0 z M16.909,-0 L13.636,-0 C13.335,-0 13.091,0.244 13.091,0.545 C13.091,0.847 13.335,1.091 13.636,1.091 L16.909,1.091 C17.209,1.091 17.455,0.847 17.455,0.545 C17.455,0.244 17.209,-0 16.909,-0 z" fill={ hexToRGBA(iconColor, 0.3) } id="frame"/>
		<Path d="M21,12 L21,17 L3,17 L3,12 L21,12 z M20,13 L4,13 L4,16 L20,16 L20,13 z M3,10 L21,10 L21,11 L3,11 z M3,8 L21,8 L21,9 L3,9 z M3,6 L21,6 L21,7 L3,7 z M3,3 L15,3 L15,5 L3,5 z" fill={ hexToRGBA(iconColor, 0.8) } id="form"/>
		<Path d="M13.185,18 L19.815,18 C20.469,18 21,18.448 21,19 L21,20 C21,20.552 20.469,21 19.815,21 L13.185,21 C12.531,21 12,20.552 12,20 L12,19 C12,18.448 12.531,18 13.185,18 z" fill={ iconColor } id="button"/>
	</G>
</SVG>
);

export const field = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M8.667,17.5 L12,17.5 L12,16.5 L8.667,16.5 z M13.667,16.5 L17,16.5 L17,17.5 L13.667,17.5 z M22,16.5 L22,21.5 L17,21.5 L17,20.5 L20.889,20.5 L20.889,17.5 L18.667,17.5 L18.667,16.5 z M7,20.5 L10.333,20.5 L10.333,21.5 L7,21.5 z M12,20.5 L15.333,20.5 L15.333,21.5 L12,21.5 z M3.111,17.5 L3.111,20.5 L5.333,20.5 L5.333,21.5 L2,21.5 L2,16.5 L7,16.5 L7,17.5 z M8.667,3.5 L12,3.5 L12,2.5 L8.667,2.5 z M13.667,2.5 L17,2.5 L17,3.5 L13.667,3.5 z M22,2.5 L22,7.5 L17,7.5 L17,6.5 L20.889,6.5 L20.889,3.5 L18.667,3.5 L18.667,2.5 z M7,6.5 L10.333,6.5 L10.333,7.5 L7,7.5 z M12,6.5 L15.333,6.5 L15.333,7.5 L12,7.5 z M7,3.5 L7,2.5 L2,2.5 L2,7.5 L5.333,7.5 L5.333,6.5 L3.111,6.5 L3.111,3.5 z" fill={ hexToRGBA(iconColor, 0.5) } id="fileds"/>
		<Path d="M22,9.5 L22,14.5 L2,14.5 L2,9.5 L22,9.5 z M20.889,10.5 L3.111,10.5 L3.111,13.5 L20.889,13.5 L20.889,10.5 z" fill={ iconColor } id="selected"/>
	</G>
</SVG>
);

// Layout icons

export const contact = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M21.6,0 C22.92,0 24,1.013 24,2.25 L24,21.75 C24,22.987 22.92,24 21.6,24 L2.4,24 C1.08,24 -0,22.987 0,21.75 L0,2.25 C-0,1.013 1.08,0 2.4,0 L21.6,0 z M21,3 L3,3 L3,21 L21,21 L21,3 z" fill={ hexToRGBA(iconColor, 0.5) } id="frame"/>
		<Path d="M16.667,11 L7.333,11 C6.597,11 6,11.551 6,12.231 L6,17.769 C6,18.449 6.597,19 7.333,19 L16.667,19 C17.403,19 18,18.449 18,17.769 L18,12.231 C18,11.551 17.403,11 16.667,11 z M10.211,15.502 L11.279,16.364 C11.482,16.527 11.739,16.609 12,16.609 C12.261,16.609 12.518,16.527 12.721,16.364 L13.789,15.502 L13.765,15.525 L16.195,17.769 L7.805,17.769 L10.235,15.525 L10.211,15.502 z M7.333,17.334 L7.333,13.178 L9.735,15.118 L7.333,17.334 z M14.265,15.118 L16.667,13.178 L16.667,17.332 L14.265,15.118 z M16.667,12.231 L16.667,12.36 L12.283,15.901 C12.131,16.023 11.869,16.023 11.717,15.901 L7.333,12.36 L7.333,12.231 L16.667,12.231 z" fill={ iconColor } id="mail"/>
		<Path d="M6,10 L18,10 L18,9 L6,9 z M6,7 L18,7 L18,8 L6,8 z M6,5 L18,5 L18,6 L6,6 z" fill={ hexToRGBA(iconColor, 0.8) } id="fields"/>
	</G>
</SVG>
);

export const booking = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M21.6,0 C22.92,0 24,1.013 24,2.25 L24,21.75 C24,22.987 22.92,24 21.6,24 L2.4,24 C1.08,24 -0,22.987 0,21.75 L0,2.25 C-0,1.013 1.08,0 2.4,0 L21.6,0 z M21,3 L3,3 L3,21 L21,21 L21,3 z" fill={ hexToRGBA(iconColor, 0.5) } id="frame"/>
		<Path d="M11,19 L18,19 L18,17 L11,17 z" fill={ iconColor } id="button"/>
		<Path d="M18,13 L18,16 L6,16 L6,13 L18,13 z M17,14 L7,14 L7,15 L17,15 L17,14 z M6,11 L18,11 L18,12 L6,12 z M6,9 L18,9 L18,10 L6,10 z M6,7 L18,7 L18,8 L6,8 z M6,5 L18,5 L18,6 L6,6 z" fill={ hexToRGBA(iconColor, 0.8) } id="fields"/>
	</G>
</SVG>
);

export const subscribe = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M21.6,0 C22.92,0 24,1.013 24,2.25 L24,21.75 C24,22.987 22.92,24 21.6,24 L2.4,24 C1.08,24 -0,22.987 0,21.75 L0,2.25 C-0,1.013 1.08,0 2.4,0 L21.6,0 z M21,3 L3,3 L3,21 L21,21 L21,3 z" fill={ hexToRGBA(iconColor, 0.5) } id="frame"/>
		<Path d="M11.708,19 L7.833,14.521 L8.937,13.417 L11.708,15.583 L16.895,11 L18,12.104 z" fill={ iconColor } id="check"/>
		<Path d="M6,10 L18,10 L18,9 L6,9 z M6,7 L18,7 L18,8 L6,8 z M6,5 L18,5 L18,6 L6,6 z" fill={ hexToRGBA(iconColor, 0.8) } id="fields"/>
	</G>
</SVG>
);

// Types icons

function typeIcon(type, frameOpacity = 0.3) {

	const types = {
		textarea: "M5,19 L15,19 L15,17 L5,17 z M5,13 L19,13 L19,15 L5,15 z M5,9 L19,9 L19,11 L5,11 z M5,5 L19,5 L19,7 L5,7 z",
		text: "M18.562,5 L5.438,5 C5.196,5 5,5.196 5,5.438 L5,8.062 C5,8.304 5.196,8.5 5.438,8.5 L5.875,8.5 C6.117,8.5 6.313,8.304 6.313,8.062 L7.188,6.75 L11.125,6.75 L11.125,17.25 L8.938,18.125 C8.696,18.125 8.5,18.321 8.5,18.562 C8.5,18.804 8.696,19 8.938,19 L15.062,19 C15.304,19 15.5,18.804 15.5,18.562 C15.5,18.321 15.304,18.125 15.062,18.125 L12.875,17.25 L12.875,6.75 L16.812,6.75 L17.688,8.062 C17.688,8.304 17.883,8.5 18.125,8.5 L18.562,8.5 C18.804,8.5 19,8.304 19,8.062 L19,5.438 C19,5.196 18.804,5 18.562,5 z",
		email: "M17.444,7 L6.556,7 C5.697,7 5,7.689 5,8.539 L5,15.461 C5,16.311 5.697,17 6.556,17 L17.444,17 C18.303,17 19,16.311 19,15.461 L19,8.539 C19,7.689 18.303,7 17.444,7 z M9.912,12.628 L11.158,13.705 C11.396,13.909 11.696,14.01 12,14.01 C12.304,14.01 12.604,13.908 12.842,13.705 L14.088,12.628 L14.059,12.656 L16.895,15.461 L7.105,15.461 L9.941,12.656 L9.912,12.628 z M6.556,14.917 L6.556,9.723 L9.357,12.147 L6.556,14.917 z M14.643,12.147 L17.444,9.723 L17.444,14.915 L14.643,12.147 z M17.444,8.539 L17.444,8.7 L12.33,13.126 C12.153,13.278 11.847,13.278 11.67,13.126 L6.556,8.7 L6.556,8.539 L17.444,8.539 z",
		submit: "M18,7 C18.552,7 19,7.448 19,8 L19,16 C19,16.552 18.552,17 18,17 L6,17 C5.448,17 5,16.552 5,16 L5,8 C5,7.448 5.448,7 6,7 L18,7 z M10.058,9.782 Q9.07,9.782 8.508,10.393 Q7.945,11.004 7.945,12.056 Q7.945,13.099 8.508,13.712 Q9.07,14.326 10.058,14.326 Q11.042,14.326 11.607,13.72 Q12.173,13.113 12.173,12.056 Q12.173,10.998 11.607,10.39 Q11.042,9.782 10.058,9.782 z M10.061,10.605 Q10.251,10.605 10.428,10.683 Q10.606,10.761 10.746,10.939 Q10.881,11.115 10.961,11.389 Q11.042,11.663 11.042,12.053 Q11.042,12.463 10.966,12.716 Q10.89,12.97 10.749,13.16 Q10.617,13.336 10.436,13.419 Q10.254,13.503 10.061,13.503 Q9.87,13.503 9.691,13.425 Q9.513,13.348 9.372,13.166 Q9.234,12.987 9.155,12.722 Q9.076,12.457 9.076,12.056 Q9.076,11.666 9.16,11.385 Q9.243,11.103 9.378,10.934 Q9.53,10.749 9.694,10.677 Q9.858,10.605 10.061,10.605 z M13.787,9.677 L12.762,9.677 L12.762,14.235 L13.787,14.235 L13.787,13.017 L13.945,12.803 L14.836,14.235 L16.055,14.235 L14.818,12.363 L15.97,10.945 L14.76,10.945 L13.787,12.231 L13.787,9.677 z",
		tel: "M15.267,13.4 C14.333,14.333 14.333,15.267 13.4,15.267 C12.467,15.267 11.533,14.333 10.6,13.4 C9.667,12.467 8.733,11.533 8.733,10.6 C8.733,9.667 9.667,9.667 10.6,8.733 C11.533,7.8 8.733,5 7.8,5 C6.867,5 5,7.8 5,7.8 C5,9.667 6.917,13.451 8.733,15.267 C10.549,17.082 14.333,19 16.2,19 C16.2,19 19,17.133 19,16.2 C19,15.267 16.2,12.467 15.267,13.4 z",
		url: "M10.995,13.733 C10.809,13.733 10.622,13.661 10.48,13.519 C9.148,12.187 9.148,10.02 10.48,8.688 L13.169,6 C13.814,5.355 14.672,5 15.585,5 C16.497,5 17.355,5.355 18.001,6 C19.333,7.332 19.333,9.499 18.001,10.831 L16.772,12.06 C16.487,12.345 16.026,12.345 15.742,12.06 C15.457,11.776 15.457,11.315 15.742,11.031 L16.971,9.802 C17.735,9.037 17.735,7.794 16.971,7.03 C16.601,6.66 16.108,6.456 15.585,6.456 C15.061,6.456 14.569,6.66 14.198,7.03 L11.51,9.718 C10.745,10.482 10.745,11.726 11.51,12.49 C11.794,12.774 11.794,13.235 11.51,13.519 C11.368,13.661 11.181,13.733 10.995,13.733 z M8.415,19 C9.328,19 10.186,18.645 10.831,18 L13.52,15.311 C14.852,13.98 14.852,11.812 13.52,10.481 C13.235,10.196 12.775,10.196 12.49,10.481 C12.206,10.765 12.206,11.226 12.49,11.51 C13.255,12.274 13.255,13.518 12.49,14.282 L9.802,16.97 C9.431,17.34 8.939,17.544 8.415,17.544 C7.892,17.544 7.399,17.34 7.029,16.97 C6.265,16.206 6.265,14.962 7.029,14.198 L8.258,12.969 C8.543,12.685 8.542,12.224 8.258,11.94 C7.974,11.655 7.513,11.655 7.228,11.94 L5.999,13.169 C4.667,14.501 4.667,16.668 5.999,18 C6.645,18.645 7.503,19 8.415,19 z",
		checkbox: "M17.25,5 L6.75,5 C5.787,5 5,5.787 5,6.75 L5,17.25 C5,18.212 5.787,19 6.75,19 L17.25,19 C18.212,19 19,18.212 19,17.25 L19,6.75 C19,5.787 18.212,5 17.25,5 z M11.125,15.862 L7.881,12.619 L9.119,11.381 L11.125,13.388 L15.319,9.194 L16.556,10.431 L11.125,15.862 z",
		number: "M19,11.631 Q19,12.466 18.806,13.16 Q18.613,13.854 18.205,14.351 Q17.783,14.856 17.157,15.127 Q16.531,15.397 15.621,15.397 Q15.314,15.397 14.98,15.357 Q14.646,15.318 14.536,15.287 L14.536,14 L14.663,14 Q14.786,14.061 15.013,14.131 Q15.239,14.202 15.639,14.202 Q15.959,14.202 16.258,14.116 Q16.557,14.03 16.772,13.846 Q16.996,13.652 17.146,13.362 Q17.295,13.072 17.348,12.637 Q16.996,12.857 16.695,12.973 Q16.394,13.09 15.946,13.09 Q15.608,13.09 15.298,13 Q14.988,12.91 14.734,12.721 Q14.395,12.457 14.198,12.042 Q14,11.626 14,10.967 Q14,10.458 14.173,10.025 Q14.347,9.592 14.668,9.271 Q14.984,8.955 15.445,8.774 Q15.907,8.594 16.473,8.594 Q17.045,8.594 17.488,8.755 Q17.932,8.915 18.248,9.245 Q18.618,9.618 18.809,10.207 Q19,10.796 19,11.631 z M17.374,11.385 Q17.374,10.853 17.284,10.508 Q17.194,10.163 17.031,9.97 Q16.917,9.829 16.774,9.768 Q16.632,9.706 16.465,9.706 Q16.32,9.706 16.181,9.765 Q16.043,9.825 15.915,9.97 Q15.801,10.097 15.722,10.343 Q15.643,10.589 15.643,10.884 Q15.643,11.2 15.724,11.405 Q15.806,11.609 15.946,11.732 Q16.087,11.851 16.267,11.899 Q16.447,11.947 16.667,11.947 Q16.851,11.947 17.047,11.897 Q17.242,11.846 17.361,11.793 Q17.361,11.745 17.368,11.655 Q17.374,11.565 17.374,11.385 z M13.514,11.756 L10.601,11.756 L10.601,12.978 L13.514,12.978 z M8.397,11.996 Q8.397,13.2 8.195,13.698 Q7.993,14.197 7.523,14.197 Q7.052,14.197 6.85,13.698 Q6.648,13.2 6.648,12.004 Q6.648,10.783 6.85,10.293 Q7.052,9.803 7.523,9.803 Q7.997,9.803 8.197,10.293 Q8.397,10.783 8.397,11.996 z M10.045,11.996 Q10.045,11.174 9.911,10.541 Q9.777,9.908 9.478,9.478 Q9.175,9.038 8.703,8.816 Q8.23,8.594 7.523,8.594 Q6.855,8.594 6.371,8.807 Q5.888,9.021 5.58,9.456 Q5.268,9.899 5.134,10.515 Q5,11.13 5,12 Q5,12.844 5.136,13.474 Q5.273,14.105 5.571,14.536 Q5.875,14.971 6.354,15.188 Q6.833,15.406 7.523,15.406 Q8.217,15.406 8.696,15.188 Q9.175,14.971 9.474,14.544 Q9.773,14.118 9.909,13.481 Q10.045,12.844 10.045,11.996 z",
	}

	if(type === null) return keys(types);
	if(!has(types, type)) return null;

	const adminBlueColor = getColor('wp_admin_blue');

return (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M21,0 L3,0 C1.35,0 0,1.35 0,3 L0,21 C0,22.65 1.35,24 3,24 L21,24 C22.65,24 24,22.65 24,21 L24,3 C24,1.35 22.65,0 21,0 z M22,22 L2,22 L2,2 L22,2 L22,22 z" fill={ hexToRGBA(adminBlueColor, frameOpacity) } id="frame"/>
		<Path d={ types[type] } fill="currentColor" id={ type }/>
	</G>
</SVG>
);
}

export const types = transform(typeIcon(null), (values, type)  => {
	values[type] = typeIcon(type);
});

// Block icons

export const placeholder = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M22.5,23 L19.5,23 C19.224,23 19,22.776 19,22.5 C19,22.224 19.224,22 19.5,22 L22,22 L22,19.5 C22,19.224 22.224,19 22.5,19 C22.775,19 23,19.224 23,19.5 L23,22.5 C23,22.776 22.775,23 22.5,23 z M22.5,17 C22.224,17 22,16.776 22,16.5 L22,13.5 C22,13.224 22.224,13 22.5,13 C22.775,13 23,13.224 23,13.5 L23,16.5 C23,16.776 22.775,17 22.5,17 z M22.5,11 C22.224,11 22,10.776 22,10.5 L22,7.5 C22,7.224 22.224,7 22.5,7 C22.775,7 23,7.224 23,7.5 L23,10.5 C23,10.776 22.775,11 22.5,11 z M22.5,5 C22.224,5 22,4.776 22,4.5 L22,2 L19.5,2 C19.224,2 19,1.776 19,1.5 C19,1.224 19.224,1 19.5,1 L22.5,1 C22.775,1 23,1.224 23,1.5 L23,4.5 C23,4.776 22.775,5 22.5,5 z M16.5,23 L13.5,23 C13.224,23 13,22.776 13,22.5 C13,22.224 13.224,22 13.5,22 L16.5,22 C16.775,22 17,22.224 17,22.5 C17,22.776 16.775,23 16.5,23 z M16.5,2 L13.5,2 C13.224,2 13,1.776 13,1.5 C13,1.224 13.224,1 13.5,1 L16.5,1 C16.775,1 17,1.224 17,1.5 C17,1.776 16.775,2 16.5,2 z M10.5,2 L7.5,2 C7.224,2 7,1.776 7,1.5 C7,1.224 7.224,1 7.5,1 L10.5,1 C10.775,1 11,1.224 11,1.5 C11,1.776 10.775,2 10.5,2 z M4.5,23 L1.5,23 C1.224,23 1,22.776 1,22.5 L1,19.5 C1,19.224 1.224,19 1.5,19 C1.776,19 2,19.224 2,19.5 L2,22 L4.5,22 C4.776,22 5,22.224 5,22.5 C5,22.776 4.776,23 4.5,23 z M4.5,2 L2,2 L2,4.5 C2,4.776 1.776,5 1.5,5 C1.224,5 1,4.776 1,4.5 L1,1.5 C1,1.224 1.224,1 1.5,1 L4.5,1 C4.776,1 5,1.224 5,1.5 C5,1.776 4.776,2 4.5,2 z M1.5,7 C1.776,7 2,7.224 2,7.5 L2,10.5 C2,10.776 1.776,11 1.5,11 C1.224,11 1,10.776 1,10.5 L1,7.5 C1,7.224 1.224,7 1.5,7 z M1.5,13 C1.776,13 2,13.224 2,13.5 L2,16.5 C2,16.776 1.776,17 1.5,17 C1.224,17 1,16.776 1,16.5 L1,13.5 C1,13.224 1.224,13 1.5,13 z M7.5,22 L10.5,22 C10.775,22 11,22.224 11,22.5 C11,22.776 10.775,23 10.5,23 L7.5,23 C7.224,23 7,22.776 7,22.5 C7,22.224 7.224,22 7.5,22 z" fill="currentColor" id="frame" opacity="0.5"/>
		<Path d="M6.195,14.431 Q5.793,13.717 5.325,13.021 Q4.857,12.325 4.329,11.707 L4.329,14.431 L3.405,14.431 L3.405,10.273 L4.167,10.273 Q4.365,10.471 4.605,10.759 Q4.845,11.047 5.094,11.374 Q5.343,11.701 5.589,12.052 Q5.835,12.403 6.051,12.727 L6.051,10.273 L6.981,10.273 L6.981,14.431 z M9.603,11.215 Q9.639,11.305 9.699,11.461 Q9.759,11.617 9.84,11.821 Q9.921,12.025 10.011,12.271 Q10.101,12.517 10.197,12.787 L9.015,12.787 Q9.111,12.517 9.204,12.271 Q9.297,12.025 9.375,11.821 Q9.453,11.617 9.513,11.461 Q9.573,11.305 9.603,11.215 z M11.727,14.431 Q11.493,13.759 11.283,13.189 Q11.073,12.619 10.872,12.115 Q10.671,11.611 10.473,11.158 Q10.275,10.705 10.071,10.273 L9.177,10.273 Q8.967,10.705 8.772,11.158 Q8.577,11.611 8.376,12.115 Q8.175,12.619 7.965,13.189 Q7.755,13.759 7.521,14.431 L8.493,14.431 Q8.559,14.215 8.64,13.987 Q8.721,13.759 8.799,13.531 L10.419,13.531 Q10.497,13.759 10.578,13.987 Q10.659,14.215 10.725,14.431 z M12.477,10.273 Q12.417,10.687 12.366,11.2 Q12.315,11.713 12.276,12.268 Q12.237,12.823 12.204,13.381 Q12.171,13.939 12.147,14.431 L13.059,14.431 Q13.077,13.825 13.107,13.111 Q13.137,12.397 13.197,11.671 Q13.305,11.923 13.437,12.229 Q13.569,12.535 13.698,12.841 Q13.827,13.147 13.947,13.426 Q14.067,13.705 14.151,13.903 L14.805,13.903 Q14.889,13.705 15.009,13.426 Q15.129,13.147 15.258,12.841 Q15.387,12.535 15.519,12.229 Q15.651,11.923 15.759,11.671 Q15.819,12.397 15.849,13.111 Q15.879,13.825 15.897,14.431 L16.809,14.431 Q16.785,13.939 16.752,13.381 Q16.719,12.823 16.68,12.268 Q16.641,11.713 16.59,11.2 Q16.539,10.687 16.479,10.273 L15.627,10.273 Q15.519,10.471 15.378,10.762 Q15.237,11.053 15.084,11.392 Q14.931,11.731 14.781,12.085 Q14.631,12.439 14.499,12.751 Q14.367,12.439 14.217,12.085 Q14.067,11.731 13.914,11.392 Q13.761,11.053 13.62,10.762 Q13.479,10.471 13.371,10.273 z M20.595,14.431 L20.595,13.645 L18.585,13.645 L18.585,12.643 L20.247,12.643 L20.247,11.875 L18.585,11.875 L18.585,11.059 L20.457,11.059 L20.457,10.273 L17.649,10.273 L17.649,14.431 z" fill="currentColor" id="name"/>
	</G>
</SVG>
);

export const required = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M12,2.993 L21.219,21.367 L2.781,21.367 L11.999,2.993 z M12,1 C11.526,1 11.052,1.32 10.692,1.959 L1.301,20.674 C0.582,21.953 1.194,23 2.661,23 L21.338,23 C22.805,23 23.417,21.954 22.698,20.674 L22.698,20.674 L13.307,1.959 C12.947,1.32 12.473,1 11.999,1 L11.999,1 z" fill="currentColor" id="frame"/>
		<Path d="M10.5,20 L13.5,20 L13.5,17 L10.5,17 z M10.5,9 L13.5,9 L13.5,16 L10.5,16 z" fill="currentColor" id="sign" opacity="0.6"/>
	</G>
</SVG>
);

export const invalid = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M12,1 C18.075,1 23,5.925 23,12 C23,18.075 18.075,23 12,23 C5.925,23 1,18.075 1,12 C1,5.925 5.925,1 12,1 z M12,3.062 C9.613,3.062 7.368,3.992 5.681,5.681 C3.993,7.369 3.062,9.613 3.062,12 C3.062,14.387 3.992,16.632 5.681,18.319 C7.369,20.007 9.613,20.938 12,20.938 C14.387,20.938 16.632,20.008 18.319,18.319 C20.007,16.631 20.938,14.387 20.938,12 C20.938,9.613 20.008,7.368 18.319,5.681 C16.631,3.993 14.387,3.062 12,3.062 z" fill="currentColor" id="frame" opacity="0.5"/>
		<Path d="M13.375,17 C13.375,17.76 12.76,18.375 12,18.375 C11.24,18.375 10.625,17.76 10.625,17 C10.625,16.24 11.24,15.625 12,15.625 C12.76,15.625 13.375,16.24 13.375,17 z M12,13.625 C12.76,13.625 13.375,13.01 13.375,12.25 L13.375,7 C13.375,6.24 12.76,5.625 12,5.625 C11.24,5.625 10.625,6.24 10.625,7 L10.625,12.25 C10.625,13.01 11.24,13.625 12,13.625 z" fill="currentColor" id="sign"/>
	</G>
</SVG>
);

export const submit = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M20.25,2.625 L9,13.875 L3.75,8.625 L0,12.375 L9,21.375 L24,6.375 z" fill="currentColor"/>
	</G>
</SVG>
);

export const remove = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M4.438,7.875 L4.438,21.625 C4.438,22.381 5.056,23 5.812,23 L18.188,23 C18.944,23 19.562,22.381 19.562,21.625 L19.562,7.875 L4.438,7.875 z M8.562,20.25 L7.188,20.25 L7.188,10.625 L8.562,10.625 L8.562,20.25 z M11.312,20.25 L9.938,20.25 L9.938,10.625 L11.312,10.625 L11.312,20.25 z M14.062,20.25 L12.688,20.25 L12.688,10.625 L14.062,10.625 L14.062,20.25 z M16.812,20.25 L15.438,20.25 L15.438,10.625 L16.812,10.625 L16.812,20.25 z M14.062,3.75 L14.062,2.392 L9.938,2.392 L9.938,3.75 L14.062,3.75 z M19.906,3.75 C20.473,3.75 20.938,4.214 20.938,4.781 L20.938,6.5 L3.062,6.5 L3.062,4.781 C3.062,4.214 3.527,3.75 4.094,3.75 L8.562,3.75 L8.562,2.031 C8.562,1.464 9.027,1 9.594,1 L14.406,1 C14.973,1 15.438,1.464 15.438,2.031 L15.438,3.75 L19.906,3.75 z" fill="currentColor" id="bin"/>
	</G>
</SVG>
);

export const append = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M22.5,23 L19.5,23 C19.224,23 19,22.776 19,22.5 C19,22.224 19.224,22 19.5,22 L22,22 L22,19.5 C22,19.224 22.224,19 22.5,19 C22.775,19 23,19.224 23,19.5 L23,22.5 C23,22.776 22.775,23 22.5,23 z M22.5,17 C22.224,17 22,16.776 22,16.5 L22,13.5 C22,13.224 22.224,13 22.5,13 C22.775,13 23,13.224 23,13.5 L23,16.5 C23,16.776 22.775,17 22.5,17 z M22.5,11 C22.224,11 22,10.776 22,10.5 L22,7.5 C22,7.224 22.224,7 22.5,7 C22.775,7 23,7.224 23,7.5 L23,10.5 C23,10.776 22.775,11 22.5,11 z M22.5,5 C22.224,5 22,4.776 22,4.5 L22,2 L19.5,2 C19.224,2 19,1.776 19,1.5 C19,1.224 19.224,1 19.5,1 L22.5,1 C22.775,1 23,1.224 23,1.5 L23,4.5 C23,4.776 22.775,5 22.5,5 z M16.5,23 L13.5,23 C13.224,23 13,22.776 13,22.5 C13,22.224 13.224,22 13.5,22 L16.5,22 C16.775,22 17,22.224 17,22.5 C17,22.776 16.775,23 16.5,23 z M16.5,2 L13.5,2 C13.224,2 13,1.776 13,1.5 C13,1.224 13.224,1 13.5,1 L16.5,1 C16.775,1 17,1.224 17,1.5 C17,1.776 16.775,2 16.5,2 z M10.5,2 L7.5,2 C7.224,2 7,1.776 7,1.5 C7,1.224 7.224,1 7.5,1 L10.5,1 C10.775,1 11,1.224 11,1.5 C11,1.776 10.775,2 10.5,2 z M4.5,23 L1.5,23 C1.224,23 1,22.776 1,22.5 L1,19.5 C1,19.224 1.224,19 1.5,19 C1.776,19 2,19.224 2,19.5 L2,22 L4.5,22 C4.776,22 5,22.224 5,22.5 C5,22.776 4.776,23 4.5,23 z M4.5,2 L2,2 L2,4.5 C2,4.776 1.776,5 1.5,5 C1.224,5 1,4.776 1,4.5 L1,1.5 C1,1.224 1.224,1 1.5,1 L4.5,1 C4.776,1 5,1.224 5,1.5 C5,1.776 4.776,2 4.5,2 z M1.5,7 C1.776,7 2,7.224 2,7.5 L2,10.5 C2,10.776 1.776,11 1.5,11 C1.224,11 1,10.776 1,10.5 L1,7.5 C1,7.224 1.224,7 1.5,7 z M1.5,13 C1.776,13 2,13.224 2,13.5 L2,16.5 C2,16.776 1.776,17 1.5,17 C1.224,17 1,16.776 1,16.5 L1,13.5 C1,13.224 1.224,13 1.5,13 z M7.5,22 L10.5,22 C10.775,22 11,22.224 11,22.5 C11,22.776 10.775,23 10.5,23 L7.5,23 C7.224,23 7,22.776 7,22.5 C7,22.224 7.224,22 7.5,22 z" fill="currentColor" id="frame" opacity="0.5"/>
		<Path d="M18.562,10.25 L13.75,10.25 L13.75,5.438 C13.75,5.196 13.554,5 13.312,5 L10.688,5 C10.446,5 10.25,5.196 10.25,5.438 L10.25,10.25 L5.438,10.25 C5.196,10.25 5,10.446 5,10.688 L5,13.312 C5,13.554 5.196,13.75 5.438,13.75 L10.25,13.75 L10.25,18.562 C10.25,18.804 10.446,19 10.688,19 L13.312,19 C13.554,19 13.75,18.804 13.75,18.562 L13.75,13.75 L18.562,13.75 C18.804,13.75 19,13.554 19,13.312 L19,10.688 C19,10.446 18.804,10.25 18.562,10.25 z" fill="currentColor" id="plus"/>
	</G>
</SVG>
);

// Front-end icons

export const flag = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M16 3H8C6.346 3 5 4.273 5 5.837v13.24c0 .486.104.895.308 1.216.564.884 1.815.953 2.813.007l3.172-3c.375-.353 1.039-.353 1.414 0l3.172 3c.491.465 1.002.7 1.52.7.797 0 1.601-.595 1.601-1.923V5.837C19 4.273 17.654 3 16 3zM8 4.891h8c.551 0 1 .425 1 .946v9.368l-2.451-2.125c-1.406-1.219-3.693-1.219-5.099 0L7 15.205V5.837c0-.521.449-.946 1-.946zm6.121 11.072A3.068 3.068 0 0 0 12 15.135c-.803 0-1.556.295-2.121.828L7 18.686v-2.198l3.126-2.711c1.033-.895 2.714-.895 3.747 0L17 16.488v2.198l-2.879-2.723z" fill="currentColor" id="flag"/>
	</G>
</SVG>
);

export const mail = (
<SVG
	width="24"
	height="24"
	viewBox="0 0 24 24"
	xmlns="http://www.w3.org/2000/svg"
>
	<G>
		<Path d="M19 5.5H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zm-9.684 7.316l1.602 1.4c.305.266.691.398 1.082.398.391 0 .777-.133 1.082-.398l1.602-1.4-.037.037 3.646 3.646H5.707l3.646-3.646-.037-.037zM5 15.793V9.04l3.602 3.151L5 15.793zm10.398-3.602L19 9.04v6.75l-3.602-3.599zM19 7.5v.21l-6.576 5.754a.68.68 0 0 1-.848 0L5 7.71V7.5h14z" fill="currentColor" id="mail"/>
	</G>
</SVG>
);




// export const close = (
// <SVG
// 	width="20"
// 	height="20"
// 	viewBox="0 0 20 20"
// 	xmlns="http://www.w3.org/2000/svg"
// >
// 	<Path d="M14.95 6.46L11.41 10l3.54 3.54-1.41 1.41L10 11.42l-3.53 3.53-1.42-1.42L8.58 10 5.05 6.47l1.42-1.42L10 8.58l3.54-3.53z" />
// </SVG>
// );

// export const leftArrow = (
// <SVG
// 	width="18"
// 	height="18"
// 	viewBox="0 0 18 18"
// 	xmlns="http://www.w3.org/2000/svg"
// >
// 	<Path d="M5 8.70002L10.6 14.4L12 12.9L7.8 8.70002L12 4.50002L10.6 3.00002L5 8.70002Z" />
// </SVG>
// );
//
// export const rightArrow = (
// <SVG
// 	width="18"
// 	height="18"
// 	viewBox="0 0 18 18"
// 	xmlns="http://www.w3.org/2000/svg"
// >
// 	<Path d="M13 8.7L7.4 3L6 4.5L10.2 8.7L6 12.9L7.4 14.4L13 8.7Z" />
// </SVG>
// );
//
// export const link = (
// 	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24">
// 		<Path d="M17.74 2.76c1.68 1.69 1.68 4.41 0 6.1l-1.53 1.52c-1.12 1.12-2.7 1.47-4.14 1.09l2.62-2.61.76-.77.76-.76c.84-.84.84-2.2 0-3.04-.84-.85-2.2-.85-3.04 0l-.77.76-3.38 3.38c-.37-1.44-.02-3.02 1.1-4.14l1.52-1.53c1.69-1.68 4.42-1.68 6.1 0zM8.59 13.43l5.34-5.34c.42-.42.42-1.1 0-1.52-.44-.43-1.13-.39-1.53 0l-5.33 5.34c-.42.42-.42 1.1 0 1.52.44.43 1.13.39 1.52 0zm-.76 2.29l4.14-4.15c.38 1.44.03 3.02-1.09 4.14l-1.52 1.53c-1.69 1.68-4.41 1.68-6.1 0-1.68-1.68-1.68-4.42 0-6.1l1.53-1.52c1.12-1.12 2.7-1.47 4.14-1.1l-4.14 4.15c-.85.84-.85 2.2 0 3.05.84.84 2.2.84 3.04 0z" />
// 	</SVG>
// );
//
// export const media = (
// 	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// 		<Path d="m19 5v14h-14v-14h14m0-2h-14c-1.1 0-2 0.9-2 2v14c0 1.1 0.9 2 2 2h14c1.1 0 2-0.9 2-2v-14c0-1.1-0.9-2-2-2z" />
// 		<Path d="m14.14 11.86l-3 3.87-2.14-2.59-3 3.86h12l-3.86-5.14z" />
// 	</SVG>
// );
//
// export const genericGallery = (
// 	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// 		<Path d="M20 4v12H8V4h12m0-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 9.67l1.69 2.26 2.48-3.1L19 15H9zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
// 	</SVG>
// );
//
// export const linkOff = (
// 	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24">
// 		<Path d="M17.74 2.26c1.68 1.69 1.68 4.41 0 6.1l-1.53 1.52c-.32.33-.69.58-1.08.77L13 10l1.69-1.64.76-.77.76-.76c.84-.84.84-2.2 0-3.04-.84-.85-2.2-.85-3.04 0l-.77.76-.76.76L10 7l-.65-2.14c.19-.38.44-.75.77-1.07l1.52-1.53c1.69-1.68 4.42-1.68 6.1 0zM2 4l8 6-6-8zm4-2l4 8-2-8H6zM2 6l8 4-8-2V6zm7.36 7.69L10 13l.74 2.35-1.38 1.39c-1.69 1.68-4.41 1.68-6.1 0-1.68-1.68-1.68-4.42 0-6.1l1.39-1.38L7 10l-.69.64-1.52 1.53c-.85.84-.85 2.2 0 3.04.84.85 2.2.85 3.04 0zM18 16l-8-6 6 8zm-4 2l-4-8 2 8h2zm4-4l-8-4 8 2v2z" />
// 	</SVG>
// );
//
// export const file = (
// 	<SVG viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
// 		<Path d="M9.17 6l2 2H20v10H4V6h5.17M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
// 	</SVG>
// );
//
//
// export const layout = (
// <SVG
// 	width="24"
// 	height="24"
// 	viewBox="0 0 24 24"
// 	xmlns="http://www.w3.org/2000/svg"
// >
// 	<G>
// 		<Path d="M20,13 C21.104,13 22,13.896 22,15 L22,20 C22,21.104 21.104,22 20,22 L4,22 C2.897,22 2,21.104 2,20 L2,15 C2,13.896 2.897,13 4,13 L20,13 M20,15 L16,15 L16,20 L20,20 L20,15 M14,15 L10,15 L10,20 L14,20 L14,15 M8,15 L4,15 L4,20 L8,20 L8,15"/>
// 		<Path d="M4,11 C2.897,11 2,10.104 2,9 L2,4 C2,2.896 2.897,2 4,2 L20,2 C21.104,2 22,2.896 22,4 L22,9 C22,10.104 21.104,11 20,11 L4,11 z M20,4 L10,4 L10,9 L20,9.016 L20,4 z M8,4 L4,4 L4,9 L8,9 L8,4 z"/>
// 	</G>
// </SVG>
// );
