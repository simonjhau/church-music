import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found">
      <h2>Sorry</h2>
      <p>Page cannot be found</p>
      <Link to="/"></Link>
    </div>
  );
};

export default NotFoundPage;
