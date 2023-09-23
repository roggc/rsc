import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { Provider } from "./slices";
import App from "./components/app";
import React from "react";
import theme from "./theme";

createRoot(document.getElementById("myapp")).render(
  <ThemeProvider theme={theme}>
    <Provider>
      <App />
    </Provider>
  </ThemeProvider>
);
