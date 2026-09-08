import { build } from "esbuild";
import { mkdir, rm, cp, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// Review build of the same component used by the Next.js homepage.
// Account, purchase and waitlist links retain the live Anticipy flows.
const base = process.cwd();
const temporary = path.join(base, ".design-preview");
await rm(path.join(base, "dist"), { recursive: true, force: true });
await mkdir(path.join(base, "dist/assets"), { recursive: true });
await mkdir(temporary, { recursive: true });
await build({
  stdin: {
    contents:
      'import React from "react"; import {renderToString} from "react-dom/server"; import {AnticipyLanding} from "./src/components/redesign/AnticipyLanding"; export const html=renderToString(<AnticipyLanding preview />);',
    resolveDir: base,
    loader: "tsx",
  },
  outfile: path.join(temporary, "render.cjs"),
  bundle: true,
  platform: "node",
  format: "cjs",
  packages: "external",
  jsx: "automatic",
  loader: { ".css": "empty" },
});
const { html } = createRequire(import.meta.url)(
  path.join(temporary, "render.cjs"),
);
await build({
  entryPoints: ["design-preview/client.tsx"],
  outfile: "dist/assets/site.js",
  bundle: true,
  minify: true,
  jsx: "automatic",
  target: ["es2020"],
  external: ["/redesign/*"],
  define: { "process.env.NODE_ENV": '"production"' },
  legalComments: "none",
});
await cp("public/redesign", "dist/redesign", { recursive: true });
await cp("public/og.png", "dist/og.png");
await cp("src/app/icon.svg", "dist/icon.svg");
await writeFile(
  "dist/index.html",
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f1f2f3"><meta name="robots" content="noindex"><title>Anticipy — Life, a little lighter.</title><meta name="description" content="Meet Anticipy, the titanium AI pendant that turns the things you say into the things you get done."><meta property="og:title" content="Anticipy — Life, a little lighter."><meta property="og:description" content="A quiet companion for a beautifully busy life."><meta property="og:image" content="/og.png"><link rel="icon" href="/icon.svg"><link rel="preload" href="/redesign/fonts/dm-sans-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/site.css"><style>html{scroll-behavior:smooth}body{margin:0}button,input{font:inherit}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style></head><body><div id="root">${html}</div><script type="module" src="/assets/site.js"></script></body></html>`,
);
await writeFile("dist/robots.txt", "User-agent: *\nDisallow: /\n");
console.log("Static review build ready in dist/");
