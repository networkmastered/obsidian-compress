export class BB {
    constructor() {
        this.PT = 0
        this.BB = []
        this.NT = { "0": "A", "1": "B", "2": "C", "3": "D", "4": "E", "5": "F", "6": "G", "7": "H", "8": "I", "9": "J", "10": "K", "11": "L", "12": "M", "13": "N", "14": "O", "15": "P", "16": "Q", "17": "R", "18": "S", "19": "T", "20": "U", "21": "V", "22": "W", "23": "X", "24": "Y", "25": "Z", "26": "a", "27": "b", "28": "c", "29": "d", "30": "e", "31": "f", "32": "g", "33": "h", "34": "i", "35": "j", "36": "k", "37": "l", "38": "m", "39": "n", "40": "o", "41": "p", "42": "q", "43": "r", "44": "s", "45": "t", "46": "u", "47": "v", "48": "w", "49": "x", "50": "y", "51": "z", "52": "0", "53": "1", "54": "2", "55": "3", "56": "4", "57": "5", "58": "6", "59": "7", "60": "8", "61": "9", "62": "-", "63": "_" }
        this.BT = { "0": 52, "1": 53, "2": 54, "3": 55, "4": 56, "5": 57, "6": 58, "7": 59, "8": 60, "9": 61, "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25, "a": 26, "b": 27, "c": 28, "d": 29, "e": 30, "f": 31, "g": 32, "h": 33, "i": 34, "j": 35, "k": 36, "l": 37, "m": 38, "n": 39, "o": 40, "p": 41, "q": 42, "r": 43, "s": 44, "t": 45, "u": 46, "v": 47, "w": 48, "x": 49, "y": 50, "z": 51, "-": 62, "_": 63 }
        this.PO = {}
        this.gp()
    }
    gp() { for (let i = 0; i <= 64; i++) { this.PO[i] = Math.pow(2, i) } }
    F(str) {
        for (let i = 0; i < str.length; i++) {
            let ch = this.BT[str[i]]
            for (let j = 0; j < 6; j++) {
                this.PT++
                this.BB[this.PT] = ch % 2
                ch = Math.floor(ch / 2)
            }
        }
    }
    G() {
        let str = ""
        let accum = 0
        let pow = 0
        for (let i = 1; i <= Math.ceil(this.BB.length / 6) * 6; i++) {
            accum += this.PO[pow] * (this.BB[i] || 0)
            pow++
            if (pow >= 6) {
                str += this.NT[accum]
                accum = 0
                pow = 0
            }
        }
        return str
    }
    WU(value) {
        this.BB[this.PT + 1] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 2] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 3] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 4] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 5] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 6] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 7] = value % 2
        value = Math.floor(value / 2)
        this.BB[this.PT + 8] = value % 2
        value = Math.floor(value / 2)
        this.PT += 8
        for (let i = 0; i < 8; i++) {
            this.PT++
            this.BB[this.PT] = value % 2
            value = Math.floor(value / 2)
        }
    }
    RU() {
        let r = this.BB[this.PT+1] * this.PO[0] + this.BB[this.PT + 2] * this.PO[1] + this.BB[this.PT + 3] * this.PO[2] + this.BB[this.PT + 4] * this.PO[3] + this.BB[this.PT + 5] * this.PO[4] + this.BB[this.PT + 6] * this.PO[5] + this.BB[this.PT + 7] * this.PO[6] + this.BB[this.PT + 8] * this.PO[7]
        this.PT += 8
        return r
    }
}