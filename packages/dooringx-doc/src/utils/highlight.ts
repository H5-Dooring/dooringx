/*
 * @Author: yehuozhili
 * @Date: 2021-06-30 19:20:22
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-06-30 21:22:04
 * @FilePath: \my-app\src\utils\highlight.ts
 */
import { langs } from './markdown';
import PrismJS from 'prismjs';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-diff.js';
import 'prism-svelte';

export function highlight(source, lang) {
	const plang = langs[lang] || '';
	const highlighted = plang
		? PrismJS.highlight(source, PrismJS.languages[plang], lang)
		: source.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

	return `<pre class='language-${plang}'><code>${highlighted}</code></pre>`;
}
