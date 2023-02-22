import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import React, { useState, useEffect } from 'react';
import './AnswerForm.css';
import API from './API';
const dayjs = require("dayjs");
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

function AnswerForm(props) {

    const navigate = useNavigate();
    const [risposta, setRisposta] = useState('');

    const [errorMsg, setErrorMsg] = useState('');
    // eslint-disable-next-line
    const [errorField, setErrorField] = useState('');

    const [tempoRimanente, setTempoRimanente] = useState();
    const [tempoRimanenteSugg1, setTempoRimanenteSugg1] = useState(0);
    const [tempoRimanenteSugg2, setTempoRimanenteSugg2] = useState(0);

    const [sugg1, setSugg1] = useState('');
    const [sugg2, setSugg2] = useState('');
    const [notifica, setNotifica] = useState('');
    

    let timer;
    let timerSugg1 = 1;
    let timerSugg2 = 1;
    
    let setIndovinelliInGioco = props.setIndovinelli;
    let idUtente = props.user.id; //utente loggato

    let setClassifica = props.setClassifica;
    
    let { idIndovinello } = useParams();
    idIndovinello = parseInt(idIndovinello); // id indovinello, dalla pagina dinamica

    
    useEffect(() => {
            API.getIndovinelliInGioco(idUtente)
                .then((indInGioco) => { setIndovinelliInGioco(indInGioco) })
                .catch(err => console.log(err));
            
            
                API.getTop3()
                .then( (classifica) => { setClassifica(classifica)})  
                .catch(err => console.log(err)); 
            
            
      }, [idUtente, setIndovinelliInGioco, setClassifica]);

    const indovinello = props.indovinelli.filter((ind) => ind.id === idIndovinello)[0];
    const autoreIndovinello = indovinello.nicknameAutore;
    const [ind, setInd] = useState(indovinello);
    const [risp, setRisp] = useState(props.risposteUtente.filter((r) => r.idIndovinello === idIndovinello));

    const percentualeTempoSugg1 = ((50*indovinello.tempo)/100);
    const percentualeTempoSugg2 = ((25*indovinello.tempo)/100);
    
    useEffect(() => {
    const intervallo = setInterval(() => {

        API.getIndovinelloInGioco(idIndovinello)
            .then( (ind) => {

                setInd(ind);

                if (ind.stato === "chiuso") {
                    setTempoRimanente(0);
                    // return;
                }

                if (ind.tempoInizio === null) {
                    // eslint-disable-next-line
                    timer = ind.tempo;
                    // setTempoRimanente(indovinello.tempo);
                } else {
                    timer = Math.round(dayjs.duration({ seconds: ind.tempo }).subtract(dayjs.duration(dayjs() - dayjs(ind.tempoInizio))).asSeconds());
                    // eslint-disable-next-line
                    timerSugg1 = Math.round(timer - percentualeTempoSugg1);
                    // eslint-disable-next-line
                    timerSugg2 = Math.round(timer - percentualeTempoSugg2);
                    setTempoRimanente(timer);
                    setTempoRimanenteSugg1(timerSugg1);
                    setTempoRimanenteSugg2(timerSugg2);
                }

                if (timerSugg1 <= 0){
                    // setto stato sugg1
                    setSugg1(indovinello.sugg1);
                }

                if (timerSugg2 <= 0){
                    // setto stato sugg1
                    setSugg2(indovinello.sugg2);
                }

                if (timer <= 0 && ind.stato === 'aperto') { // scaduto il tempo, chiudo l'indovinello
                    API.chiudiIndovinello(idIndovinello);
                    props.setDirty(true);
                    setTempoRimanente(0);
                    // torno alla schermata iniziale
                    // navigate('/');
                } 
            })

        API.getRisposte()
            .then( (risposte) => {
                risposte.filter((r) => r.idIndovinello === idIndovinello && r.idAutore === idUtente ).length ?
                    setRisp(risposte.filter( (r) => r.idIndovinello === idIndovinello && r.idAutore === idUtente  ))
                : setRisp(props.risposteUtente.filter((r) => r.idIndovinello === idIndovinello));    
            })
        
    }, 1000);

    return function puliziaTimer() {
        clearInterval(intervallo);
    }
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        
        if (risposta === '') {
            setErrorMsg('La risposta non può essere vuota.');
            setErrorField('risposta');
        } 

        else {
        // setta tempoInizio    
        if (ind.tempoInizio == null){
           const adesso = dayjs().format();
            API.impostaTempoInizio(idIndovinello, adesso);         
        }    

        // la verifica della risposta, l'eventuale chiusura dell'indovinello se giusta e il punteggio gestito via server
        // tramite una post della risposta.

        // creo l'oggetto risposta
        const nuova_risposta = {
            risposta: risposta,
		    idAutore: props.user.id,
		    idIndovinello: idIndovinello,
		    nicknameAutore: props.user.name
        }
        // registro la risposta
        const status = API.addRisposta(nuova_risposta);


        // status restituisce 0 (sbagliata), 1(giusta - facile), 2(g-medio), 3(g-difficile),
        // errore(errore nel registrare la risp: hai già riposto o qualcuno ha indovinato prima di te)
        status.then( value => {
            setNotifica(value);
        }).catch(err => {
            setNotifica(err);
        })
        props.setDirty(true);
        // torno alla schermata iniziale
        // navigate('/');
        }
    }


    if (ind.stato === "aperto") {
        return (
            <>
                <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
                <Row>
                    <h1 className='titoloPag'> L'indovinello è... </h1>
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
                                        
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        <tr>
                                            <td>{indovinello.domanda}</td>
                                            <td>{indovinello.difficoltà}</td>
                                            <td>{autoreIndovinello}</td>
                                            {
                                                (ind.tempoInizio == null) ?
                                                    <td className='tempoFermo'>{indovinello.tempo}</td> :
                                                    (tempoRimanente <= 50) ?
                                                        <td className='tempoStaFinendo'>{tempoRimanente}</td> :
                                                    <td className='tempoScorre'>{tempoRimanente}</td>
                                            }
                                            {
                                                (ind.tempoInizio == null) ?
                                                    <td className='tempoFermo'>Deve prima partire il countdown!</td> :
                                                    (tempoRimanenteSugg1 > 0) ?
                                                        <td className='tempoScorre'>{`Il suggerimento comparirà tra ${tempoRimanenteSugg1} s`}</td> :
                                                    <td className='sugg'>{sugg1}</td>

                                            }
                                            {
                                                (ind.tempoInizio == null) ?
                                                    <td className='tempoFermo'>Deve prima partire il countdown!</td> :
                                                    (tempoRimanenteSugg2 > 0) ?
                                                        <td className='tempoScorre'>{`Il suggerimento comparirà tra ${tempoRimanenteSugg2} s`}</td> :
                                                    <td className='sugg'>{sugg2}</td> 
                                            }
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Row>
                
                <h1 className='titoloRisp'> Qual è la tua risposta? </h1>
                {errorMsg ? <Alert variant='danger' onClose={() => { setErrorField(''); setErrorMsg(''); }} dismissible>{errorMsg}</Alert> : false}
                
                {
                    (risp.length) ? 
                    
                    <Row>
                        <Col>
                            <h1 className='rispostaSbagliata'> {`Purtroppo "${risp[0].risposta}" non è la risposta giusta...`}</h1>
                            <Button className='bottoneNonDisp' onClick={() => {navigate('/'); }}> Torna agli indovinelli </Button>
                        </Col>
                    </Row> 
                    : 

                    <Form noValidate onSubmit={handleSubmit}>
                    <Form.Group>
                        <Row>
                            <Col>
                            </Col>
                            <Col md={5} xs={9}>
                                <Form.Control className='rispForm' required value={risposta} onChange={ev => setRisposta(ev.target.value)} />
                            </Col>
                            <Col>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button className='bottoneSalvaRisposta' type='submit'>Salva la risposta</Button>
                            </Col>
                            <Col>
                                <Button className='bottoneInd' onClick={() => {navigate('/');  setNotifica('') }}> Torna agli indovinelli </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
                }
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
                        { 
                            (notifica === 1 || notifica === 2 || notifica === 3)? <h1 className='risposta'>{`Risposta corretta! Hai guadagnato ${notifica} punto/i`}</h1> : false
                        }
                        {
                            (notifica === "errore") ? <h1 className='troppoTardi'> Mi dispiace, ma l'indovinello è stato chiuso :/</h1> : false
                        }
                        </Row>
                        <Row>
                            <Col>
                            <Button className='bottoneNonDisp' onClick={() => {navigate('/');  }}> Torna agli indovinelli </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            
            
            </>
        )
    }
}




export default AnswerForm;  