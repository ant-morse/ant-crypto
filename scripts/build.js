const path = require("path");
const execSync = require("child_process").execSync;

function exec(cmd) {
  execSync(cmd, { stdio: "inherit", env: process.env });
}

const cwd = process.cwd();

["ant-crypto-utils", "ant-crypto-core", "ant-crypto"].forEach(
  packageName => {
    process.chdir(path.resolve(__dirname, `../packages/${packageName}`));
    exec("npm run build");
  },
);

process.chdir(cwd);
