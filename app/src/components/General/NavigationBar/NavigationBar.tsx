import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthenticationButton from '../../auth/AuthenticationButton';
import './NavigationBar.css';

const NavigationBar = () => {
  return (
    <Navbar className="navBar" expand="sm">
      <Container fluid>
        <Navbar.Brand href="/">Church-Music</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navItem">
            <Nav.Link href="/calendar">Calendar</Nav.Link>
            <Nav.Link href="/masses">Masses</Nav.Link>
            <Nav.Link href="/hymns">Hymns</Nav.Link>
          </Nav>
          <Nav className="justify-content-end" style={{ width: '100%' }}>
            <AuthenticationButton />
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
