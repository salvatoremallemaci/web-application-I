const dao = require('./dao'); // module for accessing the DB
const { check, validationResult } = require('express-validator'); // validation middleware
const dayjs = require("dayjs");
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

module.exports.useAPIs = function useAPIs(app, isLoggedIn) {

	app.get('/api/top3', async (req, res) => {
		try {
			const listaUtenti = await dao.utenti();
			let top3 = [];

			let vettoreUtenti = [];
			for (const key in listaUtenti) {
				listaUtenti[key].name = key;
				vettoreUtenti.push(listaUtenti[key]);
			}

			vettoreUtenti.sort(function (a, b) {
				if (a.punteggio == b.punteggio) return 0;
				if (a.punteggio > b.punteggio) return -1;
				return 1;
			})

			let best = [];
			for (let i = 0; i < vettoreUtenti.length; i++) {
				let point = vettoreUtenti[i].punteggio;
				if (best.length == 0 || best[best.length - 1].point != point)
					best.push({ point: point, text: vettoreUtenti[i].nickname });
				else
					best[best.length - 1].text += ", " + vettoreUtenti[i].nickname;
			}

			best = best.slice(0, 3);
			let row;
			let position = 0;

			for (u of best) {
				u.rank = ++position;
				row = {
					posizione: u.rank,
					nickname: u.text,
					punteggio: u.point
				}
				top3.push(row);
			}

			res.status(200).json(top3);
		}
		catch (err) {
			console.log(err);
			res.status(500).end();
		}
	});

	app.get('/api/indovinelliAnonimo', async (req, res) => {
		try {
			const indovinelli = await dao.indovinelliAnonimo();
			res.status(200).json(indovinelli);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	app.get('/api/indovinelli/:idAutore', isLoggedIn, async (req, res) => {
		try {
			const id = req.params.idAutore;
			const listaIndovinelli = await dao.indovinelliByAutore(id);
			res.status(200).json(listaIndovinelli);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	app.get('/api/indovinelliInGioco/:idAutore', isLoggedIn, async (req, res) => {
		try {
			const id = req.params.idAutore;
			const listaIndovinelliInGioco = await dao.indovinelliInGioco(id);
			//let autoreIndovinello;
			for (l of listaIndovinelliInGioco){
				if (l.stato === "aperto"){
					l.risposta = undefined;
				}
			}
			res.status(200).json(listaIndovinelliInGioco);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	app.get('/api/indovinello/:idIndovinello', isLoggedIn, async (req, res) => {
		try {
			const id = req.params.idIndovinello;
			const indovinelloInGioco = await dao.indovinelloById(id);
			if( indovinelloInGioco.stato === "aperto"){
				indovinelloInGioco.risposta = undefined;
			}
			res.status(200).json(indovinelloInGioco);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	app.get('/api/risposte', isLoggedIn, async (req, res) => {
		try {
			const listaRisposte = await dao.risposte();
			res.status(200).json(listaRisposte);
		}
		catch (err) {
			res.status(500).end();
		}
	});

	app.post('/api/indovinelli', isLoggedIn, [
		check('domanda').isString(),
		check('difficoltà').notEmpty(),
		check('tempo').isInt({min: 30, max: 600}),
		check('risposta').isString(),
		check('sugg1').isString(),
		check('sugg2').isString(),
		check('stato').notEmpty(),
		check('idAutore').isNumeric({min: 1}),
		check('nicknameAutore').isString()
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		// check su difficoltà, che può essere [facile, medio, difficile]
		if (req.body.difficoltà != "facile" && req.body.difficoltà != "medio" && req.body.difficoltà != "difficile"){
			return res.status(422).json({ error: `Difficoltà inserita non rientra nei valori consentiti [facile,medio,difficile].`});
		}

		// check su stato, che può essere [aperto, chiuso]
		if (req.body.stato != "aperto" && req.body.stato != "chiuso"){
			return res.status(422).json({ error: `Stato inserito non rientra nei valori consentiti [aperto,chiuso].`});
		}
		
		const indovinello = {
			domanda: req.body.domanda,
			difficoltà: req.body.difficoltà,
			tempo: req.body.tempo,
			risposta: req.body.risposta,
			sugg1: req.body.sugg1,
			sugg2: req.body.sugg2,
			stato: req.body.stato,
			idAutore: req.body.idAutore,
			nicknameAutore: req.body.nicknameAutore
		}

		try {
			await dao.nuovoIndovinello(indovinello);
			res.status(201).end();
		} catch (err) {
			res.status(500).json({ error: `Database error during the creation of riddle ${indovinello.domanda}.`});
		}


	})

	app.post('/api/rispostaIndovinello', isLoggedIn, [
		check('risposta').isString(),
		check('idAutore').isNumeric({min: 1}),
		check('idIndovinello').isNumeric({min: 1}),
		check('nicknameAutore').isString()
	], async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}

		// check su risposta non vuota
		if (req.body.risposta === ''){
			return res.status(422).json({ error: `La risposta non può essere vuota.`});
		}
		// check su nickname non vuoto
		if (req.body.nicknameAutore === ''){
			return res.status(422).json({ error: `Il nickname dell'autore della risposta non può essere vuoto.`});
		}

		// verifico le l'utente non abbia già risposto a questo indovinello
		const risposte = await dao.risposte();
		if(risposte.filter((r) => r.idAutore === req.body.idAutore && r.idIndovinello === req.body.idIndovinello).length != 0){
			return res.status(400).json({ error: `${req.body.nicknameAutore} ha già dato la sua risposta a questo indovinello(${req.body.idIndovinello}).`})
		}
		
		// mi ricavo dal DB l'indovinello in questione
		const indovinello = await dao.indovinelloById(req.body.idIndovinello);
		
		// Verifico se l'indovinello è ancora aperto e se il timer non è scaduto
		// (Un indovinello si può chiudere se scade il tempo oppure a seguito di una risposta corretta)

		const timer = Math.round(dayjs.duration({ seconds: indovinello.tempo }).subtract(dayjs.duration(dayjs() - dayjs(indovinello.tempoInizio))).asSeconds());
		if(timer <= 0 || indovinello.stato != "aperto"){
			return res.status(400).json({ error: `Non sono ammesse ulteriori risposte, l'indovinello è chiuso!`});
		}
		// verifico la correttezza della risposta inviata, gestita lato server per non dare visibilità al client
		
		// mi ricavo dal DB la risposta giusta dell'indovinello in questione
		const rispostaCorretta = await dao.rispostaByIdIndovinello(req.body.idIndovinello);

		let punteggio_risposta;

		if ( req.body.risposta === rispostaCorretta.risposta){
            // chiudi indovinello
            if (indovinello.difficoltà === "facile"){
                punteggio_risposta = 1;
            } else if(indovinello.difficoltà === "medio"){
                punteggio_risposta = 2;
            } else if(indovinello.difficoltà === "difficile"){
                punteggio_risposta = 3;
            }
		// essendo la risposta giusta, chiudo anche l'indovinello!
		await dao.chiudiIndovinello("chiuso", req.body.idIndovinello);	
        
		// essendo la risposta giusta, aggiorno anche lo score dell'utente in questione
		const utente = await dao.utenteById(req.body.idAutore);
		const vecchioPunteggio = utente.punteggio;
		const nuovoPunteggio = vecchioPunteggio + punteggio_risposta;
		await dao.aggiornaPunteggio(nuovoPunteggio, req.body.idAutore);

        } else {
			// risposta sbagliata
            punteggio_risposta = 0;
        }

		const risposta = {
			risposta: req.body.risposta,
			idAutore: req.body.idAutore,
			idIndovinello: req.body.idIndovinello,
			nicknameAutore: req.body.nicknameAutore,
			punteggio: punteggio_risposta
		}

		try {
			await dao.nuovaRisposta(risposta);
			res.status(201).json(risposta.punteggio).end();
		} catch (err) {
			res.status(500).json({ error: `Database error during the creation of answer ${risposta.risposta}.`});
		}


	})


	// chiudi Indovinello
	app.put('/api/indovinello/:idIndovinello', isLoggedIn, async (req, res) => { 
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		
		const id = req.params.idIndovinello;

		try {
			await dao.chiudiIndovinello("chiuso", id);
			res.status(200).end();
		} catch (err) {
			res.status(500).json({ error: `Database error during the closure of the riddle ${id}.`});
		}
	
	})

	// imposta tempo di inizio dell'indovinello
	app.put('/api/indovinellotempoInizio/:idIndovinello', isLoggedIn, async (req, res) => { 
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(422).json({ errors: errors.array() });
		}
		const id = req.params.idIndovinello;

		const tempoInizio = {
			tempoInizio: req.body.tempoInizio
		}

		try {
			await dao.impostaTempoInizio(tempoInizio.tempoInizio, id);
			res.status(200).end();
		} catch (err) {
			res.status(500).json({ error: `Database error during the set of start time of the riddle ${id}.`});
		}
	
	})


}