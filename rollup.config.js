import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import { globby } from "globby";
import alias from "@rollup/plugin-alias";
import image from "@rollup/plugin-image";

export default [
  // {
  //   input: "rsc/client/components/rsc.js",
  //   output: {
  //     format: "es",
  //     file: "rsc-dist/client.js",
  //   },
  //   plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" })],
  // },
  // {
  //   input: "rsc/server/index.js",
  //   output: {
  //     format: "es",
  //     file: "rsc-dist/server.js",
  //   },
  //   plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" })],
  // },
  {
    input: {
      index: "src/server/index.js",
      router: "src/server/components/router.js",
    },
    output: {
      dir: "dist",
      format: "es",
      preserveModules: true,
    },
    plugins: [babel({ babelHelpers: "bundled", exclude: "node_modules/**" })],
  },
  {
    input: (await globby("src/client/*.js"))
      .concat(await globby("src/client/components/*.js"))
      .reduce(
        (acc, entryFile) => ({
          ...acc,
          [entryFile.replace(".js", "")]: entryFile,
        }),
        {}
      ),
    output: {
      dir: "public",
      format: "es",
      entryFileNames: "[name].js",
      preserveModules: true,
    },
    plugins: [
      peerDepsExternal(),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
      }),
      alias({
        entries: [
          {
            find: "styled-components",
            replacement: "styled-components/dist/styled-components.js",
          },
        ],
      }),
      nodeResolve(),
      commonjs(),
      json(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("development"),
      }),
      image(),
    ],
    onwarn: function (warning, handler) {
      // Skip certain warnings

      // should intercept ... but doesn't in some rollup versions
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }

      // console.warn everything else
      handler(warning);
    },
  },
];
