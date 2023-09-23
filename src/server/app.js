import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import Router from "./components/router.js";
import { renderJSXToClientJSX, stringifyJSX } from "./utils/index.js";
import React from "react";
import HTML from "../client/components/html.js";

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/favicon.ico", (req, res, next) => {
  res.end("");
});

app.use(async (req, res, next) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === "/") {
      const { pipe } = renderToPipeableStream(<HTML id="myapp" title=";-)" />, {
        bootstrapModules: ["src/client/index.js"],
        onShellReady() {
          res.setHeader("content-type", "text/html");
          pipe(res);
        },
      });
    } else {
      const clientJSX = await renderJSXToClientJSX(
        <Router url={url} body={req.body} />
      );
      const clientJSXString = JSON.stringify(clientJSX, stringifyJSX);
      res.setHeader("Content-Type", "application/json");
      res.end(clientJSXString);
    }
  } catch (err) {
    next(err);
  }
});

app.use(function (err, req, res) {
  console.error(err);
  res.status(err.status || 500);
  res.end();
});

const port = 8080;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
