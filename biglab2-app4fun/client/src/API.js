/**
 * All the API calls
 */

const dayjs = require("dayjs");
const APIURL = new URL('http://localhost:3001/api/')

async function getAllFilms() {
	// call  /api/films
	const response = await fetch(new URL('films', APIURL), {credentials: 'include'});
	const examsJson = await response.json();
	if (response.ok) {
		return examsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating, user: f.user }))
	} else {
		return false;
	}
}

async function getFavorites() {
	// call  /api/films/favorites
	const response = await fetch(new URL('films/favorites', APIURL), {credentials: 'include'});
	const examsJson = await response.json();
	if (response.ok) {
		return examsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating, user: f.user }))
	} else {
		return false;
	}
}

async function getBestRated() {
	// call  /api/films/bestrated
	const response = await fetch(new URL('films/bestrated', APIURL), {credentials: 'include'});
	const examsJson = await response.json();
	if (response.ok) {
		return examsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating, user: f.user }))
	} else {
		return false;
	}
}

async function getSeenLastMonth() {
	// call  /api/films/seenlastmonth
	const response = await fetch(new URL('films/seenlastmonth', APIURL), {credentials: 'include'});
	const examsJson = await response.json();
	if (response.ok) {
		return examsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating, user: f.user }))
	} else {
		return false;
	}
}

async function getUnseen() {
	// call  /api/films/unseen
	const response = await fetch(new URL('films/unseen', APIURL), {credentials: 'include'});
	const examsJson = await response.json();
	if (response.ok) {
		return examsJson.map((f) => ({ id: f.id, title: f.title, favorite: f.favorite, watchdate: dayjs(f.watchdate), rating: f.rating, user: f.user }))
	} else {
		return false;
	}
}

async function addFilm(film) {
	const film_json = film.watchdate?.isValid() ?
		JSON.stringify({ title: film.title, favorite: film.favorite, watchdate: film.watchdate.format('YYYY-MM-DD'), rating: film.rating, user: film.user })
		: JSON.stringify({ title: film.title, favorite: film.favorite, rating: film.rating, user: film.user });

	// call: POST /api/films
	return new Promise((resolve, reject) => {
	  fetch(new URL('films', APIURL), {
		method: 'POST',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: film_json,
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

  function updateFilm(film) {
	  const film_json = film.watchdate?.isValid() ?
		  JSON.stringify({ title: film.title, favorite: film.favorite, watchdate: film.watchdate.format('YYYY-MM-DD'), rating: film.rating, user: film.user })
		  : JSON.stringify({ title: film.title, favorite: film.favorite, rating: film.rating, user: film.user });

	// call: PUT /api/film/:id
	return new Promise((resolve, reject) => {
	  fetch(new URL('film/' + film.id, APIURL), {
		method: 'PUT',
		credentials: 'include',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: film_json,
	  }).then((response) => {
		if (response.ok) {
		  resolve(null);
		} else {
		  // analyze the cause of error
		  response.json()
			.then((obj) => { reject(obj); }) // error message in the response body
			.catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
		}
	  }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
	});
  }

  function deleteFilm(id) {
	// call: DELETE /api/films/:id
	return new Promise((resolve, reject) => {
	  fetch(new URL('films/' + id, APIURL), {
		method: 'DELETE',
		credentials: 'include'
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
	const response = await fetch(new URL('sessions/current', APIURL), {credentials: 'include'});
	const userInfo = await response.json();
	if (response.ok) {
	  return userInfo;
	} else {
	  throw userInfo;  // an object with the error coming from the server
	}
  }

const API = { getAllFilms, getFavorites, getBestRated, getSeenLastMonth, getUnseen, addFilm, updateFilm, deleteFilm, logIn, logOut, getUserInfo };
export default API;