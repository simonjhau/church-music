import { Container } from "@mui/material";
import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { NavBar } from "./components/general/NavBar";
import { AuthenticationGuard } from "./pages/AuthenticationGuard";
import { HomePage } from "./pages/HomePage";
import { HymnRankingsPage } from "./pages/HymnRankingsPage";
import { HymnsPage } from "./pages/HymnsPage";
import { MassAdminPage } from "./pages/MassAdminPage";
import { MassesPage } from "./pages/MassesPage";
import { NotFoundPage } from "./pages/NotFoundPage";

function App(): ReactElement {
  return (
    <>
      <NavBar />
      <Container
        sx={{
          backgroundColor: "white",
          marginTop: "80px",
          maxWidth: "md",
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/"
            element={<AuthenticationGuard component={HomePage} />}
          />
          <Route
            path="/masses"
            element={<AuthenticationGuard component={MassesPage} />}
          />
          <Route
            path="/hymns/*"
            element={<AuthenticationGuard component={HymnsPage} />}
          />
          <Route
            path="/massAdmin/*"
            element={<AuthenticationGuard component={MassAdminPage} />}
          />
          <Route
            path="/rankings"
            element={<AuthenticationGuard component={HymnRankingsPage} />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
