export function CanDo(file, str, set) {
    console.log(str.startsWith(`---\n\nexcalidraw-plugin: parsed\ntags: [excalidraw]\n\n---\n==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: \'Decompress current Excalidraw file\'. For more info check in plugin settings under \'Saving\'\n\n\n# Excalidraw Data\n\n`), str.includes("```json"), str)
    return str.startsWith(`---\n\nexcalidraw-plugin: parsed\ntags: [excalidraw]\n\n---\n==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: \'Decompress current Excalidraw file\'. For more info check in plugin settings under \'Saving\'\n\n\n# Excalidraw Data\n\n`) && str.includes("```json")
}
export function CanUnDo(file, str) {
    console.log(str.startsWith(`---\n\nexcalidraw-plugin: parsed\ntags: [excalidraw]\n\n---\n==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠== You can decompress Drawing data with the command palette: \'Decompress current Excalidraw file\'. For more info check in plugin settings under \'Saving\'\n\n\n# Excalidraw Data\n\n`), str.includes("```json"), str)
    return str.startsWith("COMPDATA_-EXCALI:")
}
var brushTypes = [
    "line",
    "ellipse",
    "diamond",
    "arrow",
    "freedraw",
    "image",
    "text",
    "rectangle",
]
var Styles = {
    fills: ["cross-hatch", "hachure", "solid"],
    stroke: ["dotted", "dashed", "solid"],

}
class saveconstruct {
    constructor(intl, type) {
        this.out = intl || ""
        this.type = type
    }
    addData(data) {
        if (this.type && this.type == "master") {
            this.out += data
        } else {
            this.out += data + ","
        }
    }
    export() {
        if (this.type == "master") return this.out
        return this.out.substring(0, this.out.length - 1)
    }
}

export function Compress(file, str, set, BB) {
    // try {
    var textdata = str.substring(str.indexOf("## Text Elements"), str.indexOf("%%")).substring(17)
    var lack = str.substring(str.indexOf("## Drawing"), str.indexOf("%%", str.indexOf("## Drawing"))).substring(18).trim()
    lack = lack.substring(0, lack.length - 3).trim()
    console.log(lack)
    var drawdata = JSON.parse(lack)
    if (drawdata && drawdata) {
        let meta = new BB()
        meta.WU(5, drawdata.version || 2)
        meta.WU(5, set.ExcalidrawPrecision)
        drawdata.source.substring(69).split(".").forEach((v) => {
            meta.WU(5, v)
        })
        let bld = new saveconstruct(meta.G(), "master")
        // let bld = new saveconstruct(drawdata.version + "" + set.ExcalidrawPrecision + "@" + drawdata.source.substring(69), "master")
        console.log(drawdata)
        drawdata.elements.forEach((stroke) => {
            let localStroke = new saveconstruct(";" + stroke.id + ":")
            // let localStroke = stroke.id + ":"
            localStroke.addData(brushTypes.indexOf(stroke.type))
            localStroke.addData(Math.round(stroke.x * (10 ** set.ExcalidrawPrecision)))
            localStroke.addData(Math.round(stroke.y * (10 ** set.ExcalidrawPrecision)))

            localStroke.addData(Math.round(stroke.width * (10 ** set.ExcalidrawPrecision)))
            localStroke.addData(Math.round(stroke.height * (10 ** set.ExcalidrawPrecision)))

            localStroke.addData(Math.round(stroke.angle * (10 ** set.ExcalidrawPrecision)) % 360)

            if (stroke.strokeColor.startsWith("#")) {
                localStroke.addData(stroke.strokeColor.substring(1))
            } else {
                localStroke.addData(stroke.strokeColor)
            }
            if (stroke.backgroundColor.startsWith("#")) {
                localStroke.addData(stroke.backgroundColor.substring(1))
            } else {
                localStroke.addData(stroke.backgroundColor)
            }

            if (stroke.backgroundColor.startsWith("#")) {
                localStroke.addData(stroke.backgroundColor.substring(1))
            } else {
                localStroke.addData(stroke.backgroundColor)
            }

            localStroke.addData(Styles.fills.indexOf(stroke.fillStyle))
            localStroke.addData(stroke.strokeWidth || 0)
            localStroke.addData(Styles.stroke.indexOf(stroke.strokeStyle))

            localStroke.addData(stroke.roughness || 0)
            localStroke.addData(stroke.opacity >= 100 ? -1 : stroke.opacity)

            localStroke.addData((stroke.groupIds && stroke.groupIds.length > 0) ? JSON.stringify(stroke.groupIds) : 0)

            localStroke.addData(stroke.frameId || "")

            localStroke.addData(stroke.index)

            if (stroke.roundness) {
                localStroke.addData(stroke.roundness.type || 0)
            } else {
                localStroke.addData(0)
            }

            if (stroke.seed && stroke.roughness > 0) {
                localStroke.addData(stroke.seed)
            } else {
                localStroke.addData(0)
            }

            localStroke.addData(stroke.version || 0)

            localStroke.addData(stroke.versionNonce || 0)

            localStroke.addData(stroke.isDeleted ? 1 : 0)

            localStroke.addData((stroke.boundElements && stroke.boundElements.length > 0) ? JSON.stringify(stroke.boundElements) : 0)

            localStroke.addData(stroke.updated)

            if (stroke.link) {
                if (stroke.link.startsWith("https://")) {
                    localStroke.addData("”" + stroke.link.substring(8) || "")
                } else if (stroke.link.startsWith("http://")) {
                    localStroke.addData("⁕" + stroke.link.substring(7) || "")
                } else {
                    localStroke.addData(stroke.link || "")
                }
            }

            localStroke.addData(stroke.locked ? 1 : 0)

            bld.addData(localStroke.export())
        })
        console.log(bld.export())
        return "COMPDATA_-EXCALI:" + bld.export()
    } else {
        throw new Error("OOD")
    }
    return str
    // } catch (e) { return undefined }
}
export function Decompress(file, str, BB) {
    str = str.substring(7)
    console.log(str)
}