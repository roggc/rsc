import React from "react";

export default function Layout({ id, title }) {
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
