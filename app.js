const nodeHtmlToImage = require('node-html-to-image');
const pLimit = require('p-limit');
var fs = require('fs').promises;
const util = require('util');
const logUpdate = require('log-update');
const readFile = util.promisify(fs.readFile);
const {listQRCode} = require('./input')
let HTML_CONTENT = ``;
const frames = ['-', '\\', '|', '/'];
let i = 0;
// for (let i = 0; i < 1000; i++) {
//   listQRCode.push({
//     id: i,
//     url: "https://mastercheckin.compedia.vn/javax.faces.resource/upload/event/38/2-c1cfad9c-d064-421e-89c0-0f27eecaa555.png.xhtml"
//   })
// }

const limit = pLimit(5);
// const promises = listQRCode.map(test)

const input = listQRCode.map(item=>{
  limit(()=>test(item))
})
let j = 0;
let length = listQRCode.length;
async function test(item) {
  let data =  await fs.readFile("input.html", "binary");
  HTML_CONTENT = new Buffer.from(data).toString();
  j++;
  return await nodeHtmlToImage({
    output: `./images/${item.id}.png`,
    html: HTML_CONTENT,
    content: { QRCodeURL: item.url },
    puppeteerArgs:{
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    },
    quality:100
  })
}

(async () => {
  // Only one promise is run at once
  console.log('Processing....');
  await Promise.all(input);
})();

var myInterval = setInterval(() => {
  const frame = frames[i = ++i % frames.length];
  logUpdate(
`
      ♥♥
 ${frame} Processing... ${j}/${length} ${frame}
      ♥♥
`
  );
  if(j == length){
    clearInterval(myInterval);
    console.log('Done!');
  }
}, 80);

process.on('exit', function (){
  clearInterval(myInterval);
  //console.log('Done!');
});