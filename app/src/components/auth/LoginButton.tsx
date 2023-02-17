import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { blue } from "@mui/material/colors";
import { type ReactElement } from "react";

const LoginButton = (): ReactElement => {
  const { loginWithRedirect } = useAuth0();
  const color = blue[800];
  return (
    <Button
      variant="contained"
      sx={{ color, bgcolor: "white" }}
      onClick={() => {
        loginWithRedirect().catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      }}
    >
      Log In
    </Button>
  );
};

export default LoginButton;
