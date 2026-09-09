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
      'import React from "react"; import {renderToString} from "react-dom/server"; import {AnticipyLanding} from "./src/components/redesign/AnticipyLanding"; export const html=renderToString(<AnticipyLanding preview />); export const campaignHtml=renderToString(<AnticipyLanding preview campaign />);',
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
const { html, campaignHtml } = createRequire(import.meta.url)(
  path.join(temporary, "render.cjs"),
);
await build({
  entryPoints: ["design-preview/client.tsx"],
  outdir: "dist/assets",
  entryNames: "site",
  chunkNames: "chunks/[name]-[hash]",
  format: "esm",
  splitting: true,
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
const document = (content, campaign = false) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#f8f7f4"><meta name="robots" content="noindex"><title>Anticipy — Not a note taker. An action taker.</title><meta name="description" content="Meet Anticipy, the titanium AI pendant that turns the things you say into the things you get done."><meta property="og:title" content="Anticipy — Not a note taker. An action taker."><meta property="og:description" content="A quiet companion for a beautifully busy life."><meta property="og:image" content="/og.png"><link rel="icon" href="/icon.svg"><link rel="preload" href="/redesign/fonts/dm-sans-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/assets/site.css"><style>html{scroll-behavior:auto}body{margin:0}button,input{font:inherit}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}</style></head><body><div id="root">${content}</div><script type="module" src="/assets/site.js"></script></body></html>`;
await writeFile("dist/index.html", document(html));
await mkdir("dist/action-taker", { recursive: true });
await writeFile("dist/action-taker/index.html", document(campaignHtml, true));
await writeFile("dist/robots.txt", "User-agent: *\nDisallow: /\n");
console.log("Static review build ready in dist/");
