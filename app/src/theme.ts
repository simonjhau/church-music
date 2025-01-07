import { createTheme } from "@mui/material";
import { amber, blueGrey, green, indigo, red } from "@mui/material/colors";

export const theme = createTheme({
  palette: {
    primary: {
      main: indigo[400],
    },
    secondary: {
      main: indigo[400],
      light: indigo[50],
    },
    error: {
      main: red[500],
    },
    warning: {
      main: amber[500],
    },
    info: {
      main: blueGrey[500],
    },
    success: {
      main: green[500],
    },
  },
  spacing: 4,
});
