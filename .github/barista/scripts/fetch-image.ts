#!/usr/bin/env bun
// Downloads a GitHub-hosted image attachment to /tmp and prints the local path.
// Restricted to github.com user-attachments and *.githubusercontent.com to
// prevent SSRF via arbitrary URLs in issue bodies.
//
// Usage: ./fetch-image.ts <url>
//        Read the printed path with the Read tool to view the image.

import { CryptoHasher } from "bun";

const url = process.argv[2];
if (!url) {
  console.error("usage: fetch-image.ts <url>");
  process.exit(1);
}

const ALLOWED_PREFIXES = [
  "https://github.com/user-attachments/",
  "https://user-images.githubusercontent.com/",
  "https://private-user-images.githubusercontent.com/",
  "https://avatars.githubusercontent.com/",
];
if (!ALLOWED_PREFIXES.some(p => url.startsWith(p))) {
  console.error("Error: only GitHub user-attachments and *.githubusercontent.com URLs are allowed");
  console.error(`Got: ${url}`);
  process.exit(1);
}

const hash = new CryptoHasher("sha256").update(url).digest("hex").slice(0, 16);
const extMatch = url.match(/\.(png|jpg|jpeg|gif|webp|svg)/);
const ext = extMatch ? extMatch[0] : ".png";
const out = `/tmp/barista-img-${hash}${ext}`;

if (!(await Bun.file(out).exists())) {
  const headers: Record<string, string> = {};
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(30_000) });
  if (!res.ok) {
    console.error(`Error: fetch failed ${res.status} ${res.statusText}`);
    process.exit(1);
  }
  await Bun.write(out, await res.arrayBuffer());
}

console.log(out);
