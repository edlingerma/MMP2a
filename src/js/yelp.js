
// in comand line: >> node src/js/yelp.js
'use strict';

const yelp = require('yelp-fusion');

// Place holder for Yelp Fusion's API Key. Grab them
// from https://www.yelp.com/developers/v3/manage_app
const apiKey = '7iNhgsxIGrX-eFAjTsmuVfB4pLgY2gMGG7RGfX4Gl9mEaeieuUhgPZwn5YKpsKGy_bzfs1K15mSNF3LDj7UAXsUzBPUl1xa0tIK89_ja6eQ-k_vDIgKFgUkNiyDkXXYx';

const searchRequest = {
  categories: [
    'bars',
    'irish_pubs',
    'beerbar', 
    'cocktailbars',
    'pubs', 
    'beergardens',
    'sportsbars', 
    'whiskeybars',
  ],
  location: 'Salzburg',
  limit: 50   //Ausgabelimit (normal 20 mehr aus 50 geht irgendwie nicht)
};

const client = yelp.client(apiKey);

client.search(searchRequest).then(response => {
  const prettyJson = JSON.stringify(response.jsonBody.businesses, null, 4);
  // console.log(prettyJson);

  console.log(response.jsonBody.businesses.length);

  

  for (var i = 0; i < response.jsonBody.businesses.length; i++) {
      const Result = response.jsonBody.businesses[i];
      let type="";

      if(Result.categories.length > 1) {
        for(let j=0; j<Result.categories.length; j++) {
          if(Result.categories[j].alias.includes('bar') || Result.categories[j].alias.includes('pub') ){
            type=Result.categories[j].title;
            break;
          }
        }
      } else{
        type=Result.categories[0].title;
      }

      let id = i+1

      console.log(`{`);
      console.log(`\tid: ${id},`);
      console.log(`\tname: '${Result.name}',`);
      console.log(`\ttype: '${type}',`);
      console.log(`\tlatitude: ${Result.coordinates.latitude},`);
      console.log(`\tlongitude: ${Result.coordinates.longitude},`);
      console.log(`\treview: '${Result.rating}'`);
      console.log(`},`);
  } 

}).catch(e => {
  console.log(e);
});
