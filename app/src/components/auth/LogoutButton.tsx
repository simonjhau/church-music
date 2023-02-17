import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import { red } from "@mui/material/colors";
import { type ReactElement } from "react";

const LogoutButton = (): ReactElement => {
  const { logout } = useAuth0();
  const color = red[800];
  return (
    <Button
      sx={{ color: "white", bgcolor: color }}
      onClick={() => {
        logout({ logoutParams: { returnTo: window.location.origin } });
      }}
    >
      Log Out
    </Button>
  );
};

export default LogoutButton;
