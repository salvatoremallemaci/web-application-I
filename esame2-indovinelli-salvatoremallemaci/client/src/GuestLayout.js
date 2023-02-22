import 'bootstrap/dist/css/bootstrap.min.css';
import './GuestLayout.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';
import MyGuestNavbar from './MyGuestNavbar';
import Ranking from './Ranking';
import './Ranking.css';

function GuestLayout(props) {


    const [firstLogGuest, setFirstLogGuest] = useState(true);


    useEffect(() => {
        setTimeout(() => {
            setFirstLogGuest(false);
        }, 5000);
    }, []);

    return (

        <Container fluid>
            <Row>
                <Col>
                    <div className="main-content">{firstLogGuest && <Alert>Benvenuto ad Indovinelli, Navigatore anonimo</Alert>}<Outlet /></div>
                </Col>
                <MyGuestNavbar message={props.message} setMessage={props.setMessage} />
                <Ranking classifica={props.classifica} />
                <Indovinelli indovinelli={props.indovinelli} />
            </Row>
            <Row>

            </Row>
        </Container>
    );

}

function Indovinelli(props) {
    return (
        <>
            <h1 className='titoloIndovinelliAnonimo'> Indovinelli in gioco </h1>
            <div className="row justify-content-center">
                <div className="col-auto">
                    <table className="table table-responsive">
                    <thead>
                    <tr>
                        <th>Domanda</th>
                        <th>Difficoltà</th>
                        <th>Stato</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.indovinelli.map((indovinello) => <RigaIndovinelli indovinello={indovinello} key={indovinello.domanda} />)
                    }
                </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

/*
<div class="row justify-content-center">
    <div class="col-auto">
      <table class="table table-responsive">
        ....table stuff....
      </table>
    </div>
  </div>
*/

/*
<table className="table text-center">
                <thead>
                    <tr>
                        <th>Domanda</th>
                        <th>Difficoltà</th>
                        <th>Stato</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.indovinelli.map((indovinello) => <RigaIndovinelli indovinello={indovinello} key={indovinello.domanda} />)
                    }
                </tbody>
            </table>

*/

function RigaIndovinelli(props) {
    return (
        <>
            <tr>
                <td>{props.indovinello.domanda}</td>
                <td>{props.indovinello.difficoltà}</td>
                <td>{props.indovinello.stato}</td>

            </tr>
        </>
    );
}



export default GuestLayout;