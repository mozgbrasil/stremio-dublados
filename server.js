#!/usr/bin/env node

const { addonBuilder, serveHTTP, getRouter, publishToCentral } = require("stremio-addon-sdk")
const addonInterface = require("./addon");
//const routerStremio = getRouter(addonInterface);
//console.log('routerStremio: ', routerStremio);
//process.argv.forEach((val, index) => {
  //console.log(`process.argv: ${index}: ${val}`);
//});
var path = require('path');
//const open = require('open');

// Start the server
(async () => {
  var port = 3004;
  const response = await serveHTTP(addonInterface, { port: port })
  //console.log('response: ', response);
  return response
})()
  .then(res => {
    //console.log('res: ', res);
    var url_stremio_manifest = res.url;
    var url_stremio_landing =  url_stremio_manifest.replace('manifest.json', '');

    (async () => {
        // Opens the url in the default browser

        var rootDir = path.dirname(__filename).split(path.sep).pop();
        console.log(`🔶 🚀 Server App (${rootDir}) listening at %s`, url_stremio_landing);

        //await open(url_stremio_manifest);
        //await open(url_stremio_landing);
    })();

    //res.send(url_stremio_manifest);
  })
  .catch(err => {
    console.log(err)
  })

// when you've deployed your addon, un-comment this line
//publishToCentral("https://stremio-dublados.herokuapp.com/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying.md
