import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './MyNavbar.css'
import { Navbar } from 'react-bootstrap';
import { LogoutButton } from './LoginComponents';


function MyNavbar(props) {

	return (
		<Navbar className="navbar navbar-dark bg-success fixed-top navbar-padding">
			<div className='container-fluid'>
				<Navbar.Brand className='dice-icon'> <i className="bi bi-dice-5"></i> Indovinelli <i className="bi bi-dice-5"></i> </Navbar.Brand>
				<div>
					<Navbar.Text className='user-icon'><i className="bi bi-person-circle white"></i></Navbar.Text>
					{props.loggedIn ? <LogoutButton logout={props.doLogOut} user={props.user} /> : false}
				</div>
			</div>
		</Navbar>
	);
}

export default MyNavbar;