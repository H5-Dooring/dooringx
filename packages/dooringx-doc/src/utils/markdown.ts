/*
 * @Author: yehuozhili
 * @Date: 2021-06-30 19:09:39
 * @LastEditors: yehuozhili
 * @LastEditTime: 2021-07-06 14:19:17
 * @FilePath: \my-app\src\utils\markdown.ts
 */
export function extract_frontmatter(markdown) {
	const match = /---\r?\n([\s\S]+?)\r?\n---/.exec(markdown);
	let content = '';
	let metadata: Record<string, string> = {};
	if (match) {
		const frontMatter = match[1];
		content = markdown.slice(match[0].length);

		metadata = {};
		frontMatter.split('\n').forEach((pair) => {
			// split on the colon
			const colonIndex = pair.indexOf(':');
			let value = pair.slice(colonIndex + 1).trim();
			// if surrounded by double quotes then remove those quotes
			if (value && value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
				value = value.substring(1, value.length - 1);
			}
			metadata[pair.slice(0, colonIndex).trim()] = value;
		});
	}

	return { metadata, content };
}

// map lang to prism-language-attr
export const langs = {
	bash: 'bash',
	html: 'markup',
	sv: 'svelte',
	js: 'javascript',
	css: 'css',
	diff: 'diff',
};

// links renderer
export function link_renderer(href, title, text) {
	let target_attr = '';
	let title_attr = '';

	if (href.startsWith('http')) {
		target_attr = ' target="_blank"';
	}

	if (title !== null) {
		title_attr = ` title="${title}"`;
	}

	return `<a href="${href}"${target_attr}${title_attr} rel="noopener noreferrer">${text}</a>`;
}
