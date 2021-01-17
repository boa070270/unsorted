const fs = require('fs');
const readline = require('readline');

function processLineByLine(fileName, callback) {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(__dirname + '/' + fileName)
    });
    lineReader.on('line', function (line) {
        callback(line);
    });
    lineReader.on('close', function (){
        callback(null, 'close');
    })
}
const regular = 'MaterialIcons-Regular.codepoints';
const regularOutlined = 'MaterialIconsOutlined-Regular.codepoints';
const regularRound = 'MaterialIconsRound-Regular.codepoints';
const regularSharp = 'MaterialIconsSharp-Regular.codepoints';
const regularTwoTone = 'MaterialIconsTwoTone-Regular.codepoints';

async function prepareCodepoints(file) {
    return new Promise((resolve, reject) => {
        const obj = {};
        processLineByLine(file, (line = ' ', close)=>{
            if(line) {
                const [key, value] = line.split(/\s{1,}/);
                if (key && value) {
                    obj[key] = value;
                }
            } else if (line == null && close === 'close') {
                resolve(obj);
            } else {
                reject('WTF prepareCodepoints!');
            }
        });
    });
}

class Codepoints {
    async init() {
        this.regularCodepoints = await prepareCodepoints(regular);
        this.regularOutlinedCodepoints = await prepareCodepoints(regularOutlined);
        this.regularRoundCodepoints = await prepareCodepoints(regularRound);
        this.regularSharpCodepoints = await prepareCodepoints(regularSharp);
        this.regularTwoToneCodepoints = await prepareCodepoints(regularTwoTone);
    }
}
module.exports = Codepoints;
