import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MyNavbar.css'
import { Navbar, Form, FormControl } from 'react-bootstrap';

function MyNavbar(props) {
	return (
		<Navbar className="navbar navbar-dark bg-primary fixed-top navbar-padding">
			<div className='container-fluid'>
				<Navbar.Brand className='white text'><i className="bi bi-collection-play white library-logo"></i> Film Library</Navbar.Brand>
				<Form className=''>
					<FormControl
						type="search"
						placeholder="Search"
						aria-label="Search"
					/>
				</Form>
				<Navbar.Text className='user-icon'><i className="bi bi-person-circle white"></i></Navbar.Text>
			</div>
		</Navbar>
	);
}

export default MyNavbar;