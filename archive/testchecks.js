const { encodeSafe, decodeSafe } = require("../util/runlength")
const LZ = require("../util/runlengthMatch")
const { netcompress, netdecompress } = require("../util/networkmastercompression")
const funcs = [netcompress, netdecompress, encodeSafe, decodeSafe, LZ.compress, LZ.decompress]
const names = ["netcompress", "netdecompress", "encodeSafe", "decodeSafe", "LZcompress", "LZdecompress"]

const tests = [
    { type: 0, inputs: ["hi", "type1"], output: "hAfoE" },
    { type: 0, inputs: ["hi,", "type1"], output: "hAundefined" },
    { type: 0, inputs: ["abcdefg formats", "type2"], output: "BBfUBiQDRURGdESBcEUT5kQVRF" },
    { type: 0, inputs: ["master file true", "type3"], output: "hBfoOabmMbXmNdL31dZA" },
    { type: 0, inputs: ["zygote", "type3"], output: "hBf8_D" },
    { type: 0, inputs: ["zygotezygote", "type3"], output: "hBf8_z_P" },
    { type: 0, inputs: ["hello World", "type4"], output: "BCfhello World" },
    { type: 0, inputs: ["test test test test test", "type5"], output: "hCB4-6C3XX4-6C•\" K" },
    { type: 1, inputs: ["hAfoE"], output: "hi" },
    { type: 1, inputs: ["BCfhello World"], output: "hello World" },
    { type: 1, inputs: ["hCB4-6C3XX4-6C•\" K"], output: "test test test test test" },
    { type: 2, inputs: ["A"], output: "A" },
    { type: 2, inputs: ["AA"], output: "AA" },
    { type: 2, inputs: ["AAA"], output: "óA" },
    { type: 2, inputs: ["AAAA"], output: "úA" },
    { type: 2, inputs: ["AAAAA"], output: "üA" },
    { type: 2, inputs: ["AAAAAA"], output: "ñA" },
    { type: 2, inputs: ["AAAAAAA"], output: "çA" },
    { type: 2, inputs: ["AAAAAAAA"], output: "¿A" },
    { type: 2, inputs: ["AAAAAAAAA"], output: "¡A" },
    { type: 2, inputs: ["AAAAAAAAAA"], output: "éáA" },
    { type: 2, inputs: ["AAAAAAAAAAA"], output: "ééA" },
    { type: 2, inputs: ["AAAAAAAAAAAA"], output: "éíA" },
    { type: 3, inputs: ["A"], output: "A" },
    { type: 3, inputs: ["AA"], output: "AA" },
    { type: 3, inputs: ["óA"], output: "AAA" },
    { type: 3, inputs: ["úA"], output: "AAAA" },
    { type: 3, inputs: ["üA"], output: "AAAAA" },
    { type: 3, inputs: ["ñA"], output: "AAAAAA" },
    { type: 3, inputs: ["çA"], output: "AAAAAAA" },
    { type: 3, inputs: ["¿A"], output: "AAAAAAAA" },
    { type: 3, inputs: ["¡A"], output: "AAAAAAAAA" },
    { type: 3, inputs: ["éáA"], output: "AAAAAAAAAA" },
    { type: 3, inputs: ["ééA"], output: "AAAAAAAAAAA" },
    { type: 3, inputs: ["éíA"], output: "AAAAAAAAAAAA" },
    // { type: 0, inputs: ["hi"], output: "" },
]

var pass = 0
var fail = 0

for (let idx = 0; idx < tests.length; idx++) {
    let test = tests[idx]
    var name = names[test.type]
    var func = funcs[test.type]
    var out = ""
    try {
        out = func(...test.inputs)
    } catch (err) {
        throw new Error(err)
    }
    if (test.output == out) {
        console.log(`\u001b[32mTest ${name} ${idx + 1}. Passed ✔\u001b[30m`)
        pass++
    } else {
        console.log(`\u001b[31mTest ${name} ${idx + 1}. Failed ❌(${out} ~= ${test.output})\u001b[30m`)
        fail++
    }
}

console.log(`Finished. \u001b[32m${pass} have passed\u001b[31m ${fail} have failed \u001b[32m${pass}\u001b[30m/\u001b[31m${fail}\u001b[30m`)

if (fail > 0) {

    throw new Error("failed")

}