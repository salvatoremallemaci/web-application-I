import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import MyNavbar from './MyNavbar';
import './LoginComponents.css';

function validateEmail(email) {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function LoginPage(props) {
  return (
    <Container>
      <Row>
        <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
      </Row>
      <Row>
        <LoginForm doLogin={props.doLogin} message={props.message} setMessage={props.setMessage} />
      </Row>
    </Container>
  );
}

function LoginForm(props) {
  const [username, setUsername] = useState('john.doe@polito.it');
  const [password, setPassword] = useState('password');

  const handleSubmit = (event) => {
    event.preventDefault();
    let valid = true;
    props.setMessage('');
    const credentials = { username, password };

    if (username.trim() === '') {
      valid = false;
      props.setMessage('Lo username non può essere vuoto o contenere solo spazi.');
    }

    if (valid && password.trim() === '') {
      valid = false;
      props.setMessage('La password non può essere vuota o contenere solo spazi.');
    }

    if (valid && !validateEmail(username)) {
      valid = false;
      props.setMessage('Email non valida.');
    }

    if (valid) {
      props.doLogin(credentials);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h2>Login</h2>
          <Form className='login-form'>
            {props.message ? <Alert variant='danger' onClose={() => props.setMessage('')} dismissible>{props.message}</Alert> : false}
            <Form.Group controlId='username'>
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
            </Form.Group>
            <Form.Group className='login-component' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
            </Form.Group>
            <Button className='login-component' onClick={handleSubmit}>Login</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

function LogoutButton(props) {
  return (
    <span className='logout-button'>
      <span className='username'>User: {props.user?.name}</span>{' '}<Button variant="outline-light" onClick={props.logout}>Logout</Button>
    </span>
  )
}

export { LoginPage, LoginForm, LogoutButton };