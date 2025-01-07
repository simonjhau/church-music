import { useAuth0 } from "@auth0/auth0-react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { type ReactElement } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = (): ReactElement => {
  const { user } = useAuth0();

  const navigate = useNavigate();

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center" }}>
      <Typography variant="h4">
        Hi {user?.nickname ? capitalizeFirstLetter(user.nickname) : "there"} 👋
        , welcome to the church music app!
      </Typography>
      <Button
        size={"large"}
        variant={"contained"}
        sx={{
          maxWidth: "450px",
        }}
        onClick={() => {
          navigate("masses");
        }}
      >
        Download mass music
      </Button>
    </Stack>
  );
};
