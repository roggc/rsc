import React from "react";
import { RCC } from "../../../rsc/server/components/rcc.js";

export default async function Greeting() {
  const value = Math.random() < 0.5;
  const greeting = await new Promise((r) =>
    setTimeout(() => {
      switch (value) {
        case true:
          return r("Whatsupp!!!");
        case false:
          return r("How r u doing?");
      }
    }, 500)
  );

  return <RCC __isClient__="components/greeting" greeting={greeting} />;
}
