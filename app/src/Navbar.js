import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/">
        <h1>Home</h1>
      </Link>
      <Link to="/hymns">
        <h1>Music</h1>
      </Link>
      <Link to="/upload">
        <h1>Upload</h1>
      </Link>
    </nav>
  );
};

export default Navbar;
