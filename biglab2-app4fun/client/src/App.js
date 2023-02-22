import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import FilmLibrary from './FilmLibrary';
import PageLayout from './PageLayout';
import FilmForm from './FilmForm';
import { useEffect} from 'react';
import API from './API';
import { LoginPage } from './LoginComponents';


function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}


function App2() {
  const [films, setFilms] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  useEffect(()=> {
    const checkAuth = async() => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch(err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);

  function handleError(err) {
    console.log(err);
  }

  function addFilm(film) {
    film.id = films.map((f) => f.id)	// array di id dei film
      .sort((a, b) => b - a)[0] + 1;	// recupero il max dall'array e aggiungo 1 per il nuovo id
    film.user = user.id;
    setFilms(oldFilms => [...oldFilms, film]);
    API.addFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function updateFilm(film) {
    setFilms(films => films.map(
      e => (e.id === film.id) ? Object.assign({}, film) : e
    ));
    API.updateFilm(film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function deleteFilm(id) {
    setFilms(films.filter((f) => f.id !== id));
    API.deleteFilm(id)
      .then(() => setDirty(true))
      .catch(err => handleError(err));

  }

  function changeFavorite(id) {
    const temp_list = [...films];
    const temp_film = temp_list.find((f) => f.id === id);
    temp_film.favorite = !temp_film.favorite;
    setFilms(temp_list);
    API.updateFilm(temp_film)
      .then(() => setDirty(true))
      .catch(err => handleError(err));
  }

  function updateRating(id, rating) {
    const temp_list = [...films];
    const temp_film = temp_list.find((f) => f.id === id);
    if (rating !== temp_film.rating) {
      temp_film.rating = rating;
      setFilms(temp_list);
      API.updateFilm(temp_film)
        .then(() => setDirty(true))
        .catch(err => handleError(err));
    }
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setFilms([]);
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginPage doLogin={doLogIn} loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} />} />
        <Route path='/' element={loggedIn ? (<PageLayout loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} />) : <Navigate to='/login' />}>
          <Route index element={<FilmLibrary films={films} setFilms={setFilms} deleteFilm={deleteFilm} changeFavorite={changeFavorite} updateRating={updateRating} dirty={dirty} setDirty={setDirty} loggedIn={loggedIn} />} />
          <Route path=':filter' element={<FilmLibrary films={films} setFilms={setFilms} deleteFilm={deleteFilm} changeFavorite={changeFavorite} updateRating={updateRating} dirty={dirty} setDirty={setDirty} loggedIn={loggedIn} />} />
          <Route path='add' element={<FilmForm addOrUpdateFilm={addFilm} />} />
          <Route path='edit/:filmId' element={<FilmForm addOrUpdateFilm={updateFilm} films={films} />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;