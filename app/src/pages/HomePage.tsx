import { useAuth0, User } from '@auth0/auth0-react';

const Home = () => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const { isAuthenticated, user } = useAuth0();
  return (
    <div className="home">
      <h2>Welcome to the Church Music app!</h2>
      {isAuthenticated ? (
        <div>
          <p>
            Hi {capitalizeFirstLetter((user as User).nickname as string)},<br />
            Feel free to look around!
          </p>
        </div>
      ) : (
        <p>Please log in to use this application</p>
      )}
    </div>
  );
};

export default Home;
