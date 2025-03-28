
import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting, FileView } from 'obsidian';
// import { inflate, deflate } from "./util/pako"
// import { encodeSafe, decodeSafe } from "./util/runlength"
import { netcompress, netdecompress, plugincompress, plugindecompress } from "./util/networkmastercompression"

interface compressorSettingsData {
	// mySetting: string;
	PrintResult: boolean;
	FileSize: boolean;
	LeaveRawLinks: boolean;
	Debug: boolean;
	// PakoCompress: boolean;
	ExcalidrawPrecision: number;
}

const DEFAULT_SETTINGS: compressorSettingsData = {
	// mySetting: 'default',
	PrintResult: false,
	FileSize: false,
	LeaveRawLinks: true,
	Debug: false,
	// PakoCompress: true,
	ExcalidrawPrecision: 2,
}
let globalLeafs: any[] = []
let NoticePool: Notice[] = []
let statusBarItemEl2: (undefined | HTMLElement);
export default class compressorPlugin extends Plugin {
	settings: compressorSettingsData;

	async onload() {
		let loadTime = new Date().getTime()

		this.registerExtensions(["ctxt"], "ctxt")

		this.registerView("ctxt",
			(leaf) => {
				let hook = new MarkdownView(leaf)
				let f = setInterval(() => {
					let file = hook.file || this.app.workspace.getActiveFile()
					if (file) {
						clearInterval(f)
						if (file && file.extension == "ctxt") {
							//attempt to stop obsidian changing contents to compressed
							hook.unload()
							hook.canAcceptExtension("")
							hook.editor.refresh = () => { }
							globalLeafs.push(["ctxt", file.path, hook])
							this.app.vault.read(file).then((data) => {
								// if (file && data && (!data.includes("\n") && !data.includes(" "))) {
								if (file && data && checkCompFile(data)) {
									new Notice("Attempting to load.")
									setTimeout(() => {
										let decompress = null
										try {
											decompress = decompressfile(data, this.settings.Debug || false)
										} catch (err) { console.log(err) }
										if (decompress) {
											hook.setViewData(decompress, true)
											//attempt to stop obsidian changing contents to compressed
											hook.unload()
											hook.editor.refresh = () => { }
										}
									}, 50)
								}
							})
						}
					}
				}, 10)
				return hook
			}
		)
		this.registerEvent(this.app.workspace.on("file-open", (file) => {
			if (file && file.extension == "ctxt" && globalLeafs.length <= 0 && (new Date().getTime() - loadTime) < 1000) {
				this.app.workspace.getMostRecentLeaf()?.openFile(file)
			}
			if (file) {
				this.app.vault.read(file).then((data) => {
					if (statusBarItemEl2 && this.settings.FileSize) statusBarItemEl2.setText(data.length + "B")
				})
			}
		}))
		this.registerEvent(this.app.vault.on('modify', (file) => {
			let file2 = this.app.vault.getFileByPath(file.path)
			if (file2 && file2.extension == "ctxt") {
				this.app.vault.read(file2).then((data) => {
					if (statusBarItemEl2 && this.settings.FileSize) statusBarItemEl2.setText(data.length + "B")
					// if (file2 && data && (data.includes("\n") || data.includes(" "))) {
					if (file2 && data && !checkCompFile(data)) {
						let compress = null
						try {
							NoticePool.forEach((n) => {
								if (n) n.hide()
							})
							compress = compressfile(data, this.settings.Debug || false, this.settings)
						} catch (err) { console.log(err) }
						if (compress) {
							globalLeafs.forEach((leaf) => {
								if (leaf[0] == "ctxt" && leaf[2] == file.path && leaf[3]) {
									// leaf[3].editor.setLine("")
									leaf[3].unload()
								}
							})
							this.app.vault.modify(file2, compress)
							globalLeafs.forEach((leaf) => {
								if (leaf[0] == "ctxt" && leaf[2] == file.path && leaf[3]) {
									// leaf[3].editor.setLine("")
									leaf[3].setViewData(data, true)
								}
							})
						}
					}
				})
			} else if (file2) {
				this.app.vault.read(file2).then((data) => {
					if (statusBarItemEl2 && this.settings.FileSize) statusBarItemEl2.setText(data.length + "B")
				})
			}
		}));

		await this.loadSettings();

		// const ribbonIconEl = this.addRibbonIcon('sheets-in-box', 'Compress/Decompress', (evt: MouseEvent) => {
		// 	this.startAction()
		// });
		const ribbonIconEl2 = this.addRibbonIcon('checkmark', 'Create new ctxt', (evt: MouseEvent) => {
			let filen = `newctxtfile${(new Date().getTime().toString().substring(10))}${Math.floor(Math.random() * 500)}.ctxt`
			this.app.vault.create("./" + filen, "Write away!")//.then((filex) => {
			// setTimeout(()=>{
			// 	let file = this.app.vault.getFileByPath(filen)
			// 	if (file) {
			// 		console.log(file, this.app.workspace.getMostRecentLeaf())
			// 		this.app.workspace.getMostRecentLeaf()?.openFile(file)
			// 	}
			// },100)
			//filex null, file null, pain null
			// })
		});
		const ribbonIconEl3 = this.addRibbonIcon('up-and-down-arrows', 'Convert currently opened file', (evt: MouseEvent) => {
			if (confirm("Are you sure you want to convert")) { //will this work? electron confirms dont exit. Oh it does
				let file = this.app.workspace.getActiveFile()
				if (file) {
					if (file.extension == "ctxt") {
						this.app.vault.read(file).then((data) => {
							let raw = data
							try {
								let dc = decompressfile(data, this.settings.Debug || false)
								if (dc) raw = dc
							} catch (_) {
								new Notice("Failed to decompress, plainText?")
							}
							if (raw && file) {
								this.app.vault.rename(file, file.path.substring(0, file.path.length - (file.extension.length + 1)) + ".md").then(() => {
									if (raw && file) {
										this.app.vault.modify(file, raw)
									}
								})
								// this.app.vault.create(file.path+".md",raw).then(()=>{
								// 	if(file) {
								// 		this.app.vault.delete(file,false).then(()=>new Notice("Success!"))
								// 	}
								// })
							} else {
								new Notice("Failed.")
							}
						})
					} else {
						this.app.vault.read(file).then((data) => {
							let raw = data
							try {
								let dc = compressfile(data, this.settings.Debug || false)
								if (dc) raw = dc
							} catch (_) {
								new Notice("Failed to compress.")
							}

							if (raw && file) {
								this.app.vault.rename(file, file.path.substring(0, file.path.length - (file.extension.length + 1)) + ".ctxt").then(() => {
									if (raw && file) {
										this.app.vault.modify(file, raw).then(() => {
											setTimeout(() => { if (file) this.app.workspace.getMostRecentLeaf()?.openFile(file); }, 100)
											setTimeout(() => { if (file) this.app.workspace.getMostRecentLeaf()?.openFile(file) }, 300)
											setTimeout(() => alert("Complete. The cursor will be invisible, press off of obsidian and back."), 500)

											// setTimeout(() => { if (file) this.app.workspace.getMostRecentLeaf()?.detach() }, 300)
										})
									}
								})
							} else {
								new Notice("Failed.")
							}
						})
					}
				}
			}
		});
		ribbonIconEl2.addClass('compressor-class');
		ribbonIconEl3.addClass('compressor-class');

		//set elsewhere
		statusBarItemEl2 = this.addStatusBarItem();
		statusBarItemEl2.setText("");
		statusBarItemEl2.title = "File size"

		this.addCommand({
			id: 'createctxt',
			name: 'Create a new ctxt file in root',
			callback: () => {
				let filen = `newctxtfile${(new Date().getTime().toString().substring(10))}${Math.floor(Math.random() * 500)}.ctxt`
				this.app.vault.create("./" + filen, "Write away!")
			}
		});

		this.addSettingTab(new compressorSettings(this.app, this));


		// this.registerInterval(window.setInterval(() => {
		// 	let file = this.app.workspace.getActiveFile()
		// 	if (file != null) {

		// 		this.app.vault.read(file).then((data) => {
		// 			if (!data.includes("\n") && /[A-z0-9\-_]/gm.test(data) && !data.includes(" ")) {
		// 				let isctxt = false
		// try {
		// 	decompressfile(data)
		// 	isctxt = true
		// } catch (_) { }
		// 				if (isctxt) {
		// 					if (pane) pane.innerHTML += `<div id="AEDTCOMPDNEOUTSNTTIS!" style="position: absolute;left:0%;right:0%;width:100%;height:100%;background-color:rgba(20,20,20,0.6);z-index: 99999999999;">Content Compressed.</div>`
		// 				}
		// 			}
		// 		})

		// 		const pane = document.querySelector("body > div.app-container > div.horizontal-main-container > div > div.workspace-split.mod-vertical.mod-root > div > div.workspace-tab-container > div.workspace-leaf.mod-active > div > div.view-content > div.markdown-source-view.cm-s-obsidian.mod-cm6.node-insert-event.is-readable-line-width.is-live-preview.is-folding.show-properties > div")
		// 		if (document.getElementById("AEDTCOMPDNEOUTSNTTIS!")) document.getElementById("AEDTCOMPDNEOUTSNTTIS!")?.remove()
		// 	}
		// }, 100));
		//<div style="position: absolute;left:0%;right:0%;width:100%;height:100%;background-color:rgba(20,20,20,0.6);z-index: 99999999999;">Content Compressed.</div>



		//NOT FINISHED.
		// ; (async () => {
		// 	while (true) {
		// 		await new Promise((r) => { setTimeout(r, 100) })
		// 		if (this.app.vault.getFiles().length > 0) break
		// 	}
		// 	var hn = false
		// 	this.app.vault.getFiles().forEach((file) => {
		// 		console.log(file.name)
		// 		this.app.vault.read(file).then((data) => {
		// 			if (file) {
		// 				if (data.includes("excalidraw") && data.includes("```compressed-json") && !hn) {
		// 					alert("File Compressor: You have excalidraw installed with compression, please go to settings -> excalidraw -> Saving -> Compression and disable it. That way it can be compressed by this plugin. Source cause: " + file.path)
		// 					hn = true
		// 				}
		// 				// var out = plugindecompress(file, data)
		// 				plugincompress(file, data, this.settings)
		// 				var out = plugindecompress(file, data)
		// 				// if (out) this.app.vault.modify(file, out)
		// 				console.log("WRITER DISABLED.")
		// 			}
		// 		})
		// 	})
		// })()

		this.app.workspace.on("quit", () => {
			//NOT FINISHED.
			// this.app.vault.getFiles().forEach((file) => {
			// 	console.log(file.name)
			// 	this.app.vault.read(file).then((data) => {
			// 		if (file) {
			// 			var out = plugincompress(file, data)
			// 			if (out) this.app.vault.modify(file, out)
			// 		}
			// 	})
			// })
		})
	}
	onunload() {
		// alert("In order to view CTXT files you will need to re-enable the plugin. If you are deleting the plugin, please convert your files back before.")
	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
// function compressfile(data: string, notice?: boolean, settings?: compressorSettingsData) {
// 	if (notice) new Notice("Started", 3000)
// 	const comp = deflate(data)
// 	let inf = inflate(comp)
// 	if (inf && typeof (inf) != "string" && new TextDecoder().decode(inf) != data) {
// 		if (notice) new Notice("Revert is corrupted.", 3000)
// 		throw new Error("Revert not same,")
// 	}
// 	if (comp) {
// 		if (notice) new Notice("MEST", 3000)
// 		let bb = new BB()
// 		comp.forEach((byte: Number) => {
// 			// console.log(byte)
// 			bb.WU(8,byte)
// 		})
// 		if (notice) new Notice("SWAP", 3000)
// 		// let linkblk = ""
// 		// 	;[...data.matchAll(/\[\[[^\]]*\]\]/gm)].forEach((match) => {
// 		// 		console.log(match)
// 		// 		linkblk += match[0]
// 		// 	})
// 		let encd = encodeSafe(bb.G())
// 		if (notice) new Notice("RLE", 3000)
// 		if (encd) {
// 			if (notice) new Notice("METADATA SET.", 3000)
// 			let content = `DATABLK` + encd
// 			if (content && content.length < data.length) {
// 				if (notice) new Notice("Success!")
// 				if (settings && settings.PrintResult) {
// 					NoticePool.push(new Notice(`Compression:\nratio:${((content.length / data.length) * 100).toFixed(1)}%`))
// 				}
// 				return content
// 			} else {
// 				if (notice) new Notice("File isnt smaller.")
// 			}
// 		} else {
// 			new Notice("Encoder failure.")
// 		}
// 	}
// }
// function decompressfile(data: string, notice?: boolean) {
// 	if (notice) new Notice("START", 3000)
// 	let bb = new BB()
// 	bb.F(decodeSafe(data.substring(data.indexOf("DATABLK") + 7)))
// 	let precont: number[] = []
// 	while (true) {
// 		let now = bb.RU(8)
// 		if (!isNaN(now)) {
// 			precont[precont.length] = now
// 		} else break
// 	}
// 	if (notice) new Notice("OUT", 3000)
// 	let cont = new Uint8Array(precont)
// 	if (notice) console.log(precont)
// 	if (notice) console.log(cont)
// 	if (notice) new Notice("SWAP", 3000)
// 	if (cont && cont.length > 0) {
// 		if (notice) new Notice("INF", 3000)
// 		let decomp = inflate(cont)
// 		if (notice) console.log(decomp)
// 		if (notice) new Notice("DONE, DECODE", 3000)
// 		if (typeof (decomp) == "object") {
// 			decomp = new TextDecoder().decode(decomp)
// 			if (notice) new Notice("Success!")
// 			return decomp
// 		} else {
// 			if (notice) new Notice("Failed.")
// 		}
// 	} else {
// 		if (notice) new Notice("Couldnt Decompress.")
// 	}
// }
function compressfile(data: string, notice?: boolean, settings?: compressorSettingsData) {
	if (notice) new Notice("Started C", 3000)
	let result: (string | undefined) = ""
	try {
		result = netcompress(data, null, settings)
		if (notice) new Notice("Done!")
		if (settings && settings.PrintResult && result) {
			NoticePool.push(new Notice(`Compression:\nratio:${((result.length / data.length) * 100).toFixed(1)}%`))
		}
	} catch (err) {
		new Notice(err, 3000)
		throw new Error(err)
	}
	if (result == "" || !result) throw new Error("Empty")
	return result
}
function decompressfile(data: string, notice?: boolean) {
	if (notice) new Notice("Started D", 3000)
	let result: (string | undefined) = ""
	try {
		result = netdecompress(data)
		if (notice) new Notice("Done!")
	} catch (err) {
		new Notice(err, 3000)
		throw new Error(err)
	}
	if (result == "" || !result) throw new Error("Empty")
	return result
}
function checkCompFile(data: string) {
	var state = false
	try {
		state = (netdecompress(data) || "").length > 0
	} catch (_) { }
	return state
}
class compressorSettings extends PluginSettingTab {
	plugin: compressorPlugin;

	constructor(app: App, plugin: compressorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Print the compression results')
			.setDesc('Everytime you\'re in a ctxt file and it gets saved itll then print out the compression ratio and byte save.')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.PrintResult)
				.onChange(async (value) => {
					this.plugin.settings.PrintResult = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Show the file storage size in the statusbar')
			.setDesc('The amount of storage a file is taking up will be shown in the status bar of the open file.')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.FileSize)
				.onChange(async (value) => {
					this.plugin.settings.FileSize = value;
					await this.plugin.saveSettings();
				}));
		// new Setting(containerEl)
		// 	.setName('Pako')
		// 	.setDesc('Use Pako to improve compression. May be intensive.')
		// 	.addToggle(bool => bool
		// 		.setValue(this.plugin.settings.PakoCompress)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.PakoCompress = value;
		// 			await this.plugin.saveSettings();
		// 		}));
		new Setting(containerEl)
			.setName('NOTICE:')
			.setDesc('Unfortunetly the graph view will not maintain links. The graph cannot read the compressed data. Nor if the links are raw')
		new Setting(containerEl)
			.setName('Debug')
			.setDesc('Toasts all the events that are happening. Useful for debugging.')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.Debug)
				.onChange(async (value) => {
					this.plugin.settings.Debug = value;
					await this.plugin.saveSettings();
				}));
		// new Setting(containerEl)
		// 	.setName('-----Plugin Data Compression-----')
		// 	.setDesc('Settings for compressing data that plugins save to vault')
		//useless excelidraw uses whole offsets
		// var ex_DP = new Setting(containerEl)
		// 	.setName('Excalidraw: Decimal Precision')
		// 	.setDesc(`How many decimals to have when saving numbers (${this.plugin.settings.ExcalidrawPrecision} DP)`)
		// 	.addSlider(num => num
		// 		.setValue(this.plugin.settings.ExcalidrawPrecision)
		// 		.setLimits(0, 5, 1)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.ExcalidrawPrecision = value;
		// 			ex_DP.setDesc(`How many decimals to have when saving numbers (${this.plugin.settings.ExcalidrawPrecision} DP) ${(this.plugin.settings.ExcalidrawPrecision==0)?"NO DECIMALS(VERY BAD)":""}`)
		// 			await this.plugin.saveSettings();
		// 		}));
	}
}