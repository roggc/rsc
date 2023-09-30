import eject from "rsc-module";

eject({
  sourceDir: "./node_modules",
  destDir: ".",
  codeFiles: ["src/**/*.{js,jsx,ts,tsx,mjs,es,es6}"],
  dependenciesFilter: (set) => {
    for (const e of set) {
      if (e === "rsc-module") {
        const newSet = new Set();
        newSet.add(e);
        return newSet;
      }
    }
  },
});
