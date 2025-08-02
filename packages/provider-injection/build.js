const esbuild = require("esbuild");
const { nodeBuiltIns } = require("esbuild-node-builtins");
// const { polyfillNode } = require("esbuild-plugin-polyfill-node");

const fs = require("fs");
const path = require("path");

const { DEFAULT_SOLANA_CONNECTION_URL, NODE_DEBUG, NODE_ENV } = process.env;

function clean(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Заменяем проблемную функцию getData на заглушку
    // content = content.replace(
    //   /function getData\(\)\s*\{[\s\S]*?return read_compressed_payload\(decode2\("AEQF2AO2DEsA2wIr[\s\S]*?"\)\);\s*\}/g,
    //   'function getData() { console.warn("ENS normalization disabled in webstore version"); return []; }'
    // );

    // Или полностью удаляем блок с минифицированными данными
    // content = content.replace(/"AEQF2AO2DEsA2wIr[^"]*"/g, '"ABC"');

    fs.writeFileSync(filePath, content);
    console.log("✅ Cleaned webstore file from compressed data");
  } catch (e) {
    console.warn("Error cleaning file", e);
    throw e;
  }
}

const minify = (filePath) => {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    content = content
      .replace(/\s+/g, " ")
      .replace(/;\s*}/g, ";}")
      .replace(/{\s*/g, "{")
      .replace(/decode2\("[^"]*"\)/g, "[]");

    fs.writeFileSync(filePath, content);
    console.log("✅ Minified file");
  } catch (e) {
    console.warn("Error minifying file", e);
    throw e;
  }
};

esbuild
  .context({
    bundle: true,
    metafile: true,
    define: {
      global: "globalThis",
      isMobileInjectedProvider: "true",
      "process.env": JSON.stringify({
        DEFAULT_SOLANA_CONNECTION_URL,
        NODE_DEBUG,
        NODE_ENV,
      }),
    },
    plugins: [
      nodeBuiltIns(),
      // polyfillNode({
      //   polyfills: {
      //     crypto: true,
      //   },
      // }),
      // {
      //   name: "customMinify",
      //   setup(build) {
      //     build.onEnd((result) => {
      //       if (result.errors.length === 0) {
      //         minify("./dist/browser/index.js");
      //       }
      //     });
      //   },
      // },
      // {
      //   name: "buildStatus",
      //   setup(build) {
      //     let count = 0;
      //     build.onEnd((result) => {
      //       console.log(
      //         `${count++ > 0 ? "re" : ""}built provider-injection, with ${
      //           result.errors.length
      //         } errors`
      //       );

      //       if (result.errors.length === 0) {
      //         clean("./dist/browser/index.js");
      //       }

      //       if (fs.existsSync("../app-mobile/assets")) {
      //         fs.cp(
      //           "./dist/browser/index.js",
      //           "../app-mobile/assets/provider.html",
      //           () => {}
      //         );
      //       }
      //     });
      //   },
      // },
      {
        // This is used for analyzing the bundle size, it can be
        // uploaded to https://esbuild.github.io/analyze/
        name: "metafileWriter",
        setup(build) {
          build.onEnd((result) => {
            const filePath = "./dist/browser/metafile.json";
            if (
              process.env.METAFILE &&
              result.metafile &&
              result.errors.length === 0
            ) {
              fs.writeFile(
                path.join(__dirname, filePath),
                JSON.stringify(result.metafile),
                (err) => {
                  if (err) {
                    console.error("error writing metafile", err);
                  } else {
                    console.log(`metafile written to ${filePath}`);
                  }
                }
              );
            } else {
              fs.rm(path.join(__dirname, filePath), () => {});
            }
          });
        },
      },
    ],
    entryPoints: ["./src/index.ts"],
    outfile: "./dist/browser/index.js",
    target: ["chrome114"],
    minify: true, // TODO: process.env.NODE_ENV === "production"
    sourcemap: false, // TODO: external for extension, false for mobile
    legalComments: "none", // TODO: inline for extension, external for mobile
    treeShaking: true,
  })
  .then((ctx) => {
    ctx.watch().then(() => {
      process.argv.includes("--watch")
        ? console.log("watching...")
        : ctx.dispose();
    });
  });
