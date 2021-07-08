import fs from 'fs';
import path from 'path';
import marked from 'marked';
import { extract_frontmatter } from '../../utils/markdown';
import { highlight } from '../../utils/highlight';
import slugf from 'slug';

export interface MarkDownItemProps {
	html: string;
	metadata: Record<string, string>;
	subsections: { slug: string; title: string; level: string }[];
	slug: string;
	file: string;
	order: number;
	sTitle: string;
}

export async function api(name: string) {
	const res = await getMarkDown(name);
	return {
		status: 200,
		body: res,
	};
}

const blockTypes = [
	'blockquote',
	'html',
	'heading',
	'hr',
	'list',
	'listitem',
	'paragraph',
	'table',
	'tablerow',
	'tablecell',
];

export const getMarkDown = (name: string) => {
	const root = process.cwd();
	const docPath = path.resolve(root, 'src', name);
	return fs
		.readdirSync(docPath)
		.filter((file) => file[0] !== '.' && path.extname(file) === '.md')
		.map((file) => {
			const currentFilePath = path.resolve(docPath, file);
			const markdown = fs.readFileSync(currentFilePath, 'utf-8');
			const { content, metadata } = extract_frontmatter(markdown);
			const order = parseFloat(metadata.order);
			const sTitle = metadata.sTitle;
			const subsections = [];
			const section_slug = slugf(metadata.title, '_');
			const renderer = new marked.Renderer();
			let block_open = false;

			renderer.hr = () => {
				block_open = true;

				return '<div class="side-by-side"><div class="copy">';
			};

			renderer.code = (source, lang) => {
				source = source.replace(/^ +/gm, (match) => match.split('    ').join('\t'));
				let prefix = '';
				let className = 'code-block';
				const html = `<div class='${className}'>${prefix}${highlight(source, lang)}</div>`;
				if (block_open) {
					block_open = false;
					return `</div><div class="code">${html}</div></div>`;
				}

				return html;
			};
			// 这个heading是md的标题
			renderer.heading = (text, level, rawtext) => {
				let slug;
				const match = /<a href="([^"]+)"[^>]*>(.+)<\/a>/.exec(text); // 提取a标签，链接为slug
				if (match) {
					slug = match[1];
					text = match[2];
				} else {
					slug = slugf(rawtext, '_');
				}

				if (level === 1 || level === 2 || level === 3 || level === 4) {
					const title = text
						.replace(/<\/?code>/g, '')
						.replace(/\.(\w+)(\((.+)?\))?/, (m, $1, $2, $3) => {
							if ($3) return `.${$1}(...)`;
							if ($2) return `.${$1}()`;
							return `.${$1}`;
						});

					subsections.push({ slug, title, level });
				}

				return `
					<h${level + 1}>
						<span  id="${slug}"  ></span>
						<a  href="docs#${slug}" class="anchor" aria-hidden="true"></a>
						${text}
					</h${level + 1}>`;
			};

			blockTypes.forEach((type) => {
				const fn = renderer[type];
				renderer[type] = function () {
					return fn.apply(this, arguments);
				};
			});

			const html = marked(content, { renderer });

			const hashes = {};
			return {
				html: html.replace(/@@(\d+)/g, (m, id) => hashes[id] || m),
				metadata,
				subsections,
				slug: section_slug,
				order,
				file,
				sTitle,
			};
		})
		.sort((a, b) => a.order - b.order);
};
