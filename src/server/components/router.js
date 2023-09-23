import React from "react";
import RCC from "./rcc.js";
import GreetingRSC from "./greeting-rsc.js";

export default async function Router({ url, body: { props } }) {
  switch (url.pathname.slice(1)) {
    case "greeting":
      return <GreetingRSC {...props} />;
    default:
      return <RCC __isClient__="../components/ups.js" />;
  }
}
