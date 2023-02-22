import 'bootstrap/dist/css/bootstrap.min.css';
import './PageLayout.css';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import MyNavbar from './MyNavbar';
import MySidebar from './MySidebar';

function PageLayout(props) {
    return (
      <Container fluid>
        <Row>
          <MyNavbar />
        </Row>
        <Row>
          <Col md={3} sm={12} className="p-0">
            <MySidebar/>
          </Col>
          <Col md={9} sm={12}>
            <div className="main-content"><Outlet/></div>
          </Col>
        </Row>
      </Container>
    );
  }

  export default PageLayout;
  
