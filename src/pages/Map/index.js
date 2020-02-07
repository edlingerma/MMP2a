import barData from '../../js/bars-data';
import { markHeaderLink, withIcon } from '../../js/functions';
import markerPNG from '../../images/pin_w.svg';
import markerOnclick from '../../images/pin_t.svg';
import iconUser from '../../images/usericon.svg';

import template from './map.hbs';

export default class MapPage {
  constructor(root) {
    this.root = root;
    this.template = template;
    this.mymap;
  }

  render() {
    this.root.innerHTML = this.template({ heading: 'Map' });
    this.mymap = L.map('mapid').setView([47.801, 13.045], 13);
    // Dunkel
    L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=d8ff6f90-4104-408d-8c78-88524694d590',
      {
        attribution:
          'Bar data: &copy Yelp, Map data: &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      },
    ).addTo(this.mymap);
    markHeaderLink('map');
  }

  setMarker(mymap) {
    // create custom icon
    const IconStyleOne = new L.icon({
      iconUrl: markerPNG,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    let markers = {};
    for (let i = 0; i < barData.length; i++) {
      let element = barData[i];
      markers[i] = L.marker([element.latitude, element.longitude], { icon: IconStyleOne }).addTo(
        mymap,
      );
      markers[i].myCustomID = i + 1;
      markers[i].on('click', function(e) {
        let usercoorinates;
        // get last
        for (let j = 0; j < 250; j++) {
          if (mymap._targets[j] && mymap._targets[j]._mRadius) {
            usercoorinates = mymap._targets[j]._latlng;
            break;
          }
        }
        showInfo(e, usercoorinates);
        // alle anderen wieder auf grau setzten
        mymap.eachLayer(function(layer) {
          // wenn Marker und nicht gerade extra ausgewählt -> alles wieder grau
          if (
            layer._icon &&
            layer._latlng != markers[i]._latlng &&
            layer._icon.attributes[0].nodeValue === markerOnclick
          ) {
            layer._icon.attributes[0].nodeValue = markerPNG;
          }
        });
      });
    }

    // click on map - alle Icons werden wieder grau
    mymap.on('click', function(e) {
      const infobox = document.getElementById('barinfo');

      mymap.eachLayer(function(layer) {
        if (layer._icon && layer._icon.attributes[0].nodeValue === markerOnclick) {
          layer._icon.attributes[0].nodeValue = markerPNG;
          infobox.innerHTML = '';
        }
      });
    });
  }

  getUserLocation(mymap) {
    let userlocationMarker;
    let userlocationCircle;

    const UserIcon = new L.icon({
      iconUrl: iconUser,
      iconSize: [150, 150],
    });

    // https://leafletjs.com/examples/mobile/
    // https://stackoverflow.com/questions/46992447/leaflet-how-to-update-user-position-marker-real-time
    // watch = immer aktualisieren, enableHighAccuracy = hohe Genauigkeit beim Standpunkt
    mymap.locate({ watch: true, enableHighAccuracy: true });
    mymap.on('locationfound', function(e) {
      let radius = e.accuracy;
      if (!userlocationMarker) {
        userlocationMarker = L.marker(e.latlng, {
          icon: UserIcon,
          alt: 'User location point',
        }).addTo(mymap);
        userlocationCircle = new L.circle(e.latlng, 25, { color: '#ffffff' }).addTo(mymap);
        mymap.setView(e.latlng, 20);
      } else {
        userlocationMarker.setLatLng(e.latlng);
        userlocationCircle.setLatLng(e.latlng, radius);
      }
    });
    mymap.on('locationerror', onLocationError);
  }
}

// https://stackoverflow.com/questions/17423261/how-to-pass-data-with-marker-in-leaflet-js -> markers besser so infos mitgeben als mit popup
function showInfo(e, userLatLng) {
  let icon = e.target._icon.attributes[0].nodeValue;
  const infobox = document.getElementById('barinfo');

  if (icon == markerPNG) {
    e.target._icon.attributes[0].nodeValue = markerOnclick;
    let id = e.target.myCustomID;
    let infos = barData[id - 1];

    let distance = e.latlng.distanceTo(userLatLng);
    distance = Math.round(distance);
    infobox.innerHTML = `
      <a class="barinfo__link" href='./#/${infos.id}'>
          <h2 class="barinfo__link__name">${infos.name}</h2>
          <p class="barinfo__link__type">${
            infos.type
          } <img class="bar__div__type__icon" src="" alt="Beer icon for type: bar"> </p>
          <p class="barinfo__link__distance">${distance} meters</p>
      </a>
      `;
    withIcon(infobox, infos.type);
  } else {
    e.target._icon.attributes[0].nodeValue = markerPNG;
    infobox.innerHTML = '';
  }
}

function onLocationError(e) {
  alert(e.message);
  window.location = "#";
}