import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type ReactElement } from "react";
import { Link } from "react-router-dom";

const navItems = ["Calendar", "Hymns", "Masses"];

export const NavBar = (): ReactElement => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              flexShrink: 1,
              display: { xs: "flexwrap", sm: "flex" },
            }}
          >
            <Link to="/">
              <Typography
                variant="h6"
                component="div"
                sx={{
                  marginRight: 3,
                  display: { sm: "block" },
                  textAlign: { sm: "left", xs: "center" },
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                Church Music
              </Typography>
            </Link>

            {navItems.map((item) => (
              <Link to={item} key={`${item}-key`}>
                <Button sx={{ color: "#fff" }}>{item}</Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
