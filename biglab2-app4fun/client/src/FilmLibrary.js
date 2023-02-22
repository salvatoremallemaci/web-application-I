import 'bootstrap/dist/css/bootstrap.min.css';
import './FilmLibrary.css';
import { Button, ListGroup, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Stars from './Stars';
import API from './API';

function FilmLibrary(props) {
	let { filter } = useParams();
	if (filter) filter = filter.toLowerCase();
	const titles = { 'all': 'All', 'favorites': 'Favorites', 'bestrated': 'Best Rated', 'seenlastmonth': 'Seen Last Month', 'unseen': 'Unseen' };

	return (
		<div className="film-library">
			<h1> {filter === undefined ? 'All' : titles[filter]}</h1>	{/* displays filter name with spaces */}
			<FilmList films={props.films} setFilms={props.setFilms} filter={filter} deleteFilm={props.deleteFilm} changeFavorite={props.changeFavorite} updateRating={props.updateRating} dirty={props.dirty} setDirty={props.setDirty} loggedIn={props.loggedIn}></FilmList>
		</div>
	);
};

function FilmList(props) {
	const navigate = useNavigate();

	return (
		<>
			<ListGroup variant='flush'>
				<Filter films={props.films} setFilms={props.setFilms} filter={props.filter} deleteFilm={props.deleteFilm} changeFavorite={props.changeFavorite} updateRating={props.updateRating} dirty={props.dirty} setDirty={props.setDirty} loggedIn={props.loggedIn} />
			</ListGroup>
			<Button className='btn' id="addFilm" onClick={() => navigate('/add')}>&#43;</Button>
		</>
	);
}

function Filter(props) {

	useEffect(() => {
		switch (props.filter) {
			case 'favorites':

				API.getFavorites()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);
				break;

			case 'bestrated':

				API.getBestRated()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);
				break;

			case 'seenlastmonth':

				API.getSeenLastMonth()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);

				break;

			case 'unseen':

				API.getUnseen()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);

				break;

			case undefined:

				API.getAllFilms()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);

				break;

			default:
				API.getAllFilms()
					.then((films) => props.setFilms(films))
					.catch(err => console.log(err))
				props.setDirty(false);
				break;
		}


	}, [props.filter, props.dirty, props.loggedIn]);

	return (
		props.films.map((f) => <FilmRow film={f} key={f.id} deleteFilm={props.deleteFilm} changeFavorite={props.changeFavorite} updateRating={props.updateRating} />)
	);
}





function FilmRow(props) {
	return (
		<ListGroup.Item><FilmData film={props.film} id={props.film.id} deleteFilm={props.deleteFilm} changeFavorite={props.changeFavorite} updateRating={props.updateRating} /></ListGroup.Item>
	);
}

function FilmData(props) {
	const navigate = useNavigate();

	return (
		<Row>
			<Col md={4} sm={6}>
				<Button id="updateBtn" onClick={() => navigate('/edit/' + props.id)}>
					<i className="bi bi-pencil-square"></i> </Button>
				<Button id="deleteBtn" onClick={() => { props.deleteFilm(props.id) }}>
					<i className="bi bi-trash primary"></i> </Button>
				<span className={props.film.favorite == true ? "titlefavorite" : null}> {props.film.title}</span>
			</Col>
			<Col md={3} sm={6}>
				<Form>
					{['checkbox'].map((type) => (
						<div key={`default-${type}`}>
							<Form.Check
								type={type}
								id={`default-${type}-${props.id}`}
								label={"Favorite"}
								defaultChecked={props.film.favorite}
								onChange={() => { props.changeFavorite(props.id); }}
							/>
						</div>
					))}
				</Form>
			</Col>
			<Col lg={2} md={2} sm={6}>{props.film.watchdate?.isValid() ? props.film.watchdate.format('MMMM DD, YYYY') : ""}</Col>
			<Col md={3} sm={6}>{<Stars filmId={props.film.id} nStars={props.film.rating} updateRating={props.updateRating} ></Stars>}</Col>
		</Row>
	);
}


export default FilmLibrary;