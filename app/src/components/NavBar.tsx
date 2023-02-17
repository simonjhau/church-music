import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type ReactElement } from "react";

import AuthenticationButton from "./auth/AuthenticationButton";

const navItems = ["Calendar", "Hymns", "Masses"];

export const NavBar = (): ReactElement => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                marginRight: 3,
                display: { sm: "block" },
                textAlign: "left",
              }}
            >
              Church Music
            </Typography>

            {navItems.map((item) => (
              <Button key={item} sx={{ color: "#fff" }}>
                {item}
              </Button>
            ))}
          </Box>
          <Box sx={{ justify: "right", align: "right" }}>
            <AuthenticationButton />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
