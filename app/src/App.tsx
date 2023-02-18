import "./App.css";

import { Container } from "@mui/material";
import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { NavBar } from "./components/general/NavBar";
import { AuthenticationGuard } from "./pages/AuthenticationGuard";
import { CalendarPage } from "./pages/CalendarPage";
import { HomePage } from "./pages/HomePage";
import { HymnsPage } from "./pages/HymnsPage";
import { MassesPage } from "./pages/MassesPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedPage } from "./pages/ProtectedPage";

function App(): ReactElement {
  return (
    <Container sx={{ bgcolor: "white", height: "100%", width: "100" }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/"
          element={<AuthenticationGuard component={HomePage} />}
        />
        <Route
          path="/calendar"
          element={<AuthenticationGuard component={CalendarPage} />}
        />
        <Route
          path="/hymns"
          element={<AuthenticationGuard component={HymnsPage} />}
        />
        <Route
          path="/masses"
          element={<AuthenticationGuard component={MassesPage} />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
}

export default App;
