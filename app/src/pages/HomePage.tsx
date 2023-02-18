import { useAuth0 } from "@auth0/auth0-react";
import { Box, Typography } from "@mui/material";
import { type ReactElement } from "react";

export const HomePage = (): ReactElement => {
  const { user } = useAuth0();

  const capitalizeFirstLetter = (string: string): string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Box>
      <Typography variant="h4">
        Hi {user?.nickname ? capitalizeFirstLetter(user.nickname) : "there"} 👋
        , welcome to the church music app!
      </Typography>
    </Box>
  );
};
