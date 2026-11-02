// Nhúng deck.json và slides/*.html vào index.html để deploy chỉ cần một file.
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const deck = JSON.parse(fs.readFileSync(path.join(ROOT, "deck.json"), "utf8"));
const slides = {};
for (const id of deck.order) {
	slides[id] = fs.readFileSync(path.join(ROOT, "slides", `${id}.html`), "utf8");
}

// Escape "<" để nội dung slide không đóng thẻ <script> sớm.
const data = JSON.stringify({ deck, slides }).replace(/</g, "\u003c");

const file = path.join(ROOT, "index.html");
const html = fs.readFileSync(file, "utf8");
const pattern = /const EMBEDDED = .*?; \/\*EMBEDDED_DECK\*\//;
if (!pattern.test(html)) throw new Error("Không tìm thấy marker EMBEDDED_DECK trong index.html");
fs.writeFileSync(file, html.replace(pattern, () => `const EMBEDDED = ${data}; /*EMBEDDED_DECK*/`));
console.log(`Đã nhúng ${deck.order.length} slide vào index.html`);
