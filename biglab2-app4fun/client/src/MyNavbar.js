import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MyNavbar.css'
import { Navbar, Form, FormControl } from 'react-bootstrap';
import { LogoutButton } from './LoginComponents';

function MyNavbar(props) {
	return (
		<Navbar className="navbar navbar-dark bg-primary fixed-top navbar-padding">
			<div className='container-fluid'>
				<Navbar.Brand className='white text'><i className="bi bi-collection-play white library-logo"></i> Film Library</Navbar.Brand>
				{props.loggedIn ? (<Form className=''>
					<FormControl
						type="search"
						placeholder="Search"
						aria-label="Search"
					/>
				</Form>) : false}
				<div>
				<Navbar.Text className='user-icon'><i className="bi bi-person-circle white"></i></Navbar.Text>
				{props.loggedIn ? <LogoutButton logout={props.doLogOut} user={props.user} /> : false}
				</div>
			</div>
		</Navbar>
	);
}

export default MyNavbar;