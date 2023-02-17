import "./App.css";

import { Container } from "@mui/material";
import { type ReactElement } from "react";
import { Route, Routes } from "react-router-dom";

import { AuthenticationGuard } from "./components/AuthenticationGuard";
import { NavBar } from "./components/NavBar";
import { CallbackPage } from "./pages/CallbackPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProtectedPage } from "./pages/ProtectedPage";

function App(): ReactElement {
  return (
    <Container sx={{ bgcolor: "white", height: "100%", width: "100" }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/protected"
          element={<AuthenticationGuard component={ProtectedPage} />}
        />

        <Route path="/callback" element={<CallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Container>
  );
}

export default App;
