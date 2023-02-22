import 'bootstrap/dist/css/bootstrap.min.css';
import './PageLayout.css';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import Alert from 'react-bootstrap/Alert';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Ranking from './Ranking';
import './Ranking.css';
import API from './API';
const dayjs = require("dayjs");
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);


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
        <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
      </Row>
      <Row>
        <Col>
          <div className="main-content">{firstLog && <Alert>Benvenuto ad Indovinelli, {props.user.name}</Alert>}<Outlet /></div>
        </Col>
        <Ranking classifica={props.classifica} />
        <IndovinelliPersonali mieiIndovinelli={props.mieiIndovinelli} setMieiIndovinelli={props.setMieiIndovinelli} risposte={props.risposte} user={props.user}/>
        <IndovinelliInGioco indovinelliInGioco={props.indovinelliInGioco} setIndovinelliInGioco={props.setIndovinelliInGioco} risposte={props.risposte} chiudiIndovinello={props.chiudiIndovinello} user={props.user} dirty={props.dirty} setDirty={props.setDirty} setClassifica={props.setClassifica} />
      </Row>
    </Container>
  );

}

function IndovinelliPersonali(props) {
  const navigate = useNavigate();

  let userId = props.user.id;
  let setMieiIndovinelli = props.setMieiIndovinelli;

  useEffect(() => {

    API.getIndovinelliByAutore(userId)
        .then( (ind) => {
          setMieiIndovinelli(ind)
        });

  }, [userId, setMieiIndovinelli]);
  // Warning per le dipendenze da props...

  return (
    <>
      <Row>
        <Col>
          <h1 className='titoloIndovinelli'> I miei indovinelli </h1>
        </Col>
        <Col>
          <Button className='bottone' id="addIndovinello" onClick={() => navigate('/add')}> Crea Indovinello </Button>
        </Col>
      </Row>
      <div className="row justify-content-center">
        <div className="col-auto">
          <table className="table table-responsive">
            <thead>
              <tr>
                <th>Domanda</th>
                <th>Difficoltà</th>
                <th>Tempo totale (s)</th>
                <th>Suggerimento #1</th>
                <th>Suggerimento #2</th>
                <th>Risposta</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {
                props.mieiIndovinelli.map((mioIndovinello) => <RigaIndovinelliPersonali key={mioIndovinello.domanda} mioIndovinello={mioIndovinello} risposte={props.risposte.filter((risp) => risp.idIndovinello === mioIndovinello.id)} />)
              }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function RigaIndovinelliPersonali(props) {
  const navigate = useNavigate();
  return (
    <>
      <tr>
        <td>{props.mioIndovinello.domanda}</td>
        <td>{props.mioIndovinello.difficoltà}</td>
        <td>{props.mioIndovinello.tempo}</td>
        <td>{props.mioIndovinello.sugg1}</td>
        <td>{props.mioIndovinello.sugg2}</td>
        <td>{props.mioIndovinello.risposta}</td>
        { 
          props.mioIndovinello.stato === "chiuso" ? <td className='statoChiuso'>{props.mioIndovinello.stato}</td> : <td className='statoAperto'>{props.mioIndovinello.stato}</td>
        }
        <td>
        { 
          props.mioIndovinello.stato === "chiuso" ?
              <Button className='visualizzaRisposte' onClick={() => navigate('/rispostePersonaliChiuso/' + props.mioIndovinello.id)}>Visualizza le risposte!</Button>
          : <Button className='visualizzaRisposte' onClick={() => navigate('/rispostePersonaliAperto/' + props.mioIndovinello.id)}>Visualizza evoluzione</Button>
        }
        </td>
      </tr>
    </>
  );
}

function IndovinelliInGioco(props) {

  const [aperti, setAperti] = useState([]);
  const [chiusi, setChiusi] = useState([]);
  let idUtente = props.user.id; //utente loggato
  let setClassifica = props.setClassifica;
  let setIndovinelliInGioco = props.setIndovinelliInGioco;
  
  useEffect(() => {

    API.getIndovinelliInGioco(idUtente)
        .then( (ind) => {
          setIndovinelliInGioco(ind);
          setAperti(ind.filter((indv) => indv.stato === "aperto"));
          setChiusi(ind.filter((indv) => indv.stato === "chiuso"));
        });

    API.getTop3()
         .then( (classifica) => { setClassifica(classifica)})  

  }, [idUtente, setIndovinelliInGioco, setClassifica]);
  // Warning per le dipendenze da props...


  return (
    <>
      <Row>
        <h1 className='titoloIndovinelliInGiocoAperti'> Indovinelli aperti in gioco! </h1>
        <div className="row justify-content-center">
          <div className="col-auto">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Domanda</th>
                  <th>Difficoltà</th>
                  <th>Autore</th>
                </tr>
              </thead>
              <tbody>
                {
                  aperti.map((mioIndovinello) => <RigaIndovinelliInGioco mioIndovinello={mioIndovinello} key={mioIndovinello.id} chiudiIndovinello={props.chiudiIndovinello} dirty={props.dirty} setDirty={props.setDirty} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      </Row>
      <Row>
        <h1 className='titoloIndovinelliInGiocoChiusi'> Indovinelli chiusi in gioco! </h1>
        <div className="row justify-content-center">
          <div className="col-auto">
            <table className="table table-responsive">
              <thead>
                <tr>
                  <th>Domanda</th>
                  <th>Difficoltà</th>
                  <th>Autore</th>
                  <th>Risposta</th>
                </tr>
              </thead>
              <tbody>
                {
                  chiusi.map((mioIndovinello) => <RigaIndovinelliInGioco mioIndovinello={mioIndovinello} key={mioIndovinello.id} risposte={props.risposte.filter((risp) => risp.idIndovinello === mioIndovinello.id)} />)
                }
              </tbody>
            </table>
          </div>
        </div>
      </Row>
    </>
  );
}

function RigaIndovinelliInGioco(props) {
  const [mostra, setMostra] = useState(false);
  const navigate = useNavigate();


  if (props.mioIndovinello.stato === "aperto") {
    return (
      <>
        <tr>
          <td>{props.mioIndovinello.domanda}</td>
          <td>{props.mioIndovinello.difficoltà}</td>
          <td>{props.mioIndovinello.nicknameAutore}</td>
          <td>
            <Button className='bottoneRispondi' onClick={() => navigate('/risposteAperto/' + props.mioIndovinello.id)} > Rispondi </Button>
          </td>
        </tr>
      </>
    );
  } else if (props.mioIndovinello.stato === "chiuso") {

    return (
      <>
        <tr>
          <td>{props.mioIndovinello.domanda}</td>
          <td>{props.mioIndovinello.difficoltà}</td>
          <td>{props.mioIndovinello.nicknameAutore}</td>
          {
            (mostra) ?
                  <td className='rispostaCorretta'> {props.mioIndovinello.risposta} </td>
            : <td></td>
          }
    
          {
            (mostra) ?
                  <td>
                    <Button className='visualizzaRisposte' onClick={() => navigate('/risposteChiuso/' + props.mioIndovinello.id)}>Visualizza le risposte</Button>
                  </td>
            : <td></td>
          }
          <td>
            <Button className='mx-3' variant='success' onClick={() => { setMostra(!mostra) }}>
              {`< Spoiler`}
            </Button>
          </td>
        </tr>
        
      </>
    );
  }

}

export default PageLayout;

