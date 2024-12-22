import fs from "fs";
import noRefAccessor from "./no-ref-accessor.js";

const pkg = JSON.parse(
  fs.readFileSync(new URL("./package.json", import.meta.url), "utf8")
);

/** @type {import('eslint').Plugin} */
const plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    "no-ref-accessor": noRefAccessor,
  },
};

export default plugin;
