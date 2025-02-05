//import * as http from 'http';
import Express from 'express';
import * as FS from 'fs';
import * as Path from 'path';

type P<D, F> = (directory: D, file: F) => string;

const app: Express.Express = Express();
const path: P<string, string> = (directory, file) =>
	Path.join(Path.resolve(), directory, file);

app.get(
	'/',
	(
		req: Express.Request<{}, any, any, Record<string, any>>,
		res: Express.Response<any, Record<string, any>>
	) => {
		res.send('Home Page');
	}
);

app.get(
	'/about',
	(
		req: Express.Request<{}, any, any, Record<string, any>>,
		res: Express.Response<any, Record<string, any>>
	) => {
		FS.readFile(
			path('public', 'data.txt'),
			'utf-8',
			(err: NodeJS.ErrnoException | null, data: string) => {
				if (err) {
					console.error('Error membaca file:', err);
					return res.status(500).send('Gagal membaca file');
				}
				console.log(data);
				res.send(data);
			}
		);
	}
);

app.get(
	'/up_contact',
	(
		req: Express.Request<{}, any, any, Record<string, any>>,
		res: Express.Response<any, Record<string, any>>
	) => {
		res.send('Contact Page');
	}
);

app.get(
	'/up_contact/:id',
	(
		req: Express.Request<{}, any, any, Record<string, any>>,
		res: Express.Response<any, Record<string, any>>
	) => {
		const { id } = req.params as Record<string, any>;
		if (!Number(id) || Number(id) <= 0) {
			res.status(400).send('invalid id');
		} else
			FS.writeFile(
				path('public', 'data.txt'),
				id,
				(err: NodeJS.ErrnoException | null) => {
					if (err) {
						console.error('Error menulis file:', err);
						return res.status(500).send('Gagal menulis file');
					}
					FS.readFile(
						path('public', 'data.txt'),
						'utf-8',
						(err: NodeJS.ErrnoException | null, data: string) => {
							if (err) {
								console.error('Error membaca file:', err);
								return res
									.status(500)
									.send('Gagal membaca file');
							}
							console.log(data);
							res.send(data);
						}
					);
				}
			);
	}
);

app.listen(8000, 'localhost', () => {
	console.log('server start....');
});

// const server = http.createServer((req, res) => {
// 	console.log(req.url);

// 	if (req.url === '/about') {
// 		res.end('About Page');
// 	} else if (req.url === '/contact') {
// 		res.end('Contact Page');
// 	} else {
// 		res.end('Home Page');
// 	}
// });

// server.listen(8000, 'localhost', () => {
// 	console.log('server start....');
// });
