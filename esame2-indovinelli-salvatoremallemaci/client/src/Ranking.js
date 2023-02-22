import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Ranking.css';

function Ranking(props) {
    return (
        <>
            <h1 className='titoloClassifica'> Classifica Top 3 </h1>
            <div className="row justify-content-center">
                <div className="col-auto">
                    <table className="table table-responsive">
                    <thead>
                    <tr>
                        <th>Posizione</th>
                        <th>Utente/i</th>
                        <th>Punteggio</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.classifica.map((utente) => <RigaClassifica utente={utente} key={utente.nickname} />)
                    }
                </tbody>
                    </table>
                </div>
            </div>
        </>
    );

}

function RigaClassifica(props) {
    return (
        <>
            <tr>
                <td>{`#${props.utente.posizione}`}</td>
                <td>{props.utente.nickname}</td>
                <td>{props.utente.punteggio}</td>
            </tr>
        </>
    );
}



export default Ranking;

/*
<>
            <h1 className='titoloClassifica'> Classifica Top3 </h1>
            <table className="table text-center">
                <thead>
                    <tr>
                        <th>Posizione</th>
                        <th>Utente</th>
                        <th>Punteggio</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.classifica.map((utente) => <RigaClassifica utente={utente} key={utente.nickname} />)
                    }
                </tbody>
            </table>


        </>
*/