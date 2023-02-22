import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import dayjs from 'dayjs';
import FilmLibrary from './FilmLibrary';
import PageLayout from './PageLayout';
import FilmForm from './FilmForm';

const FILMS = [
  // Data Structure: id, title, favorite, watchDate, rating
  { id: 1, title: "Pulp Fiction", favorite: true, watchdate: dayjs('2022-03-10'), rating: 5 },
  { id: 2, title: "21 Grams", favorite: true, watchdate: dayjs('2022-03-17'), rating: 4 },
  { id: 3, title: "Star Wars", favorite: false },
  { id: 4, title: "Matrix", favorite: true },
  { id: 5, title: "Shrek", favorite: false, watchdate: dayjs('2022-03-21'), rating: 3 }
];

function App() {
  const [films, setFilms] = useState(FILMS);

  function addFilm(film) {
    film.id = films.map((f) => f.id)	// array di id dei film
      .sort((a, b) => b - a)[0] + 1;	// recupero il max dall'array e aggiungo 1 per il nuovo id
    setFilms(oldFilms => [...oldFilms, film]);
  }

  function updateFilm(film) {
    setFilms(films => films.map(
      e => (e.id === film.id) ? Object.assign({}, film) : e
    ));
  }

  function deleteFilm(id) {
    setFilms(films.filter((f) => f.id !== id));
  }

  function changeFavorite(id) {
    const temp_list = [...films];
    const temp_film = temp_list.find((f) => f.id === id);
    temp_film.favorite = !temp_film.favorite;
    setFilms(temp_list);
  }

  function updateRating(id, rating) {
    const temp_list = [...films];
    const temp_film = temp_list.find((f) => f.id === id);
    temp_film.rating = rating;
    setFilms(temp_list);
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<PageLayout />}>
            <Route index element={<FilmLibrary films={films} deleteFilm={deleteFilm} changeFavorite={changeFavorite} updateRating={updateRating} />} />
            <Route path=':filter' element={<FilmLibrary films={films} deleteFilm={deleteFilm} changeFavorite={changeFavorite} updateRating={updateRating} />} />
            <Route path='add' element={<FilmForm addOrUpdateFilm={addFilm} />} />
            <Route path='edit/:filmId' element={<FilmForm addOrUpdateFilm={updateFilm} films={films} />} />
          </Route>

        </Routes>
      </Router>
    </>
  );
}

export default App;