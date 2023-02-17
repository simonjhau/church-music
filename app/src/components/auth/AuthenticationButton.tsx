import { useAuth0 } from "@auth0/auth0-react";
import { type ReactElement } from "react";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const AuthenticationButton = (): ReactElement => {
  const { isAuthenticated } = useAuth0();

  return isAuthenticated ? <LogoutButton /> : <LoginButton />;
};

export default AuthenticationButton;
