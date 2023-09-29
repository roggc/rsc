import React from "react";
import { RCC } from "../../../rsc/server/components/rcc.js";
import Greeting from "./greeting.js";

export default async function Router({ componentName, props }) {
  switch (componentName) {
    case "greeting":
      return <Greeting {...props} />;
    default:
      return <RCC __isClient__="components/ups" />;
  }
}
