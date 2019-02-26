const babel = require("rollup-plugin-babel");
const { uglify } = require("rollup-plugin-uglify");

module.exports = [
  {
    input: "src/msrcrypto.js",
    output: {
      file: `dist/msrcrypto.min.js`,
      format: "cjs",
    },
    plugins: [
      babel({
        presets: [["@babel/env", { "loose": true }]],
      }),
      uglify(),
    ],
  },
  {
    input: "src/msrcrypto.aes.js",
    output: {
      file: `dist/msrcrypto.aes.min.js`,
      format: "cjs",
    },
    plugins: [
      babel({
        presets: [["@babel/env", { "loose": true }]],
      }),
      uglify(),
    ],
  },
];
