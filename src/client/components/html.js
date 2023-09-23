import React from "react";

export default function HTML({ id, title }) {
  return (
    <html>
      <head>
        <title>{title}</title>
      </head>
      <body>
        <div id={id}></div>
      </body>
    </html>
  );
}
