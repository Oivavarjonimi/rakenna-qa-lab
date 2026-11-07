/** Itseriittoinen ZIP-pakkaus Node.js:n vakio-osilla. Ei sisällä julkaisun tunnisteita. */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { deflateRawSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputs = [
  "src",
  "tests",
  "docs",
  ".github",
  "scripts",
  "public",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "vite.config.ts",
  "vitest.config.ts",
  "playwright.config.ts",
  "index.html",
  ".gitignore",
  "README.md",
];
const table = Array.from({ length: 256 }, (_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit++)
    crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  return crc >>> 0;
});
function checksum(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function filesAt(relative) {
  const absolute = path.join(root, relative);
  try {
    return readdirSync(absolute, { withFileTypes: true }).flatMap((entry) =>
      entry.isDirectory()
        ? filesAt(path.join(relative, entry.name))
        : entry.isFile() && !entry.name.endsWith(".zip")
          ? [path.join(relative, entry.name)]
          : [],
    );
  } catch (error) {
    if (error.code === "ENOTDIR") return [relative];
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
const records = [],
  directory = [];
let offset = 0;
for (const filename of inputs.flatMap(filesAt).sort()) {
  const name = Buffer.from(
    "rakenna-qa-lab/" + filename.split(path.sep).join("/"),
  );
  const bytes = readFileSync(path.join(root, filename));
  const compressed = deflateRawSync(bytes, { level: 9 });
  const crc = checksum(bytes);
  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x800, 6);
  local.writeUInt16LE(8, 8);
  local.writeUInt16LE(((2026 - 1980) << 9) | (11 << 5) | 7, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(compressed.length, 18);
  local.writeUInt32LE(bytes.length, 22);
  local.writeUInt16LE(name.length, 26);
  records.push(local, name, compressed);
  const central = Buffer.alloc(46);
  central.writeUInt32LE(0x02014b50, 0);
  central.writeUInt16LE(20, 4);
  central.writeUInt16LE(20, 6);
  central.writeUInt16LE(0x800, 8);
  central.writeUInt16LE(8, 10);
  central.writeUInt16LE(((2026 - 1980) << 9) | (11 << 5) | 7, 14);
  central.writeUInt32LE(crc, 16);
  central.writeUInt32LE(compressed.length, 20);
  central.writeUInt32LE(bytes.length, 24);
  central.writeUInt16LE(name.length, 28);
  central.writeUInt32LE(offset, 42);
  directory.push(central, name);
  offset += local.length + name.length + compressed.length;
}
const centralBytes = Buffer.concat(directory);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(directory.length / 2, 8);
end.writeUInt16LE(directory.length / 2, 10);
end.writeUInt32LE(centralBytes.length, 12);
end.writeUInt32LE(offset, 16);
mkdirSync(path.join(root, "public"), { recursive: true });
writeFileSync(
  path.join(root, "public/rakenna-qa-lab-lahdekoodi.zip"),
  Buffer.concat([...records, centralBytes, end]),
);
console.log(`Lähdekoodipaketti valmis: ${directory.length / 2} tiedostoa.`);
