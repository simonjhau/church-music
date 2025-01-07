import "./index.css";

import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { Auth0ProviderWithNavigate } from "./Auth0ProviderWithNavigate";
import { theme } from "./theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </React.StrictMode>,
);
