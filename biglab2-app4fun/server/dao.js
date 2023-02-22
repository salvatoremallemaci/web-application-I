'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('films.db', (err) => {
  if(err) throw err;
});

// get all films
exports.getFilmsList = (filter, userId) => {
  return new Promise((resolve, reject) => {
    let sql;
    switch(filter){

      case "favorites":
        sql = 'SELECT * FROM films WHERE favorite = 1 AND user = ?';
        break;
      case "bestrated" :
        sql = 'SELECT * FROM films WHERE rating = 5 AND user = ?';
        break;
      case "seenlastmonth":
        let c = '';
        let b = '';
        sql = 'SELECT * FROM films WHERE watchdate > ? AND watchdate <= ? AND user = ?';
        b = dayjs().subtract(1, 'month').format("YYYY-MM-DD");
        c = dayjs().format("YYYY-MM-DD");
        db.all(sql, [b , c, userId], (err, rows) => {
          if (err) {
            reject(err);
            return;
          }
          const films = rows.map((e) => ({id: e.id, title: e.title, favorite: e.favorite, watchdate: e.watchdate, rating: e.rating, user: e.user}));
          resolve(films);
          return;
        });
        break;
      case "unseen":
        sql = 'SELECT * FROM films WHERE watchdate IS NULL AND user = ?';
        break; 
      default:
        sql = 'SELECT * FROM films WHERE user = ?';
        break;
    }
    
    
    db.all(sql,[userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const films = rows.map((e) => ({id: e.id, title: e.title, favorite: e.favorite, watchdate: e.watchdate, rating: e.rating, user: e.user}));
      resolve(films);
    });
  });
};

// get the film identified by {id}
exports.getFilm = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM films WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({error: 'Film not found.'});
      } else {
        const film = {id: id, title: row.title, favorite: row.favorite, watchdate: row.watchdate, rating: row.rating, user: row.user};
        resolve(film);
      }
    });
  });
};

// add a new film
exports.createFilm = (film) => {
  return new Promise((resolve, reject) => {
    let id;
    const sqlId = 'SELECT MAX(id) FROM films';
    db.all(sqlId, (err, n) => {
      if (err) {
        reject(err);
        return;
      }
      id = n + 1;
    });
    const sql = 'INSERT INTO films(id, title, favorite, watchdate, rating, user) VALUES(?, ?, ?, DATE(?), ?, ?)';
    db.run(sql, [id, film.title, film.favorite, film.watchdate, film.rating, film.user], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

// update an existing film
exports.updateFilm = (film) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE films SET title=?, favorite=?, watchdate=DATE(?), rating=?, user=? WHERE id = ?';
    db.run(sql, [film.title, film.favorite, film.watchdate, film.rating, film.user, film.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

//mark
exports.markExam = (id)=>{
  let f;
  const sqlF = 'SELECT favorite FROM films WHERE id=?';
    db.all(sqlF,[id], (err, n) => {
      if (err) {
        reject(err);
        return;
      }
      f = !n;
    });
  return new Promise((resolve, reject) =>{
    const sql = 'UPDATE films SET favorite=? WHERE id = ?';
    db.run(sql, [ f, film.id], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });

  }

// delete an existing film
exports.deleteFilm = (film_id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM films WHERE id = ?';
    db.run(sql, [film_id], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}

