const Handlebars = require('handlebars');

Handlebars.registerHelper('disRating', (rating) => {return "Heya!"});

function displayRating(rating){           //let rating be 3.5 OR 4
  let cont = document.createElement('div');
  cont.classList.add('rating');
  let half = rating % 1;     // = 0.5 OR 0
  let whole = rating - half;   // = 3 OR 4
  let empty = 5 - rating - half; // = 1 OR 1
  let img = document.createElement('img');
  img.src = '../images/star_1.svg';
  for (let i=0;i<=whole;i++){
    cont.appendChild(img);
  }
  if (half > 0){
    img.src = '../images/star_h.svg';
    cont.appendChild(img);
  }
  img.src = '../images/star_0.svg';
  for (let i=0;i<=empty;i++){
    cont.appendChild(img);
  }
  return cont;
}