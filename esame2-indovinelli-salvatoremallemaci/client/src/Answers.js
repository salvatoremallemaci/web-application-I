import { Button, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import './Answers.css';
import './PageLayout.css'
import { useEffect } from 'react';
import API from './API';

function Answers(props) {
    let setRisposte = props.setRisposte;
    useEffect( () => {

        API.getRisposte()
            .then( (risp) => setRisposte(risp))
            .catch( (err) => console.log(err));
    }, [setRisposte])
    // Warning per le dipendenze da props...

    const navigate = useNavigate();
    let { idIndovinello } = useParams();
    idIndovinello = parseInt(idIndovinello);
    const indovinello = props.indovinelli.filter((ind) => ind.id === idIndovinello)[0];
    return (
        <>
            <MyNavbar loggedIn={props.loggedIn} doLogOut={props.doLogOut} user={props.user} message={props.message} setMessage={props.setMessage} />
            <Row>
            <h1 className='titoloPagina'> L'indovinello era... </h1>
                <div className="row justify-content-center">
                    <div className="col-auto">
                        <table className="table table-responsive">
                            <thead>
                                <tr>
                                    <th>Domanda</th>
                                    <th>Difficoltà</th>
                                    <th>Autore</th>
                                    <th>Risposta corretta</th>
                                    <th>Vincitore</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    <tr>
                                        <td>{indovinello.domanda}</td>
                                        <td>{indovinello.difficoltà}</td>
                                        <td>{indovinello.nicknameAutore}</td>
                                        <td>{indovinello.risposta}</td>
                                        {
                                                props.risposte.filter((r) => r.risposta === indovinello.risposta && r.idIndovinello === indovinello.id).length ?
                                                    <td className='rispostaCorretta'>{props.risposte.filter((r) => r.risposta === indovinello.risposta && r.idIndovinello === indovinello.id)[0].nickname}</td> :
                                                <td className='nessunaRisposta'>Nessuno ha indovinato :/</td>
                                        }
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
                                    props.risposte.filter((risp) => risp.idIndovinello === idIndovinello).map((risposta) => <RigaRispostaIndovinelloChiuso risposta={risposta} key={risposta.id} indovinello={indovinello} />)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </Row>

            <Button className='bottoneIndietro' onClick={() => navigate('/')}> Torna agli indovinelli </Button>
        </>
    );
}

function RigaRispostaIndovinelloChiuso(props) {
    return (
        <>
            <tr>
                {(props.risposta.risposta === props.indovinello.risposta) ? 
                <td className ='rispostaCorretta'>{props.risposta.risposta}</td> : <td>{props.risposta.risposta}</td>}
                {(props.risposta.risposta === props.indovinello.risposta) ? 
                <td className ='rispostaCorretta'>{props.risposta.nickname}</td> : <td>{props.risposta.nickname}</td>}
            </tr>
        </>
    )
}

export default Answers;

