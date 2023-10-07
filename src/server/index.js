import { getApp } from "rsc-module/server";
import Router from "./components/router.js";
import HTML from "./html.js";

const app = getApp(Router, HTML);
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
