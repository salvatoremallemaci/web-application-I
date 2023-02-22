'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');
// const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('indovinelli.sqlite', (err) => {
    if(err) throw err;
  });

exports.utenti = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS ';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const utenti = rows.map((u) => ({ email: u.email, nickname: u.name, punteggio: u.score }));
      resolve(utenti);
    });
  });
}

exports.utenteById = (idUtente) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM USERS WHERE id = ?';
    db.all(sql, [idUtente], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const utente = rows.map((u) => ({
         id: u.id,
         email: u.email, 
         nickname: u.name, 
         punteggio: u.score 
        }));
      resolve(utente[0]);
    });
  });
}

// ordino gli indovinelli in modo tale che veda prima quelli aperti, poi quelli chiusi

exports.indovinelliAnonimo = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT question, difficulty, state FROM RIDDLE ORDER BY state';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const indovinelli = rows.map((u) => ({ domanda: u.question, difficoltà: u.difficulty, stato: u.state }));
      resolve(indovinelli);
    });
  });
}

exports.indovinelloById = (idIndovinello) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RIDDLE WHERE id = ?';
    db.all(sql, [idIndovinello], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const indovinelli = rows.map((u) => ({
         id: u.id,
         domanda: u.question, 
         difficoltà: u.difficulty,
         tempo: u.time,
         risposta: u.answer,
         sugg1: u.hint1,
         sugg2: u.hint2, 
         stato: u.state,
         idAutore: u.author,
         nicknameAutore: u.nicknameAuthor,
         tempoInizio: u.startTime
        }));
      resolve(indovinelli[0]);
    });
  });
}

// ordino gli indovinelli in modo tale che veda prima quelli aperti, poi quelli chiusi e in ordine di tempo totale
exports.indovinelliByAutore = (idAutore) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RIDDLE WHERE author = ? ORDER BY state, time ASC';
    db.all(sql, [idAutore], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const indovinelli = rows.map((u) => ({
         id: u.id,
         domanda: u.question, 
         difficoltà: u.difficulty,
         tempo: u.time,
         risposta: u.answer,
         sugg1: u.hint1,
         sugg2: u.hint2, 
         stato: u.state,
         idAutore: u.author,
         nicknameAutore: u.nicknameAuthor, 
         tempoInizio: u.startTime 
        }));
      resolve(indovinelli);
    });
  });
}

exports.aggiornaPunteggio = (punteggio, idUtente) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE USERS SET score = ? WHERE id = ?';
    db.run(sql, [punteggio, idUtente], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

// restituisce tutti gli indovinelli, tranne quelli creati dall'utente loggato
exports.indovinelliInGioco = (idAutore) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM RIDDLE WHERE author != ? ORDER BY state, time ASC';
    db.all(sql, [idAutore], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const indovinelli = rows.map((u) => ({
         id: u.id,
         domanda: u.question, 
         difficoltà: u.difficulty,
         tempo: u.time,
         stato: u.state,
         idAutore: u.author,
         nicknameAutore: u.nicknameAuthor, 
         tempoInizio: u.startTime,
         risposta: u.answer,
         sugg1: u.hint1,
         sugg2: u.hint2
        }));
      resolve(indovinelli);
    });
  });
}

exports.risposte = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM ANSWER';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const risposte = rows.map((u) => ({
         id: u.id,
         risposta: u.answer, 
         idAutore: u.idAuthor,
         idIndovinello: u.idRiddle,
         nickname: u.nickname,
         punteggio: u.score
        }));

      resolve(risposte);
    });
  });
}

exports.rispostaByIdIndovinello = (idIndovinello) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT R.answer FROM RIDDLE R WHERE R.id = ?';
    db.all(sql, [idIndovinello], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      const risposta = rows.map((u) => ({
         risposta: u.answer
        }));
      
      resolve(risposta[0]);
    });
  });
}

// al momento della creazione, startTime = null
exports.nuovoIndovinello = (i) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO RIDDLE(question, difficulty, time, answer, hint1, hint2, state, author, nicknameAuthor, startTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    db.run(sql, [i.domanda, i.difficoltà, i.tempo, i.risposta, i.sugg1, i.sugg2, i.stato, i.idAutore, i.nicknameAutore, null], function (err) {  
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

exports.chiudiIndovinello = (nuovoStato, idIndovinello) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE RIDDLE SET state = ? WHERE id = ?';
    db.run(sql, [nuovoStato, idIndovinello], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.impostaTempoInizio = (tempoInizio, idIndovinello) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE RIDDLE SET startTime = ? WHERE id = ?';
    db.run(sql, [tempoInizio, idIndovinello], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

exports.nuovaRisposta = (r) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO ANSWER(answer, idAuthor, idRiddle, nickname, score) VALUES(?, ?, ?, ?, ?)'
    db.run(sql, [r.risposta, r.idAutore, r.idIndovinello, r.nicknameAutore, r.punteggio], function (err) {  
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};