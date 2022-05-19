import { useAuth0, User } from '@auth0/auth0-react';
import React from 'react';

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      {isAuthenticated && (
        <div>
          <img src={(user as User).picture} alt={(user as User).name} />
          <h2>{(user as User).name}</h2>
          <p>{(user as User).email}</p>
        </div>
      )}
    </>
  );
};

export default Profile;
