import 'bootstrap/dist/css/bootstrap.min.css';
import './PageLayout.css';
import { Container, Row, Col} from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import MySidebar from './MySidebar';
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';


function PageLayout(props) {
  
  const [firstLog, setFirstLog] = useState(true);
      
  useEffect(() => {
    setTimeout(() => {
      setFirstLog(false);
    }, 5000);
  }, []);    

  return (

    <Container fluid>
      <Row>
        <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage}/>
      </Row>
      <Row>
        <Col md={3} sm={12} className="p-0">
          <MySidebar />
        </Col>
        <Col md={9} sm={12}>
          <div className="main-content">{firstLog && <Alert>Welcome, {props.user.name}</Alert>}<Outlet /></div>
        </Col>
      </Row>
    </Container>
  );
}

export default PageLayout;

