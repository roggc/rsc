# RSC

This is a setup for development with RSC (React Server Components), without SSR (Server Side Rendering). Another setup for development with RSC and SSR can be found [here](https://github.com/roggc/rsc-ssr).

## How to install and run the project.

1. **npm i**
2. **npm run dev**
3. **npm run app** (in a new terminal window)
4. enter **localhost:8080** in the browser.

## Instructions on how to develop with this setup

In this setup you first, for example, define an RCC (React Client Component) that needs data from the server.

Then you should define the corresponding RSC to this RCC. Let's say you defined `Greeting` RCC. Then you should define a `Greeting` RSC.

```javascript
// I am a RCC. I am located in the 'src/client/components' folder.
import React from "react";

export default function Greeting({ greeting }) {
  return <>{greeting}</>;
}
```

```javascript
// I am a RSC. I am located in the 'src/server/components' folder, and I am async.
import React from "react";
import RCC from "./rcc";

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

  return <RCC greeting={greeting} __isClient__="../components/greeting.js" />;
}
```

Then in the `Router` RSC you should add the name of the component in the switch statement.

```javascript
// I am a RSC ...
import React from "react";
import RCC from "./rcc.js";
import Greeting from "./greeting.js";

export default async function Router({ url, body: { props } }) {
  switch (url.pathname.slice(1)) {
    case "greeting":
      return <Greeting {...props} />;
    default:
      return <RCC __isClient__="../components/ups.js" />;
  }
}
```

Finally you should "call" `Greeting` RSC from a RCC using the `RSC` RCC.

```javascript
// I am a RCC
import React from "react";
import RSC from "./rsc.js";

export default function SomeRCC() {
  // ...
  return (
    <>
      {/* ... */}
      <RSC componentName="greeting">loading ...</RSC>;{/* ... */}
    </>
  );
}
```

`RSC` itself is a RCC, a special one. Next is its definition.

```javascript
// I am a RCC. I am located in the 'src/client/components' folder.
import React, { useEffect, useState } from "react";
import { fillJSXWithClientComponents, parseJSX } from "../utils/index.js";

export default function RSC({
  componentName,
  children = <>loading ...</>,
  errorJSX = <>something went wrong</>,
  ...props
}) {
  const [JSX, setJSX] = useState(children);
  const body = JSON.stringify({ props });

  useEffect(() => {
    setJSX(children);
    fetch(`/${componentName}`, {
      method: "post",
      headers: { "content-type": "application/json" },
      body,
    })
      .then(async (response) => {
        const clientJSXString = await response.text();
        const clientJSX = JSON.parse(clientJSXString, parseJSX);
        const fixedClientJSX = await fillJSXWithClientComponents(clientJSX);
        setJSX(fixedClientJSX);
      })
      .catch(() => setJSX(errorJSX));
  }, [componentName, body]);

  return JSX;
}
```

And next is the definition of `RCC` RSC, found before.

```javascript
// I am a RSC. I am located in the 'src/server/components' folder.
export default async function RCC() {
  return null;
}
```

As you can see it does nothing.

You can pass props to `RSC` RCC:

```javascript
// I am a RCC
export default function SomeRCC() {
  // ...
  return (
    <>
      {/* ... */}
      <RSC componentName="say-hello" name="Roger">
        loading ...
      </RSC>
      {/* ... */}
    </>
  );
}
```

Then in `SayHello` RSC you get these props.

```javascript
// I am a RSC
export default async function SayHello({ name }) {
  const greeting = await new Promise((r) =>
    setTimeout(() => {
      switch (name) {
        case "Roger":
          return r("hey, whatsup...");
        default:
          return r("hello, how r u doing?");
      }
    }, 500)
  );
  return <RCC __isClient__="../components/say-hello.js" greeting={greeting} />;
}
```

Then in your `SayHello` RCC you will have:

```javascript
export default function SayHello({ greeting }) {
  return <>{greeting}</>;
}
```

You see how we "called" the `RSC` RCC with a prop `name`, which was used to fetch data on the `SayHello` RSC, and then this data (`greeting`), was passed as another prop to the call of `RCC` RSC, which in turn ended up in the `SayHello` RCC.

The `Router` RSC will be then:

```javascript
export default async function Router({ url, body: { props } }) {
  switch (url.pathname.slice(1)) {
    case "say-hello":
      return <SayHello {...props} />;
    default:
      return <RCC __isClient__="../components/ups.js" />;
  }
}
```

The call to `RSC` RCC from any RCC is like a barrier for the flow of props which are functions, because functions cannot be stringified. So in this case use [react-context-slices](https://react-context-slices.github.io/) to set the function into the global shared state and then recover its value down in the tree of RCC's, bypassing in this way the barrier that `RSC` RCC's are for this type of values (functions).

## React.Suspense not implemented

React.Suspense is not implemented in this setup so don't use it (you will get an error or exception thrown). But in theory you don't need it, with the use of `RSC` RCC that fetches the server. If I am wrong about this point let me know.
