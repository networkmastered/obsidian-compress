# Obsidian File Compressor

This plugin is designed to take large files and then compress them. Can typically do most file types. If you are compressing something other than a MD(MarkDown) please copy it so you have a backup. When a file is in a compressed state if its not human-readable or a plugin manages it then it may have issues.

## Installation
There are two ways to install this plugin which are as follows:

1. Install it from the obsidian community plugins tab.

2. Get the latest main.js and manifest.json from the github releases and drag it into your vault's ".obsidian/plugins/compressor" folder. The "compressor" folder may not be there. If not then you should be able to create one. If you are on linux the .obsidian folder may be hidden, depending on your operating system it will be different. You should be able to look up how to view hidden folders. Or optionally you can cd into it.

## How to use
This plugin is made to need as little interaction as possible. All you need to do it create a new ctxt file(compressed text) and then open it up. Then it will do the compression for you.

If you wish to turn a file to a ctxt you can press the button with 2 arrows which will then convert the file. If you do use this then you will need to minimise and re open obsidian. Or click on the taskbar and back. This is an unknown bug.

This plugin does support markdown and uses the same editor as markdown files.

## What are the differences like?
The differences cannot be defined. But the bigger the file is the more it should be able to do. At the start it will not compress as it will not be any smaller.

## Buttons
This plugin comes with two buttons.
> **Create CTXT** - creates a new compressed file.

> **Convert to CTXT** - converts the currently open file to a ctxt file.

## Settings
> **Print Results** - Each time a compressed file is saved it will show the compression ratio(percentage of file size)

> **Show File Size** - This setting shows the currently opened/editing file's size in the status bar.



NOTICE:
- By using this plugin the "Graph View" will NOT show links(if you know of a way to do this, please let me know). Linking to a ctxt file will also not show it.!

- Compressing a file that another plugin edits will stop that plugin from being able to open it, re convert it.

- This plugin is not perfect. Data loss is possible. In the case of dataloss, please make sure that you didnt accidently edit/tamper with the compressed data. Then and only if your fine with sharing the file you could upload an issue request with the contents. DO NOT SHARE PERSONAL INFO!


If there are any issues or requests, make sure to create a request!