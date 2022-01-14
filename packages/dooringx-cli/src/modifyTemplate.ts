import MetalSmith from 'metalsmith';
import { ejs } from 'consolidate';
import { promisify } from 'util';
import * as path from 'path';

/**
 *
 * @param {*} fromPath 源路径
 * @param {*} toPath 目标路径
 */
async function handleTemplate(fromPath: string, toPath: string, config: any) {
	await new Promise((resovle, reject) => {
		MetalSmith(__dirname)
			.source(fromPath)
			.destination(path.join(path.resolve(), toPath))
			.use(async (_files, metal, done) => {
				let result = {
					license: 'MIT',
					version: '0.0.1',
					...config,
				};
				const data = metal.metadata();
				Object.assign(data, result);
				//@ts-ignore
				done();
			})
			.use((files, metal, done) => {
				Object.keys(files).forEach(async (file) => {
					let content = files[file].contents.toString();
					if (
						file.includes('.js') ||
						file.includes('.json') ||
						file.includes('.txt') ||
						file.includes('.md')
					) {
						if (content.includes('<%')) {
							let { render } = ejs;
							//@ts-ignore
							render = promisify(render);
							try {
								content = await render(content, metal.metadata());
							} catch (e) {
								console.log(e);
							}
							files[file].contents = Buffer.from(content);
						}
					}
				});
				//@ts-ignore
				done();
			})
			.build((err) => {
				if (!err) {
					resovle(true);
				} else {
					console.log(err);
					reject(false);
				}
			});
	});
}

export default handleTemplate;
