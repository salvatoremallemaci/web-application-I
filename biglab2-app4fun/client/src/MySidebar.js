import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MySidebar.css';
import { Container, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

function MySidebar(props) {
	const navigate = useNavigate();
	let {filter} = useParams();
	if (filter) filter = filter.toLowerCase();
	
	return (
		<Container className='sidebar-container bg-light'>
			<ListGroup id="sidebar" variant='flush'>
				<ListGroup.Item className={filter==="all" || filter===undefined ? "active" : ""} action onClick={() => navigate('/all')}>
					All
				</ListGroup.Item>
				<ListGroup.Item className={filter==="favorites" ? "active" : ""} action onClick={() => navigate('/favorites')}>
					Favorites
				</ListGroup.Item>
				<ListGroup.Item className={filter==="bestrated" ? "active" : ""} action onClick={() => navigate('/bestrated') }>
					Best Rated
				</ListGroup.Item>
				<ListGroup.Item className={filter==="seenlastmonth" ? "active" : ""} action onClick={() => navigate('/seenlastmonth')}>
					Seen Last Month
				</ListGroup.Item>
				<ListGroup.Item className={filter==="unseen" ? "active" : ""} action onClick={() => navigate('/unseen')}>
					Unseen
				</ListGroup.Item>
			</ListGroup>
		</Container>
	);
}

export default MySidebar;