import './FilmForm.css';
import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import Stars from './Stars';

function FilmForm(props) {
	const navigate = useNavigate();
	let { filmId } = useParams();
	filmId = parseInt(filmId);
	const filmToEdit = filmId ? props.films.find((film) => film.id === filmId) : undefined;
	const [title, setTitle] = useState(filmToEdit ? filmToEdit.title : '');
	const [favorite, setFavorite] = useState(filmToEdit ? filmToEdit.favorite : false);
	const [watchDate, setWatchDate] = useState(filmToEdit ? filmToEdit.watchdate : dayjs());
	const [rating, setRating] = useState(filmToEdit ? filmToEdit.rating : 0);
	const [errorField, setErrorField] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();

		if (title === '') {
			setErrorMsg('Il titolo non può essere vuoto.');
			setErrorField('title');
		}

		else if (title.trim().length === 0) {
			setErrorMsg('Il titolo del film deve contenere dei caratteri che non siano solo spazi.');
			setErrorField('title');
		}

		else if (watchDate && watchDate.isAfter(dayjs())) {
			setErrorMsg('La data non può essere futura.');
			setErrorField('watchDate');
		}

		else if (rating < 0 || rating > 5)
			setErrorMsg('La valutazione deve essere compresa tra 0 e 5.');

		else {
			let temp_watchdate = watchDate; //Variabile temporanea per non far stampare
			if (!watchDate || !watchDate.isValid())        //Invalid Date in caso di undefined
				temp_watchdate = undefined;
			let newFilm = { title: title, favorite: favorite, watchdate: temp_watchdate, rating: rating };
			if (filmToEdit) newFilm.id = filmId;
			props.addOrUpdateFilm(newFilm);
			navigate('/');
		}
	}

	return (
		<>
			<h1>{filmToEdit ? 'Edit film' : 'Add new film'}</h1>
			{errorMsg ? <Alert variant='danger' onClose={() => { setErrorField(''); setErrorMsg(''); }} dismissible>{errorMsg}</Alert> : false}
			<Form noValidate onSubmit={handleSubmit}>
				<Form.Group>
					<Row>
						<Col md={{ span: 3, offset: 1 }} xs={3}>
							<Form.Label>Film title</Form.Label>
						</Col>
						<Col md={4} xs={9}>
							<Form.Control required value={title} onChange={ev => setTitle(ev.target.value)} isInvalid={errorField === 'title' ? true : false} />
						</Col>
					</Row>
				</Form.Group>
				<Form.Group>
					<Row>
						<Col md={{ span: 3, offset: 1 }} xs={3}>
							<Form.Label>Favorite</Form.Label>
						</Col>
						<Col md={4} xs={9}>
							{['checkbox'].map((type) => (
								<div key={`default-${type}`}>
									<Form.Check
										type={type}
										id={`default-${type}`}
										label={"Favorite"}
										defaultChecked={favorite}
										onChange={ev => setFavorite(!favorite)}
									/>
								</div>
							))}
						</Col>
					</Row>
				</Form.Group>
				<Form.Group>
					<Row>
						<Col md={{ span: 3, offset: 1 }} xs={3}>
							<Form.Label>Watched date</Form.Label>
						</Col>
						<Col md={4} xs={9}>
							<Form.Control type='date' value={watchDate === undefined ? dayjs().format('YYYY-MM-DD') : watchDate.format('YYYY-MM-DD')} onChange={ev => setWatchDate(dayjs(ev.target.value))} isInvalid={errorField === 'watchDate' ? true : false} />
						</Col>
					</Row>
				</Form.Group>
				<Form.Group>
					<Row>
						<Col md={{ span: 3, offset: 1 }} xs={3}>
							<Form.Label>Rating</Form.Label>
						</Col>
						<Col md={4} xs={9}>
							<Stars nStars={rating} setRating={setRating} />
						</Col>
					</Row>
				</Form.Group>

				<Button type='submit'>Save</Button>
				<Button id="cancelBtn" onClick={() => navigate('/')}>Cancel</Button>
			</Form>
		</>
	);
}

export default FilmForm;