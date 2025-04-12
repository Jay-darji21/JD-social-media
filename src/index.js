import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./custom.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import { makeServer } from "./mockApi";
import { ThemeProvider } from './Theme/ThemeContext';

// Initialize the mock server in development
if (process.env.NODE_ENV === "development") {
  makeServer();
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
