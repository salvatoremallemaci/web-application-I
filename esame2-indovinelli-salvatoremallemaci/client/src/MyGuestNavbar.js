import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MyNavbar.css'
import { Navbar } from 'react-bootstrap';
import { LogoutButtonGuest } from './LoginComponents';


function MyGuestNavbar() {

	return (
		<Navbar className="navbar navbar-dark bg-warning fixed-top navbar-padding">
			<div className='container-fluid'>
				<Navbar.Brand className='dice-icon'> <i className="bi bi-dice-3"></i> Indovinelli <i className="bi bi-dice-3"></i> </Navbar.Brand>
				<div>
					<Navbar.Text className='user-icon'><i className="bi bi-person-circle white"></i></Navbar.Text>
					<LogoutButtonGuest />
				</div>
			</div>
		</Navbar>
	);
}

export default MyGuestNavbar;