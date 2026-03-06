import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig } from 'eslint/config'

export default defineConfig([
	{
		files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		plugins: { js },
		extends: ['js/recommended'],
		languageOptions: { globals: globals.browser },
	},
	...tseslint.configs.recommended.map((config) => ({
		...config,
		files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
	})),
	pluginReact.configs.flat.recommended,
	reactHooks.configs.flat['recommended-latest'],
	{
		files: ['src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
		rules: {
			'prefer-const': 'error',
			'react/prop-types': 'off',
			'react/react-in-jsx-scope': 'off',
			'no-undef': 'off',
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					ignoreRestSiblings: true,
				},
			],
			'no-restricted-syntax': [
				'error',
				{
					selector: 'Literal[value=/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/]',
					message:
						'Hex codes are not allowed. Colors should be defined in the theme, and this should be used instead. For example, use Tailwind color classes or CSS variables.',
				},
				{
					selector: 'Literal[value=/^(rgb|hsl)a?\\(.*\\)$/i]',
					message:
						'RGB, RGBA, HSL, and HSLA color formats are not allowed. Colors should be defined in the theme, and this should be used instead. For example, use Tailwind color classes or CSS variables.',
				},
				{
					selector:
						'Literal[value=/^(aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|aliceblue|antiquewhite|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|gray|grey|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen)$/i]',
					message:
						'Named colors are not allowed. Colors should be defined in the theme, and this should be used instead. For example, use Tailwind color classes or CSS variables.',
				},
			],
			'no-console': 'error',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	},
	{
		ignores: ['node_modules', 'dist', '.tanstack', '.vscode', '.yarn', 'public', '*.config.js', '*.config.ts'],
	},
])
