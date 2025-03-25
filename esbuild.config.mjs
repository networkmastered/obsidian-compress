import esbuild from "esbuild";
import process from "process";
import fs from "fs";
import path from "path";
import builtins from "builtin-modules";
import { execSync } from "child_process";

const banner = ""

const prod = (process.argv[2] === "production");

const context = await esbuild.context({
	banner: {
		js: banner,
	},
	entryPoints: ["main.ts"],
	bundle: true,
	external: [
		"obsidian",
		"electron",
		"@codemirror/autocomplete",
		"@codemirror/collab",
		"@codemirror/commands",
		"@codemirror/language",
		"@codemirror/lint",
		"@codemirror/search",
		"@codemirror/state",
		"@codemirror/view",
		"@lezer/common",
		"@lezer/highlight",
		"@lezer/lr",
		...builtins],
	format: "cjs",
	target: "es2018",
	logLevel: "info",
	sourcemap: prod ? false : "inline",
	treeShaking: true,
	outfile: "main.js",
	minify: prod,
});

const cyrb53 = (str, seed = 0) => {
	let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}
	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
	h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
	h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

async function fscn(pth = "./") {
	let hashr = '';
	let files = fs.readdirSync(pth)
	for (let i = 0; i < files.length; i++) {
		let file = files[i]
		const filePath = path.join(pth, file)
		if (fs.statSync(filePath).isFile()) {
			hashr += fs.readFileSync(filePath, 'utf-8')
		} else if (fs.statSync(filePath).isDirectory() && !filePath.includes("node_modules") && !filePath.includes("copies") && !filePath.includes(".git")) {
			hashr += await fscn(filePath)
		}
	}
	return hashr
}
if (prod) {
	await context.rebuild();
	process.exit(0);
} else {
	let lh = 0
	setTimeout(async () => {
		let ls = async () => {
			await fscn().then((data) => {
				let nh = cyrb53(data, 1)
				if (lh != nh) {
					execSync("node archive/versions/execute.js", { stdio: "inherit" })
					lh = nh
				}
			})
			await new Promise((r)=>setTimeout(r,250))
			ls()
		}
		ls()
	}, 1)
	await context.watch();
}
