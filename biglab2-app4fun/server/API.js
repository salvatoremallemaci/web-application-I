const dao = require('./dao'); // module for accessing the DB
const { check, validationResult } = require('express-validator'); // validation middleware

module.exports.useAPIs = function useAPIs(app, isLoggedIn) {

	// GET /api/films
	// Get all films
	app.get('/api/films', isLoggedIn, async (req, res) => {
		try {
			const filmList = await dao.getFilmsList('all', req.user.id);
			res.status(200).json(filmList);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	// GET /api/films/<filter>
	// Get films according to filter
	app.get('/api/films/:filter', isLoggedIn, async (req, res) => {
		const filter = req.params.filter;

		if (filter != 'all' && filter != 'favorites' && filter != 'bestrated' && filter != 'seenlastmonth' && filter != 'unseen')
			res.status(400).end();

		try {
			const filmList = await dao.getFilmsList(filter, req.user.id);
			res.status(200).json(filmList);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	// GET /api/film/<id>
	// Get a film by id
	app.get('/api/film/:id', isLoggedIn, [
		check('id').isNumeric({ min: 1 })
	],
		async (req, res) => {
			const errors = validationResult(req);
			if (!errors.isEmpty())
				return res.status(422).json({ errors: errors.array() });

			const id = req.params.id;

			try {
				const result = await dao.getFilm(id);
				if (result.error)
					res.status(404).json(result);
				else
					res.json(result);
			} catch (err) {
				res.status(500).end();
			}
		});

	// POST /api/films
	// Create a new film
	app.post('/api/films', isLoggedIn, [
		check('title').isString(),
		check('favorite').isBoolean(),
		check('watchdate').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }),
		check('rating').isInt({ min: 0, max: 5 }),
		check('user').isNumeric({ min: 1 })
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		const film = {
			title: req.body.title,
			favorite: req.body.favorite,
			watchdate: req.body.watchdate ?? 'NULL',	// se watchdate è undefined la imposta a NULL
			rating: req.body.rating,
			user: req.user.id,
		};

		try {
			await dao.createFilm(film);
			res.status(201).end();
		} catch (err) {
			res.status(500).json({ error: `Database error during the creation of film ${film.title}.` });
		}
	});


	// PUT /api/film/<id>
	// Update a film
	app.put('/api/film/:id', isLoggedIn, [
		check('id').isNumeric(),
		check('title').optional().isString(),
		check('favorite').optional().isBoolean(),
		check('watchdate').optional().isDate({ format: 'YYYY-MM-DD', strictMode: true }),
		check('rating').optional().isInt({ min: 0, max: 5 }),
		check('user').optional().isNumeric({ min: 1 })
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty())
			return res.status(422).json({ errors: errors.array() });

		const id = req.params.id;

		try {
			let result = await dao.getFilm(id);
			if (result.error)
				res.status(404).json(result);
			else {
				const film = {
					id: id,
					title: req.body.title,
					favorite: req.body.favorite,
					watchdate: req.body.watchdate ?? 'NULL',	// se watchdate è undefined la imposta a NULL
					rating: req.body.rating,
					user: req.user.id
				};

				result = await dao.updateFilm(film);
				res.status(200).end();
			}
		} catch (err) {
			res.status(500).end();
		}
	});

	// DELETE /api/films/<id>
	app.delete('/api/films/:id', isLoggedIn, [
		check('id').isNumeric({ min: 1 })
	],
		async (req, res) => {
			try {
				await dao.deleteFilm(req.params.id);
				res.status(204).end();
			} catch (err) {
				res.status(500).end();
			}
		});

}