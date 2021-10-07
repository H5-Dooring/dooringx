/*
 * @Author: yehuozhili
 * @Date: 2021-09-30 09:51:40
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-10-07 13:18:49
 * @FilePath: \dooringx\packages\dooringx-plugin-template\template\rollup.config.js
 */
import { DEFAULT_EXTENSIONS } from "@babel/core";
import babel from "@rollup/plugin-babel";
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import postcss from "rollup-plugin-postcss";
import resolve from "@rollup/plugin-node-resolve";
import url from "@rollup/plugin-url";
import svgr from "@svgr/rollup";
import { terser } from "rollup-plugin-terser";
import typescriptEngine from "typescript";
import external from "rollup-plugin-peer-deps-external";
const externalPkg = ["react", "react-dom"];
const externals = (id) => externalPkg.some((e) => id.indexOf(e) === 0);

export default {
	input: "./src/index.tsx",
	output: [
		{
			file: "dist/index.js",
			format: "umd",
			name: "DOORINGXPLUGIN",
			globals: { react: "React", "react-dom": "ReactDom" },
			freeze: false,
			exports: "default",
		},
	],
	onwarn: function (warning) {
		// Skip certain warnings
		// should intercept ... but doesn't in some rollup versions
		if (warning.code === "THIS_IS_UNDEFINED") {
			return;
		}
		// console.warn everything else
		console.warn(warning.message);
	},
	plugins: [
		postcss({
			modules: true, //cssmodule
			plugins: [],
			minimize: true,
		}),
		external({
			includeDependencies: true,
		}),
		typescript({
			typescript: typescriptEngine,
			include: ["*.js+(|x)", "**/*.js+(|x)"],
			exclude: [
				"coverage",
				"config",
				"dist",
				"node_modules/**",
				"*.test.{js+(|x), ts+(|x)}",
				"**/*.test.{js+(|x), ts+(|x)}",
			],
		}),
		commonjs({
			sourceMap: true,
		}),
		babel({
			extensions: [...DEFAULT_EXTENSIONS, ".ts", "tsx"],
			babelHelpers: "runtime",
			exclude: /node_modules/,
			skipPreflightCheck: true,
		}),
		url(),
		svgr(),
		resolve(),
		terser(),
	],
	external: externals,
};
