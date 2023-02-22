import { Button, Row, Col, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import React, { useState, useEffect } from 'react';
import './AnswerForm.css';
import API from './API';
const dayjs = require("dayjs");
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function PersonalAnswer(props) {

    const navigate = useNavigate();
    
    const [tempoRimanente, setTempoRimanente] = useState();
    const [indovinato, setIndovinato] = useState();

    const rispostaFake = [{
        risposta: "Nessuna risposta al momento",
        nickname: "Nessun partecipante al momento"
    }]

    let { idIndovinello } = useParams();
    idIndovinello = parseInt(idIndovinello);
    let indovinello = props.indovinelli.filter((ind) => ind.id === idIndovinello)[0];
    // let risposte = props.risposte.filter((risp) => risp.idIndovinello === idIndovinello);
    let idUtente = props.user.id; //utente loggato
    
    const [risp, setRisp] = useState(rispostaFake);
    const [ind, setInd] = useState(indovinello);

    useEffect(() => {
        const intervallo = setInterval(() => {

            API.getRisposte()
                .then((risposte) => {
                    risposte.filter((r) => r.idIndovinello === idIndovinello).length ? 
                        setRisp(risposte.filter((r) => r.idIndovinello === idIndovinello)) 
                    : setRisp(rispostaFake)

                    risposte.filter((c) => c.risposta === indovinello.risposta && c.idIndovinello === indovinello.id).length ?
                        setIndovinato(risposte.filter((c) => c.risposta === indovinello.risposta && c.idIndovinello === indovinello.id)[0])
                    : setIndovinato(false)
                }
            )

            API.getIndovinelliByAutore(idUtente)
                .then((indovinelli) => {
                    setInd(indovinelli.filter((i) => i.id === idIndovinello)[0]);
                    if (ind.stato === "chiuso") {
                        setTempoRimanente(0);
                        return;
                    }
    
                    if (ind.tempoInizio === null) {
                        setTempoRimanente(ind.tempo);
                        // setTempoRimanente(indovinello.tempo);
                    } else {
                        setTempoRimanente(Math.round(dayjs.duration({ seconds: ind.tempo }).subtract(dayjs.duration(dayjs() - dayjs(ind.tempoInizio))).asSeconds()));
                    }
            
                    if (tempoRimanente <= 0 && ind.stato === 'aperto') { // scaduto il tempo, chiudo l'indovinello
                        // ind.stato = "chiuso";
                        API.chiudiIndovinello(indovinello.id);
                        props.setDirty(true);
                        setTempoRimanente(0);
                    }
                })


        }, 1000);

        return function puliziaTimer() {
            clearInterval(intervallo);
        }
    })


    if (ind.stato === "aperto") {
        return (
            <>
                <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
                <Row>
                    <h1 className='mioIndovinelloTitolo'> L'indovinello è </h1>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th>Domanda</th>
                                        <th>Difficoltà</th>
                                        <th>Autore</th>
                                        <th>Tempo rimanente (s) </th>
                                        <th>Suggerimento #1</th>
                                        <th>Suggerimento #2</th>
                                        <th>Risposta corretta</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        <tr>
                                            <td>{indovinello.domanda}</td>
                                            <td>{indovinello.difficoltà}</td>
                                            <td>{indovinello.nicknameAutore}</td>
                                            {
                                                (ind.tempoInizio == null) ?
                                                    <td className='tempoFermo'>{indovinello.tempo}</td> :
                                                    (tempoRimanente <= 50) ?
                                                        <td className='tempoStaFinendo'>{tempoRimanente}</td> :
                                                    <td className='tempoScorre'>{tempoRimanente}</td>
                                            }
                                            <td>{indovinello.sugg1}</td>
                                            <td>{indovinello.sugg2}</td>
                                            <td>{indovinello.risposta}</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Row>
                <Row>
                    <h1 className='titoloRisposta'> Ecco le risposte da parte degli utenti: </h1>
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <table className="table table-responsive">
                                <thead>
                                    <tr>
                                        <th>Risposta</th>
                                        <th>Autore</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {   
                                        risp.map((risposta) => <RigaRispostaMioIndovinelloAperto risposta={risposta} key={risposta.nickname} indovinello={ind} />)
                                    }  
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Row>
                <Button className='bottoneIndietro' onClick={() => navigate('/')}> Torna agli indovinelli </Button>
            </>
        )
    } else if(ind.stato === "chiuso"){
            return (
                <>  
                    <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
                    <h1 className='titoloNonDisp'> L'indovinello è stato chiuso ^.^ </h1>
                    <Form>
                        <Form.Group>
                            <Row>
                                <Col>
                                    {
                                        indovinato ? 
                                            <h1 className='risposta'>{`Attenzione, "${indovinato.nickname}" ha indovinato!`}</h1> 
                                        : <h1 className='troppoTardi'>{`Il tempo è scaduto, l'indovinello si chiuderà`}</h1>
                                    }
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <Button className='bottoneNonDisp' onClick={() => {navigate('/') }}> Torna agli indovinelli </Button>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Form>
                
                
                </>
            )
        }


    }

function RigaRispostaMioIndovinelloAperto(props) {
    return (
        <>

        {
            (props.indovinello.stato === "aperto") ? 
                <tr>
                   <td>{props.risposta.risposta}</td>
                   <td>{props.risposta.nickname}</td>
                </tr> 
            : <td>
                <h1 className='titoloNonDisp'> L'indovinello è stato chiuso ^.^ </h1>
            </td>
        }



            
        </>
    )
}



export default PersonalAnswer; 