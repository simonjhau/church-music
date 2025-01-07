import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { type ReactElement } from "react";
import { Link } from "react-router-dom";

import { theme } from "../../theme";

const navItems = ["masses", "hymns", "rankings"];

export const NavBar = (): ReactElement => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flexwrap", sm: "flex" },
            }}
          >
            <Link to="/">
              <Typography
                variant="h6"
                component="div"
                sx={{
                  marginLeft: "4px",
                  marginRight: 3,
                  textAlign: { sm: "left", xs: "center" },
                  color: "white",
                  whiteSpace: "nowrap",
                }}
              >
                Church Music
              </Typography>
            </Link>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "space-evenly", sm: "flex-start" },
              }}
            >
              {navItems.map((item) => (
                <Link to={item} key={`${item}-key`}>
                  <Button sx={{ color: "#fff" }}>{item}</Button>
                </Link>
              ))}
              <Link to="massAdmin" key={`mass-admin-key`}>
                <Button
                  sx={{ color: "#fff" }}
                  style={{
                    backgroundColor: theme.palette.primary.light,
                  }}
                >
                  Mass Admin
                </Button>
              </Link>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
