import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { Provider } from "jotai";
import App from "./components/app";
import React from "react";
import theme from "./theme";

createRoot(document.getElementById("app")).render(
  <ThemeProvider theme={theme}>
    <Provider>
      <App />
    </Provider>
  </ThemeProvider>
);
