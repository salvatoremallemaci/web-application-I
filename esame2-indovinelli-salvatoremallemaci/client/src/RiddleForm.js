import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RiddleForm.css'
import MyNavbar from './MyNavbar';

function RiddleForm(props) {
    const navigate = useNavigate();

    const [domanda, setDomanda] = useState('');
    const [difficoltà, setDifficoltà] = useState('');
    const [tempo, setTempo] = useState(0);
    const [risposta, setRisposta] = useState('');
    const [sugg1, setSugg1] = useState('');
    const [sugg2, setSugg2] = useState('');

    const stato = "aperto";
    const idAutore = props.user.id;
    const nicknameAutore = props.user.name;

    const [errorMsg, setErrorMsg] = useState('');
    // eslint-disable-next-line
    const [errorField, setErrorField] = useState('');


    const handleSubmit = (event) => {
        event.preventDefault();

        // check form domanda
        if (domanda === '') {
            setErrorMsg('La domanda non può essere vuota.');
            setErrorField('domanda');
        }
        else if (domanda.trim().length === 0) {
            setErrorMsg("La domanda dell'indovinello deve contenere dei caratteri che non siano solo spazi.");
            setErrorField('domanda');
        }
        // check form tempo
        else if (tempo < 30 || tempo > 600) {
            setErrorMsg('Il tempo deve essere un numero intero di secondi, da 30 a 600');
            setErrorField('tempo');
        }
        // check form risposta
        else if (risposta === '') {
            setErrorMsg('La risposta non può essere vuota.');
            setErrorField('risposta');
        }
        else if (risposta.trim().length === 0) {
            setErrorMsg("La risposta dell'indovinello deve contenere dei caratteri che non siano solo spazi.");
            setErrorField('risposta');
        }
        // check form suggerimento1
        else if (sugg1 === '') {
            setErrorMsg('Il suggerimento1 non può essere vuoto.');
            setErrorField('sugg1');
        }
        else if (sugg1.trim().length === 0) {
            setErrorMsg("Il suggerimento1 dell'indovinello deve contenere dei caratteri che non siano solo spazi.");
            setErrorField('sugg1');
        }
        // check form suggerimento2
        else if (sugg2 === '') {
            setErrorMsg('Il suggerimento2 non può essere vuoto.');
            setErrorField('sugg2');
        }
        else if (sugg2.trim().length === 0) {
            setErrorMsg("Il suggerimento2 dell'indovinello deve contenere dei caratteri che non siano solo spazi.");
            setErrorField('sugg2');
        }
        else if (difficoltà === '') {
            setErrorMsg('Devi selezionare una difficoltà.');
            setErrorField('difficoltà');
        }
        else {

            let nuovoIndovinello = {
                domanda: domanda,
                difficoltà: difficoltà,
                tempo: tempo,
                risposta: risposta,
                sugg1: sugg1,
                sugg2: sugg2,
                stato: stato,
                idAutore: idAutore,
                nicknameAutore: nicknameAutore,
                tempoRimanente: tempo
            };
            props.addIndovinello(nuovoIndovinello);
            navigate('/');
        }
    }


    return (
        <>  
            <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
            <h1 className='titolo'>Crea un nuovo indovinello</h1>
            {errorMsg ? <Alert variant='danger' onClose={() => { setErrorField(''); setErrorMsg(''); }} dismissible>{errorMsg}</Alert> : false}
            <Form noValidate onSubmit={handleSubmit}>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='domandaHead'>Domanda:</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <Form.Control required value={domanda} onChange={ev => setDomanda(ev.target.value)} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='difficoltàHead'>Difficoltà:</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <select className='difficoltàForm' value={difficoltà} onChange={ev => setDifficoltà(ev.target.value)} >
                                <option disabled={true} value="">
                                    ------
                                </option>
                                <option value='facile'>facile</option>
                                <option value='medio'>medio</option>
                                <option value='difficile'>difficile</option>
                            </select>
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='tempoHead'>Tempo (s):</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <Form.Control type="number" min={30} max={600} required value={tempo} onChange={ev => setTempo(ev.target.value)} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='rispostaHead'>Risposta:</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <Form.Control required value={risposta} onChange={ev => setRisposta(ev.target.value)} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='suggHead'>Suggerimento #1:</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <Form.Control required value={sugg1} onChange={ev => setSugg1(ev.target.value)} />
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col md={{ span: 4, offset: 1 }} xs={3}>
                            <Form.Label className='suggHead'>Suggerimento #2:</Form.Label>
                        </Col>
                        <Col md={4} xs={9}>
                            <Form.Control required value={sugg2} onChange={ev => setSugg2(ev.target.value)} />
                        </Col>
                    </Row>
                </Form.Group>
                
                <Button className='bottoneSave' type='submit'>Save</Button>
                <Button className='bottoneCancel' onClick={() => navigate('/')}>Cancel</Button>
            </Form>


        </>
    )


}

export default RiddleForm;