/**
 * All the API calls
 */

const dayjs = require("dayjs");
const APIURL = new URL('http://localhost:3001/api/');

async function getTop3() {
	const response = await fetch(new URL('top3', APIURL));
	const top3 = await response.json();
	if (response.ok) {
		return top3.map((u) => ({ posizione: u.posizione, nickname: u.nickname, punteggio: u.punteggio }))
	} else {
		throw top3;	   // an object with the error coming from the server
	}
}

async function getIndovinelliAnonimo() {
	// call /api/indovinelliAnonimo
	const response = await fetch(new URL('indovinelliAnonimo', APIURL));
	const indovinelli = await response.json();
	if (response.ok) {
		return indovinelli.map((u) => ({ domanda: u.domanda, difficoltà: u.difficoltà, stato: u.stato }))
	} else {
		throw indovinelli;
	}
}

async function getIndovinelliByAutore(idAutore) {
	// call /api/indovinelli/:idAutore
	const response = await fetch(new URL('indovinelli/' + idAutore, APIURL), { credentials: 'include' });
	const indovinelli = await response.json();
	if (response.ok) {
		return indovinelli.map((u) => ({
			id: u.id,
			domanda: u.domanda,
			difficoltà: u.difficoltà,
			tempo: u.tempo,
			risposta: u.risposta,
			sugg1: u.sugg1,
			sugg2: u.sugg2,
			stato: u.stato,
			idAutore: u.idAutore,
			nicknameAutore: u.nicknameAutore,
			tempoInizio: u.tempoInizio
		}))
	} else {
		return false;
	}
}

async function getIndovinelliInGioco(idUtente) {
	// call /api/indovinelliInGioco/:idAutore
	const response = await fetch(new URL('indovinelliInGioco/' + idUtente, APIURL), { credentials: 'include' });
	const indovinelli = await response.json();
	if (response.ok) {
		return indovinelli.map((u) => ({
			id: u.id,
			domanda: u.domanda,
			difficoltà: u.difficoltà,
			tempo: u.tempo,
			stato: u.stato,
			idAutore: u.idAutore,
			nicknameAutore: u.nicknameAutore,
			risposta: u.risposta,
			sugg1: u.sugg1,
			sugg2: u.sugg2,
			tempoInizio: u.tempoInizio
		}))
	} else {
		return false;
	}
}

async function getIndovinelloInGioco(idIndovinello) {
	// call /api/indovinello/:idIndovinello
	const response = await fetch(new URL('indovinello/' + idIndovinello, APIURL), { credentials: 'include' });
	const indovinello = await response.json();
	if (response.ok) {
		return indovinello;
	} else {
		return false;
	}
}

async function getRisposte() {
	// call /api/risposte
	const response = await fetch(new URL('risposte', APIURL), { credentials: 'include' });
	const risposte = await response.json();
	if (response.ok) {
		return risposte.map((u) => ({
			id: u.id,
         	risposta: u.risposta, 
         	idAutore: u.idAutore,
         	idIndovinello: u.idIndovinello,
         	nickname: u.nickname,
         	punteggio: u.punteggio
		}))
	} else {
		return false;
	}
}

async function addIndovinello(indovinello) {
	const indovinello_json = JSON.stringify({
		domanda: indovinello.domanda,
		difficoltà: indovinello.difficoltà,
		tempo: indovinello.tempo,
		risposta: indovinello.risposta,
		sugg1: indovinello.sugg1,
		sugg2: indovinello.sugg2,
		stato: indovinello.stato,
		idAutore: indovinello.idAutore,
		nicknameAutore: indovinello.nicknameAutore,
		tempoInizio: null
	});

	// call: POST /api/indovinelli
	return new Promise((resolve, reject) => {
		fetch(new URL('indovinelli', APIURL), {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: indovinello_json,
		}).then((response) => {
			if (response.ok) {
				resolve(null);
			} else {
				// analyze the cause of error
				response.json()
					.then((message) => { reject(message); }) // error message in the response body
					.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
			}
		}).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}

async function addRisposta(risposta) {
	const risposta_json = JSON.stringify({
		risposta: risposta.risposta,
		idAutore: risposta.idAutore,
		idIndovinello: risposta.idIndovinello,
		nicknameAutore: risposta.nicknameAutore
	});

	// call: POST /api/rispostaIndovinello
	return new Promise((resolve, reject) => {
		fetch(new URL('rispostaIndovinello', APIURL), {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: risposta_json,
		}).then((response) => {
			if (response.ok) {
				resolve(response.json());
			} else {
				resolve("errore");
				// analyze the cause of error
				response.json()
					.then((message) => { reject(message); }) // error message in the response body
					.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
			}
		}).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}

async function chiudiIndovinello(idIndovinello) {
	// call: PUT /api/indovinello/:idIndovinello
	return new Promise((resolve, reject) => {
		fetch(new URL('indovinello/' + idIndovinello, APIURL), {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			}
		}).then((response) => {
			if (response.ok) {
				resolve(null);
			} else {
				// analyze the cause of error
				response.json()
					.then((message) => { reject(message); }) // error message in the response body
					.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
			}
		}).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}

// call: PUT /api/indovinellotempoInizio/:idIndovinello
async function impostaTempoInizio(idIndovinello, tempoInizio) {
	const tempoInizio_json = JSON.stringify({
		tempoInizio: dayjs(tempoInizio)
	});
	return new Promise((resolve, reject) => {
		fetch(new URL('indovinellotempoInizio/' + idIndovinello, APIURL), {
			method: 'PUT',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json',
			},
			body: tempoInizio_json
		}).then((response) => {
			if (response.ok) {
				resolve(null);
			} else {
				// analyze the cause of error
				response.json()
					.then((message) => { reject(message); }) // error message in the response body
					.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
			}
		}).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
}

async function logIn(credentials) {
	let response = await fetch(new URL('sessions', APIURL), {
		method: 'POST',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(credentials),
	});
	if (response.ok) {
		const user = await response.json();
		return user;
	} else {
		const errDetail = await response.json();
		throw errDetail.message;
	}
}

async function logOut() {
	await fetch(new URL('sessions/current', APIURL), { method: 'DELETE', credentials: 'include' });
}

async function getUserInfo() {
	const response = await fetch(new URL('sessions/current', APIURL), { credentials: 'include' });
	const userInfo = await response.json();
	if (response.ok) {
		return userInfo;
	} else {
		throw userInfo;  // an object with the error coming from the server
	}
}





const API = { logIn, logOut, getUserInfo, getTop3, getIndovinelliAnonimo, getIndovinelliByAutore, addIndovinello, getIndovinelliInGioco, getRisposte, chiudiIndovinello, impostaTempoInizio, addRisposta, getIndovinelloInGioco };
export default API;