import { App, MarkdownView, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { inflate, deflate } from "./util/pakoMinified"
import { BB } from "./util/BB"
import { encodeSafe, decodeSafe } from "./util/runlength"


interface compressorSettingsData {
	// mySetting: string;
	PrintResult: boolean;
	FileSize: boolean;
	LeaveRawLinks: boolean;
}

const DEFAULT_SETTINGS: compressorSettingsData = {
	// mySetting: 'default',
	PrintResult: true,
	FileSize: true,
	LeaveRawLinks: true
}
var globalLeafs: any[] = []
var NoticePool: Notice[] = []
var statusBarItemEl2: (undefined | HTMLElement);
export default class compressorPlugin extends Plugin {
	settings: compressorSettingsData;

	async onload() {
		var loadTime = new Date().getTime()

		this.registerExtensions(["ctxt"], "ctxt")

		this.registerView("ctxt",
			(leaf) => {
				var hook = new MarkdownView(leaf)
				var f = setInterval(() => {
					var file = hook.file || this.app.workspace.getActiveFile()
					if (file) {
						clearInterval(f)
						if (file && file.extension == "ctxt") {
							//attempt to stop obsidian changing contents to compressed
							hook.unload()
							hook.canAcceptExtension("")
							hook.editor.refresh = () => { }
							globalLeafs.push(["ctxt", file.path, hook])
							this.app.vault.read(file).then((data) => {
								if (file && data && (!data.includes("\n") && !data.includes(" "))) {
									new Notice("Attempting to load.")
									setTimeout(() => {
										var decompress = null
										try {
											decompress = decompressfile(data)
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
			var file2 = this.app.vault.getFileByPath(file.path)
			if (file2 && file2.extension == "ctxt") {
				this.app.vault.read(file2).then((data) => {
					if (statusBarItemEl2 && this.settings.FileSize) statusBarItemEl2.setText(data.length + "B")
					if (file2 && data && (data.includes("\n") || data.includes(" "))) {
						var compress = null
						try {
							NoticePool.forEach((n) => {
								if (n) n.hide()
							})
							compress = compressfile(data, false, this.settings)
						} catch (err) { console.log(err) }
						if (compress) {
							globalLeafs.forEach((leaf) => {
								console.log(leaf)
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
							console.log(file.name + " has been saved")
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
			var filen = `newctxtfile${(new Date().getTime().toString().substring(10))}${Math.floor(Math.random() * 500)}.ctxt`
			this.app.vault.create("./" + filen, "Write away!")//.then((filex) => {
			// setTimeout(()=>{
			// 	var file = this.app.vault.getFileByPath(filen)
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
				var file = this.app.workspace.getActiveFile()
				console.log(file)
				if (file) {
					if (file.extension == "ctxt") {
						this.app.vault.read(file).then((data) => {
							var raw = data
							try {
								var dc = decompressfile(data, true)
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
							var raw = data
							try {
								var dc = compressfile(data, true)
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
		statusBarItemEl2.title = "File Size"

		this.addCommand({
			id: 'createctxt',
			name: 'Create a new ctxt file in root',
			callback: () => {
				var filen = `newctxtfile${(new Date().getTime().toString().substring(10))}${Math.floor(Math.random() * 500)}.ctxt`
				this.app.vault.create("./" + filen, "Write away!")
			}
		});

		this.addSettingTab(new compressorSettings(this.app, this));


		// this.registerInterval(window.setInterval(() => {
		// 	var file = this.app.workspace.getActiveFile()
		// 	if (file != null) {

		// 		this.app.vault.read(file).then((data) => {
		// 			if (!data.includes("\n") && /[A-z0-9\-_]/gm.test(data) && !data.includes(" ")) {
		// 				var isctxt = false
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
	}
	onunload() {
		alert("In order to view CTXT files you will need to re-enable the plugin. If you are deleting the plugin, please convert your files back before.")
	}
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
function compressfile(data: string, notice?: boolean, settings?: compressorSettingsData) {
	const comp = deflate(data)
	var inf = inflate(comp)
	if (inf && new TextDecoder().decode(inf) != data) {
		if (notice) new Notice("Revert is corrupted.", 3000)
		throw new Error("Revert not same,")
	}
	if (comp) {
		var bb = new BB()
		comp.forEach((byte) => {
			// console.log(byte)
			bb.WU(byte)
		})
		// var linkblk = ""
		// 	;[...data.matchAll(/\[\[[^\]]*\]\]/gm)].forEach((match) => {
		// 		console.log(match)
		// 		linkblk += match[0]
		// 	})
		var encd = encodeSafe(bb.G())
		if (encd) {
			var content = `DATABLK` + encd
			if (content && content.length < data.length) {
				if (notice) new Notice("Success!")
				if (settings && settings.PrintResult) {
					NoticePool.push(new Notice(`Compression:\nratio:${((content.length / data.length) * 100).toFixed(1)}%`))
				}
				return content
			} else {
				if (notice) new Notice("File isnt smaller.")
			}
		} else {
			new Notice("Encoder failure.")
		}
	}
}
function decompressfile(data: string, notice?: boolean) {
	var bb = new BB()
	bb.F(decodeSafe(data.substring(data.indexOf("DATABLK") + 7)))
	var precont: number[] = []
	while (true) {
		var now = bb.RU()
		if (!isNaN(now)) {
			precont[precont.length] = now
		} else break
	}
	var cont = new Uint8Array(precont)
	if (cont && cont.length > 0) {
		var decomp = inflate(cont)
		if (typeof (decomp) == "object") {
			decomp = new TextDecoder().decode(decomp)
			if (notice) new Notice("Success!")
			return decomp
		} else {
			if (notice) new Notice("Failed.")
		}
	} else {
		if (notice) new Notice("Couldnt Decompress.")
	}
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
		new Setting(containerEl)
			.setName('NOTICE:')
			.setDesc('Unfortunetly the graph view will not maintain links. The graph cannot read the compressed data. Nor if the links are raw')
	}
}