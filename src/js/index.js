import './map.js'
var allBars = require('./bars.json');
allBars = allBars.businesses;

import { setMarker } from "./map.js";


//https://stackoverflow.com/questions/17423261/how-to-pass-data-with-marker-in-leaflet-js -> markers besser so infos mitgeben als mit popup
var i = 0;
allBars.forEach(function(element){
    let m = setMarker(element.coordinates.latitude, element.coordinates.longitude, i);
    m.bindPopup(`${element.name} -- Typ: ${element.categories[0].title} -- Rating: ${element.rating}`);
    m.on("click", showInfo);
  }
);

function showInfo(e) {
  console.log(e.target._popup._content);
}

// Beispiel Marker FH Salzburg
setMarker(47.7233835,13.0871253);