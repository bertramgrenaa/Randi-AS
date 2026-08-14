// One-off generator for placeholder product SVGs referenced by data/randi-products.json.
// Run with: node scripts/gen-product-images.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const catalog = JSON.parse(
  readFileSync(join(root, "data/randi-products.json"), "utf-8")
);

const finishColors = {
  "Rustfrit stål (satin)": ["#c7ccd1", "#8b9096"],
  "Rustfrit stål (poleret)": ["#dfe3e6", "#9aa0a6"],
  "Mat sort (pulverlakeret)": ["#3a3a3d", "#1c1c1e"],
  "Børstet messing": ["#d8b978", "#a9822f"],
  "Hvid (pulverlakeret)": ["#f5f5f4", "#d4d4d2"],
  "Hvid": ["#f5f5f4", "#d4d4d2"],
  "Sølv/eloxeret aluminium": ["#dcdfe2", "#a6acb2"],
};

function colorsFor(finish) {
  return finishColors[finish] || ["#e5e7eb", "#9ca3af"];
}

function svgFor(product) {
  const [c1, c2] = colorsFor(product.finish);
  const label = product.name.replace(/&/g, "&amp;");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="#f8f7f5"/>
  <rect x="20" y="20" width="360" height="260" rx="16" fill="#ffffff" stroke="#e7e5e4" stroke-width="1"/>
  <rect x="150" y="60" width="24" height="180" rx="12" fill="url(#g)" stroke="#00000022" stroke-width="1"/>
  <rect x="150" y="60" width="100" height="24" rx="12" fill="url(#g)" stroke="#00000022" stroke-width="1"/>
  <circle cx="200" cy="150" r="6" fill="#00000033"/>
  <text x="200" y="270" font-family="Helvetica, Arial, sans-serif" font-size="13" fill="#57534e" text-anchor="middle">${label}</text>
</svg>`;
}

let count = 0;
for (const group of Object.values(catalog)) {
  if (!Array.isArray(group)) continue;
  for (const product of group) {
    if (!product.imagePath) continue;
    const outPath = join(root, "public", product.imagePath.replace(/^\//, ""));
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, svgFor(product));
    count++;
  }
}
console.log(`Generated ${count} placeholder product SVGs.`);
