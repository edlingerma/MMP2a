import template from './bar.hbs';
import challenges from '../../js/challenges';
import circle from '../../images/circle.svg';
import checkedCircle from '../../images/checkedCircle.svg'




export default class BarPage {
    constructor(root, bar) {
      console.log('It\'s a Bar!');
      this.root = root;
      this.template = template;
      this.bar = bar;
    }
  
    render(barData, params, barT) {
      // going through all bars in `bars-data.js` and getting the right bar with its id
      const bar = barData.find((p) => p.id == params.id);
      // replacing the content in our app with the template
      this.root.innerHTML = this.template({ name: bar.name, type: bar.type, id: bar.id, rating: bar.rating});

      let bool =  barT.checkForCookie(bar.id);
      if(bool){
        barT.checkIn(bar.latitude, bar.longitude, bar.id);
      }
    }

    checkIn(latBar, lngBar, idBar){
      let checkinButton = document.getElementById('checkin');
      checkinButton.addEventListener('click', function() {
        // your code here
        checkUserLocation(latBar, lngBar, idBar)
     });
    }

    checkForCookie(name){
      //Wenn cookie existiert laden
      let result = getCookie(name);
      if(result){
        let challenges = read_cookie(result);
        displaychallenges(challenges, name);
        return false;
      }
      return true;
    }
}

// https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition -> schneller
function checkUserLocation(latBar, lngBar, idBar){

  //create invisible map to get User Location fast and easily
  let invisibleMap = L.map('mapForUserlocation').setView([latBar, lngBar], 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWRsaW5nZXJtYSIsImEiOiJjazVqbXUycTIwNG82M2xvNGhiamNlcWpnIn0.NkRltbxOXwRlM4WoyI8b3w', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      accessToken: 'your.mapbox.access.token'
  }).addTo(invisibleMap);

  invisibleMap.locate({watch: true});
  invisibleMap.on('locationfound', function(e) { 
      let radius = e.accuracy;
      // stop searching for user location when te radius is small
      if(radius <= 100){
        invisibleMap.stopLocate();
      }
      let distance = e.latlng.distanceTo( { lat: latBar, lng: lngBar } );

      console.log("Radius "+radius);
      console.log("Distance "+distance);
      
      name = idBar;
      if(distance <= 20){
        console.log("You are checked in now.");

        //COOKIE erstellen
        let result = getCookie(name);
        if(!result){
          let value = getRandomChallanges();
          bake_cookie(name, value, 2)
          displaychallenges(value, name);
        }    
      } else{
        console.log("Du bist nicht in der Bar!!!"); 
      }
  });
  invisibleMap.on('locationerror', console.log("GPS not working"));
}

function displaychallenges(randomChallenges, name){
  let divforChallenges = document.getElementById('bar__challenges');
  if(randomChallenges.length>0){
    divforChallenges.innerHTML = getChallangeHTML(randomChallenges);
    setEventToCircle(randomChallenges, name);
  }else{
    divforChallenges.innerHTML = '<p>Alle Challenges für heute gemeistert. Bis bald!</p>';
  }
 
}

function setEventToCircle(randomChallenges, name) {
  let circles = document.getElementsByClassName('list__element__points__click');

  for (var i = 0; i < circles.length; i++) {

      circles[i].addEventListener('click', function(e) {
        console.log(e);

          if( e.target.alt == 'a circle to check the challange'){
            console.log('Challange DONE');
            e.target.alt = 'a check circle';
            e.target.src = checkedCircle;
            let parentDivId = e.target.parentNode.parentNode.parentNode.id;
            // e.target.parentNode.parentNode.parentNode.hidden = true;

            if(parentDivId.includes(0)){
              //entweder style setzten - auch challange.js verändern (vlt)
              // randomChallenges[0].style = '--transparent';
              
              //oder challenge löschen
              randomChallenges = randomChallenges.slice(1); // first element removed 
              //edit existing cookie
              bake_cookie(name, randomChallenges, 2)
              console.log(document.cookie);
            }
            if(parentDivId.includes(1)){
              randomChallenges.pop(); // last element removed
              // bake_cookie('51', randomChallenges, 2)
              console.log(randomChallenges);
            }
          } else{
            console.log('Challange DONE already');
          }
      });
  }
}

function getRandomChallanges(){
  let numberOfChallenges = challenges.length;
  let randomChallengesArray = [];
  // 2 challenges
  for(let i = 0; i<2; i++){
    let num = Math.floor(Math.random() * numberOfChallenges-1);
    randomChallengesArray.push(challenges[num]);
  }
  return randomChallengesArray;
}

function getChallangeHTML (randomChallengesArray){
  let challangeHTML = 
      `
      <h2>Challenges</h2>
      <ul class='bar__challenges list'>
      `;
  for(let i=0; i < randomChallengesArray.length; i++){
    challangeHTML +=
        `
        <li class='bar__challenges list__element' id='challange${i}'>
            <p>${randomChallengesArray[i].challenge}</p>
            <div class='list__element__points'>
              <p>+${randomChallengesArray[i].points} Points</p>
              <button class='list__element__points__click'><img src=${circle} alt='a circle to check the challange'></button>
            </div>
          </li>
        `;
  }
  challangeHTML += `</ul>`
  return challangeHTML;
}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

// https://stackoverflow.com/questions/11344531/pure-javascript-store-object-in-cookie
function bake_cookie(name, value, hours) {
  if (hours) {
      var date = new Date();
      date.setTime(date.getTime()+(hours*60*60*1000));
      var expires = "; expires="+date.toGMTString();
  }
  else {
      var expires = "";
  }
  var cookie = name + '=' + JSON.stringify(value)+expires+'; path=/';
  document.cookie = cookie;
}

function read_cookie(result) {
  return JSON.parse(result);
}
