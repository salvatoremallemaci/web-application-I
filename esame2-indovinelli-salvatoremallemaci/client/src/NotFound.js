import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return(
        <>
          <h1 className='notFound'>{`Ops! Non è la pagina che stavi cercando :/`}</h1>
          <Link to="/login">
            <Button className='bottoneNotFound' variant="success">Torna indietro</Button>
          </Link>
        </>
    );
}

export default NotFound;