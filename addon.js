#!/usr/bin/env node

'use strict';

const log = console.log
const { addonBuilder } = require('stremio-addon-sdk');
const fs = require('fs');
var _ = require('lodash'); // Load the full build.

log('cwd: ', process.cwd())
log('__filename: ', __filename)

var pathFile = `${__dirname}/metas.json`;
var json = fs.readFileSync(pathFile, 'utf8');
var metas = JSON.parse(json); // object

log('metas[0]: ', metas[0])

var sizeMetas = _.keys(metas).length;

// Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md
const manifest = {
  "id": "community.naazguu", // https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md#basic-information
  "name": "naazguu",
  "description": "Catalog with " + sizeMetas + " titles",
  "version": "1.0.0",
  "resources": [ "catalog", "stream", "meta", "subtitles" ], // https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md#filtering-properties
  "types": [ "movie", "series", "channel", "tv" ],
  "catalogs": [{ // https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/responses/manifest.md#content-catalogs
    "type": "movie",
    "id": "top",
    "name": "IPTV Nazzguu",
    "extra": [
        {
          "name": "genres",
          "isRequired": false,
          "options": ["Action", "Comedy", "Drama"]
        },
    ]
  }],
  "background": "https://4.bp.blogspot.com/-BwM8BKuVAb8/VPw4f1a1ZII/AAAAAAACFRg/hfI5AFX_0bU/s1600/60.jpg",
  "logo": "https://s.gravatar.com/avatar/e92be4ca866fbbb65e2e9a41512689fbs?s=256",
  "contactEmail": "naazguu@gmail.com"
}

const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(({type, id, extra}) => {
  log("request for catalogs: "+type+" "+id)
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineCatalogHandler.md
  const skip = parseInt(extra.skip || 0)

  log('(typeof metas): ', (typeof metas));
  log('skip: ', skip);

  var metas_slice = metas.slice(skip, skip + 100)
  //log('metas: ', metas);

  var keys = _.keys(metas_slice);
  log('keys: ', keys);

  return Promise.resolve({ metas: metas_slice })
})

builder.defineMetaHandler(({type, id}) => {
  log("request for meta: "+type+" "+id)
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineMetaHandler.md
  if ( id !== "") {
  // serve one stream movie
    //log('metas: ', metas);
    var meta = _.find(metas, function(item) {
      //log('item: ', item);
      //log('id: ', id);
      return item.id == id
    })
    //log('meta: ', meta);

  return Promise.resolve({ meta: meta })
  }

  // otherwise return no streams
  return Promise.resolve({ meta: [] })
})

builder.defineStreamHandler(({type, id}) => {
  log("request for streams: "+type+" "+id)
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineStreamHandler.md
  if ( id !== "") {
  // serve one stream movie
    //log('metas: ', metas);
    var meta = _.find(metas, function(item) {
      //log('item: ', item);
      //log('id: ', id);
      return item.id == id
    })
    //log('meta: ', meta);

    const videos = meta.videos;
    //log('videos: ', videos);

    const streams = [];
    videos.forEach(function(item){
      var _stream = item.stream;
      streams.push(_stream);
    });

    //const streams = [{ infoHash: '8433e3c6435d6f8bbe5e65b21535dd2ff5ff91ac' }]
    //const streams = [{ title: 'ss', url: 'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4' }]

    log('streams: ', streams);

  return Promise.resolve({ streams: streams })
  }

  // otherwise return no streams
  return Promise.resolve({ streams: [] })
})

builder.defineSubtitlesHandler(({type, id}) => {
  log("request for subtitles: "+type+" "+id)
  // Docs: https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/api/requests/defineSubtitlesHandler.md
  return Promise.resolve({ subtitles: [] })
})

module.exports = builder.getInterface()
