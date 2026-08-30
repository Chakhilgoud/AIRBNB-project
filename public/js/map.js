
  // let mapToken = mapToken;
  //     const key = mapToken;

  //     const attribution = new ol.control.Attribution({
  //       collapsible: false,
  //     });

  //     const source = new ol.source.TileJSON({
  //       url: `https://api.maptiler.com/maps/streets-v4/tiles.json?key=${key}`, // source URL
  //       tileSize: 512,
  //       crossOrigin: 'anonymous'
  //     });

  //     const map = new ol.Map({
  //       layers: [
  //         new ol.layer.Tile({
  //           source: source
  //         })
  //       ],
  //       controls: ol.control.defaults.defaults({attribution: false}).extend([attribution]),
  //       target: 'map',
  //       view: new ol.View({
  //         constrainResolution: true,
  //         center: ol.proj.fromLonLat([78.2829, 17.2142]), // starting position [lng, lat]
  //         zoom: 4// starting zoom
  //       })
  //     });

   let mapToken = "<%= process.env.MAP_TOKEN %>"
config.apiKey = mapToken;
const map = new Map({
    container: 'map', // container's id or the HTML element in which SDK will render the map
    style: MapStyle.STREETS,
    center: [78.4186, 17.299],
    zoom: 14 // starting zoom
});












