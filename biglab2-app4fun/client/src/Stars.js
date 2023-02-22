import { useState } from 'react';
import './Stars.css';

function Stars(props) {
 	const [nHovered, setNHovered] = useState(0);
 	let starArray = [];

 	for (let i=1; i<=5; i++) {
 		if (i<=props.nStars) {		// current star is filled
 			if (i<=nHovered)		// current star is hovered
 				// se updateRating è settato, mi ha chiamato FilmLibrary -> devo usare updateRating con l'id del film e il nuovo rating
 				// altrimenti mi ha chiamato FilmForm, uso la setRating del form (solo con il nuovo rating)
 				starArray.push(<i key={i} className="bi bi-star-fill hovered" onMouseEnter={ ()=>setNHovered(i) } onMouseLeave={ ()=>setNHovered(0) } onClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, i) : props.setRating(i) } } onDoubleClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, 0) : props.setRating(0) } } ></i>);
 			else
 				starArray.push(<i key={i} className="bi bi-star-fill" onMouseEnter={ ()=>setNHovered(i) } onMouseLeave={ ()=>setNHovered(0) } onClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, i) : props.setRating(i) } } onDoubleClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, 0) : props.setRating(0) } } ></i>);
 		}

 		else {
 			if (i<=nHovered)		// current star is hovered
 				starArray.push(<i key={i} className="bi bi-star hovered" onMouseEnter={ ()=>setNHovered(i) } onMouseLeave={ ()=>setNHovered(0) } onClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, i) : props.setRating(i) } } onDoubleClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, 0) : props.setRating(0) } } ></i>);
 			else
 				starArray.push(<i key={i} className="bi bi-star" onMouseEnter={ ()=>setNHovered(i) } onMouseLeave={ ()=>setNHovered(0) } onClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, i) : props.setRating(i) } } onDoubleClick={ ()=>{props.updateRating ? props.updateRating(props.filmId, 0) : props.setRating(0) } } ></i>);
 		}
 	}

	return starArray;
}
export default Stars;