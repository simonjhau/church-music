import { useAuth0 } from '@auth0/auth0-react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import AuthenticationButton from '../../Auth/AuthenticationButton';
import './NavigationBar.css';

const NavigationBar = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Navbar className="navBar" expand="sm">
      <Container fluid>
        <Navbar.Brand href="/">Church-Music</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navItem">
            {isAuthenticated && <Nav.Link href="/calendar">Calendar</Nav.Link>}
            {isAuthenticated && <Nav.Link href="/masses">Masses</Nav.Link>}
            {isAuthenticated && <Nav.Link href="/hymns">Hymns</Nav.Link>}
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
