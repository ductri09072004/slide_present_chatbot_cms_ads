const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT) || 5180;
const ROOT = __dirname;

const TYPES = {
	".html": "text/html; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".webp": "image/webp",
	".woff2": "font/woff2",
};

// Chỉ phục vụ file tĩnh của bộ slide; server.js và package.json không được lộ ra.
const HIDDEN = new Set(["server.js", "package.json"]);

http
	.createServer((req, res) => {
		let pathname;
		try {
			pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
		} catch {
			res.writeHead(400).end("Bad request");
			return;
		}

		const file = path.normalize(path.join(ROOT, pathname === "/" ? "index.html" : pathname));
		const type = TYPES[path.extname(file)];
		if (!file.startsWith(ROOT + path.sep) || !type || HIDDEN.has(path.basename(file))) {
			res.writeHead(404).end("Not found");
			return;
		}

		fs.readFile(file, (err, data) => {
			if (err) {
				res.writeHead(404).end("Not found");
				return;
			}
			res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
			res.end(data);
		});
	})
	.listen(PORT, "127.0.0.1", () => {
		console.log(`Slide chatbot: http://localhost:${PORT}`);
	});
