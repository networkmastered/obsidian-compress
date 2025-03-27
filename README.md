# File Compressor
<i>This is a plugin made for Obsidian.</i>

File compressor creates a new file type which is a .ctxt(compressed txt). Although it says txt it does support markdown. The plugin is designed to be as automated as possible. Which means that you do not need to compress and decompress the files yourself. All you need to do is click the "Create new ctxt" button. Which will then create the new ctxt in the root directory of your vault.

Once you have a new ctxt file you just need to edit it like a normal file. The plugin will do the rest. If you ever see the compressed data then you should close the tab and re-open it.

The editor works by taking Obsidian's default markdown editor and then telling it to not refresh it to the saved data(which doesnt always work), then once Obsidian saves the plugin will then copy all of the contents of the file and then compress it.

Only .MD files have been tested. But we plan on making it work with multiple plugins by only compressing the data once youre done! This will come later though. But as of now it should still be able to compress any file. As long as it is just plain text. Once again though if you do convert a file then the plugin wont read it. If the plugin also uses a specific file type then it will not be saved. Instead itll be converted to a MD. This is planned to change.

## Installation
You can install/update the plugin in one of two ways:

1. You can install and update the plugin from the Obsidian community plugin marketplace.

2. You may also go to this repositorys github releases and then download the latest main and manifest then go into your vaults directory, open up your .Obsidian folder, if you are on linux you may need to find out how to view hidden files. Then you just need to open up the plugins folder, create a new folder. You can name the folder whatever you like, or just "FileCompressor" or "compressor" then just drag the main and manifest files you downloaded into the folder!

*simplified/stepped:*
- Go to releases and download the main.js and manifest.json files
- Goto your Obsidian vault
- Open vault/.Obsidian/Plugins/compressor (or create compressor folder)
- Place the main.js and manifest.json files you downloaded into the compressor plugin folder.
- Open obsidian or save your files and reload Obsidian(Ctrl+p Reload app without saving)


## NOTICE:
1. Changing a files contents to a more obscure one will come with the risk of data loss.
2. Links do work but will not show up in the Graph.
3. Plugins may fail to read the data.
4. This uses a CLOSED source build script along with esbuild. You will need to remove the " && node archive/versions/execute.js" in the package in order to build.
5. The larger your file is the more intensive the compression system will be. Each time a file is saved it runs multiple compression algorithems. If you are using large files then you may need to 

## Uninstalling
>[!WARNING]
>BEFORE UNINSTALLING/DISABLING THIS PLUGIN. CONVERT YOUR FILES BACK TO A MARKDOWN!<br>
If not, you will NOT be able to access compressed files. You will still be able to reinstall the plugin and convert the files.

## Future
We plan on adding better compression and a better system to allow files to be in plaintext while editing.

## What comes packaged:
The compression plugin is packaged with pako, a compression library and a custom one. The plugin also comes with the following 

**features**:

Buttons:
> "**Create new ctxt**" - will create a new .ctxt file.<br>
> "**Convert open file**" - This will convert the currently opened/most recently edited file from whatever it is to a ctxt. If it is a ctxt it gets converted to .md

<br>Settings:
> "**Show compression results**" - This setting shows a toast of the compression ratio of the most recently saved file(if it does get compressed)<br>
> "**Show file storage in statusbar**" - This does what it says and will show the most recently opened/edited file's storage space in bytes at the bottom on the statusbar.

## Compression Ratios:
These ratios will be based off of the bee movie script as it provides a realistic use case and has variations in the words.

*(can be found at https://gist.githubusercontent.com/MattIPv4/045239bc27b16b2bcf7a3a9a4648c08a/raw)*

> What is a compression ratio?<br>a compression ratio is how much the compressed version takes up of the raw version. (25kB compressed of 100kB = 25%, 25kB compressed of 50kB = 50%)

1.0.0-1.0.2-1.1.0 PRE-RELEASE: Error<br>
1.0.0: 55.4% ( Initial Release )<br>
1.1.0: 55.4% ( Ready for publishing )<br>
1.1.2: 55.4% ( Follow Obsidian's publishing )<br>