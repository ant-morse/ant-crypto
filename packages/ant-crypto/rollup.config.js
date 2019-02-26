const babel = require("rollup-plugin-babel");
const { uglify } = require("rollup-plugin-uglify");

module.exports = [
  {
    input: "src/index.js",
    output: {
      file: "dist/index.js",
      format: "cjs",
    },
    external: ['ant-crypto-core'],
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        plugins: [["@babel/transform-runtime"]],
        presets: [["@babel/env", { loose: true }]],
      }),
      uglify(),
    ],
  },
];
