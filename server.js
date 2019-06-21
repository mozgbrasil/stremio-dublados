#!/usr/bin/env node

const { serveHTTP, publishToCentral } = require("stremio-addon-sdk")
const addonInterface = require("./addon")
var port = (process.env.PORT || '7000'); // 64502
serveHTTP(addonInterface, { port: port })

// when you've deployed your addon, un-comment this line
publishToCentral("https://stremio-dublados.herokuapp.com/manifest.json")
// for more information on deploying, see: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/deploying.md
