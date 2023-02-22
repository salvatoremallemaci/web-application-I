import './App.css';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { LoginPage } from './LoginComponents';
import PageLayout from './PageLayout';
import { useEffect } from 'react';
import API from './API';
import GuestLayout from './GuestLayout';
import RiddleForm from './RiddleForm';
import Answers from './Answers';
import AnswerForm from './AnswerForm';
import PersonalAnswerClosed from './PersonalAnswerClosed';
import PersonalAnswer from './PersonalAnswer';
import NotFound from './NotFound';
import Spinner from 'react-bootstrap/Spinner';
import { Container } from 'react-bootstrap';

function App() {
  return (
    <Router>
      <App2 />
    </Router>
  )
}

function App2() {


  const [dirty, setDirty] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [message, setMessage] = useState('');
  const [classifica, setClassifica] = useState([]);
  const [indovinelliAnonimo, setIndovinelliAnonimo] = useState([]);
  const [mieiIndovinelli, setMieiIndovinelli] = useState([]);
  const [indovinelliInGioco, setIndovinelliInGioco] = useState([]);
  const [risposte, setRisposte] = useState([]);

  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        handleError(err);
      }
    };
    checkAuth();
  }, []);
  

  useEffect(() => {
    const getIndovinelli = async () => {
      if (loggedIn) {
        try {
          await API.getIndovinelliByAutore(user.id)
          .then((mieiIndovinelli) => { setMieiIndovinelli(mieiIndovinelli) })
          
          await API.getIndovinelliInGioco(user.id)
          .then((indovinelliInGioco) => { setIndovinelliInGioco(indovinelliInGioco) })
          
        } catch (err) {
          handleError(err);
        }
      }
    };
    const getRisposte = async () => {
      if (loggedIn) {
        try {
          await API.getRisposte()
          .then((risposte) => { setRisposte(risposte); setDirty(false); })
        } catch (err) {
          handleError(err);
        }
      }
    };
    getIndovinelli();
    getRisposte();
  }, [user, loggedIn, dirty]);

  function handleError(err) {
    console.log(err);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        setLoggedIn(true);
        setUser(user);
        setMessage('');
        navigate('/');
      })
      .catch(err => {
        setMessage(err);
      }
      )
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({});
    setMieiIndovinelli([]);
    setIndovinelliInGioco([]);
    setRisposte([]);
    setDirty(true);
    setInitialLoading(true);
    navigate('/');
  }

  useEffect(() => {
    API.getTop3()
      .then((classifica) => { setClassifica(classifica) })
      .catch(err => handleError(err));

    API.getIndovinelliAnonimo()
      .then((indovinelliAnonimo) => { setIndovinelliAnonimo(indovinelliAnonimo) })
      .catch(err => handleError(err));

  }, [dirty]);

  const addIndovinello = async (indovinello) => {
    await API.addIndovinello(indovinello)
      .catch(err => handleError(err));
    setMieiIndovinelli(oldIndovinelliMiei => [...oldIndovinelliMiei, indovinello]);
    setDirty(true);
  }

  function Loading() {

    useEffect(() => {
      setTimeout(() => {
        setInitialLoading(false)
      }, 1000);
    }, []);

    return (
      <>
        <h1 className='App-loading'>Caricamento in corso...</h1>
        <Container className='d-flex justify-content-center align-items-center' style={{ height: 400 }} >
          <Spinner animation="border" />
        </Container>
      </>
    )
  }

  return (
    <>
      <Routes>
        <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <LoginPage doLogin={doLogIn} loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} />} />
        <Route path='/' element={loggedIn ? initialLoading ? <Loading /> : 
        (<PageLayout loggedIn={loggedIn} doLogOut={doLogOut} user={user} message={message} setMessage={setMessage} 
        classifica={classifica} setClassifica={setClassifica} 
        mieiIndovinelli={mieiIndovinelli} setMieiIndovinelli={setMieiIndovinelli} 
        indovinelliInGioco={indovinelliInGioco} setIndovinelliInGioco={setIndovinelliInGioco}
        risposte={risposte} setRisposte={setRisposte} 
        dirty={dirty} setDirty={setDirty} />) : <Navigate to='/login' />}></Route>
        <Route path='/guest' element={!loggedIn ? (<GuestLayout message={message} setMessage={setMessage} classifica={classifica} setClassifica={setClassifica} indovinelli={indovinelliAnonimo} setIndovinelli={setIndovinelliAnonimo} />) : <Navigate to='/login' />} />
        <Route path='/add' element={loggedIn ? (<RiddleForm user={user} addIndovinello={addIndovinello} loggedIn={loggedIn} doLogOut={doLogOut} />) : <Navigate to='/login' />} />
        <Route path='/risposteChiuso/:idIndovinello' element={loggedIn ? (<Answers risposte={risposte} setRisposte={setRisposte} indovinelli={indovinelliInGioco} loggedIn={loggedIn} doLogOut={doLogOut} user={user}/>) : <Navigate to='/login' />} />
        <Route path='/risposteAperto/:idIndovinello' element={loggedIn ? (<AnswerForm indovinelli={indovinelliInGioco} setIndovinelli={setIndovinelliInGioco} loggedIn={loggedIn} doLogOut={doLogOut} user={user} dirty={dirty} setDirty={setDirty} risposteUtente={risposte.filter((risp) => risp.idAutore === user.id)} classifica={classifica} setClassifica={setClassifica} />) : <Navigate to='/login' />} />
        <Route path='/rispostePersonaliChiuso/:idIndovinello' element={loggedIn ? (<PersonalAnswerClosed indovinelli={mieiIndovinelli} risposte={risposte} setRisposte={setRisposte} user={user} loggedIn={loggedIn} doLogOut={doLogOut} message={message} setMessage={setMessage} dirty={dirty} setDirty={setDirty}/>) : <Navigate to='/login' />} />
        <Route path='/rispostePersonaliAperto/:idIndovinello' element={loggedIn ? (<PersonalAnswer indovinelli={mieiIndovinelli} risposte={risposte} user={user} loggedIn={loggedIn} doLogOut={doLogOut} message={message} setMessage={setMessage} dirty={dirty} setDirty={setDirty}/>) : <Navigate to='/login' />} />
        <Route path='*' element={<NotFound/>}></Route>
      </Routes>
    </>
  );
}

export default App;
