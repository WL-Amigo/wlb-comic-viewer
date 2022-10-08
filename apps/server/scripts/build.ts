import { execFile } from "child_process";
import { join as pathJoin, resolve as pathResolve } from "path";
import { mkdirp, move, copy, remove } from "fs-extra";

const targetOS = process.env.GOOS;
const targetArch = process.env.GOARCH;
const armVersion = process.env.GOARM;

const isTargetOSWindows = targetOS === "windows";

const backendArtifactFileName = "private-gallery-server";
const buildBackend = (): Promise<void> => {
  return new Promise<void>((res, rej) => {
    execFile(
      "go",
      ["build", "-ldflags", "-s -w", "-o", backendArtifactFileName, "main.go"],
      { cwd: pathResolve("./backend") },
      (error) => {
        if (error) {
          rej(error);
          return;
        }

        res();
      }
    );
  });
};

(async () => {
  // copy frontend build artifacts to ./backend/static/ for embedding
  await copy("./frontend/dist/", "./backend/static/");

  // build backend
  await buildBackend();

  // package frontend and backend
  const binFileName = `private-gallery${isTargetOSWindows ? ".exe" : ""}`;
  const distDir = `./dist/${targetOS}_${targetArch}${
    armVersion !== undefined ? `v${armVersion}` : ""
  }/`;
  // delete only build artifacts
  await remove(pathResolve(distDir, binFileName));
  await mkdirp(distDir);
  await move(
    "./backend/" + backendArtifactFileName,
    pathJoin(distDir, binFileName)
  );
})().catch((reason) => {
  console.error(reason);
  process.exit(1);
});
