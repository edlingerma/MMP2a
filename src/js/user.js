/*
User contains a score, a bar they're currently visiting and a collection of previously visited bars
    Score will be calculated by the bars visited

Bar contains a barID, a timestamp of users last check-in, a score and a collection of challenges that the user completed
    BarID references a bar in bars.json
    Score is calculated by points for the check-in plus the sum of points each done challenge brings

Challenge contains a challengeID referencing a challenge with a description and either a score or a level of difficulty
*/
import barsData from './bars-data';
import challs from './challenges';

export class User {
  constructor() {
    this.score = 0;
    this.currentBar = null; // object with ID and timestamp
    this.barsVisited = []; // collection; has Bar ID, timestamp of last ckechin and collection of completed challenges
  }
  save() {
    // save class permanently into user's frontend
    localStorage.setItem('myUser', JSON.stringify(this));
  }
  checkIn(barID, wholeLoad = false) {
    // add bar ID in user's visited bars and save class into storage
    if (barsData.find(bar => bar.id == barID) === undefined) {
      throw new ReferenceError(`Bar id is invalid!\tID: ${barID}`);
    } else {
      // see if bar is already in array; if not, create new bar object
      let currBar;
      if (this.barsVisited.findIndex(bar => bar.barID == barID) == -1) {
        currBar = new Bar(barID);
        this.barsVisited.unshift(currBar);
        console.log(`first check into ${barID}: score ${this.score} + ${currBar.score}`);
      } else {
        // set reference to current visiting bar to this id with new timestamp
        currBar = this.barsVisited.find(bar => bar.barID == barID); // Shallow
        if (!wholeLoad) {
          currBar.updateChekIn();
        }
      }
      this.currentBar = currBar;
      if (!wholeLoad) {
        this.updateScore();
      }
      this.save();
    }
  }
  // add challenge to user's done challenges and save into storage
  addChallenge(challengeID, wholeLoad = false) {
    let bar = this.currentBar;
    bar.addChallenge(challengeID, true);
    if (!wholeLoad) {
      this.updateScore();
    }
    this.save();
  }
  // iterate recursively through each visited bar and done challenge and add score
  updateScore() {
    console.log('UPDATE SCORE');
    let score = 0;
    this.barsVisited.forEach(bar => {
      score += bar.updateScore();
      console.log('users score: ' + score);
    });
    this.score = score;
  }
}

export class Bar {
  constructor(barID, lastCheckin = Date.now()) {
    this.barID = barID;
    this.lastCheckin = lastCheckin; // timestamp of this bar's last chekin
    this.score = 5;
    this.doneChallenges = [];
  }
  // set last checkin to current time
  updateChekIn() {
    this.lastCheckin = Date.now();
  }
  // save new challenge into bar's done challenges if existing but not in array
  addChallenge(challengeID) {
    if (challs.find(chall => chall.id == challengeID) === undefined) {
      throw new ReferenceError(`Challenge id is invalid!\tID: ${challengeID}`);
    }
    if (!this.doneChallenges.includes(challengeID)) {
      this.doneChallenges.unshift(challengeID);
    }
  }
  // return challenge object via id
  getChall(challengeID) {
    return challs.find(el => el.id == challengeID);
  }
  // iterate through done challenges and add to score
  updateScore() {
    let score = 5;
    this.doneChallenges.forEach(chall => {
      console.log('chall id: ' + chall + '  score: ' + this.getChall(chall).points);
      score += this.getChall(chall).points;
    });
    console.log('bar id: ' + this.barID + ' score: ' + score);
    this.score = score;
    return score;
  }
}

// get user data from local storage
export function loadUser() {
  let user = null;
  let from_storage = localStorage.getItem('myUser');
  // if storage is not empty
  if (from_storage) {
    console.log('sths there....');
    let data = JSON.parse(from_storage);
    user = new User();
    // make deep copy of user
    data.barsVisited.forEach(b => {
      // create new bar object with old timestamp
      let bar = new Bar(b.barID, b.lastCheckin);
      // push bar at array start
      user.barsVisited.unshift(bar);
      console.log(`bar id: ${bar.barID}`);
      b.doneChallenges.forEach(chall => {
        // add done challenges to bar object
        bar.addChallenge(chall);
      });
    });
    if (data.currentBar !== undefined) {
      user.checkIn(data.currentBar.barID, true);
    }
  } else {
    user = new User();
  }
  setTimeout(10000);
  user.updateScore();
  return user;
}

// let bar1 = new Bar(bars[1].id);
// let bar2 = new Bar(bars[0].id);
// let usr = new User();

// console.log(usr.score + "\t" + usr.barsVisited.length);

// usr.checkIn(bar1.barID);
// usr.checkIn(bar2.barID);
// usr.checkIn(bar1.barID);
// usr.addChallenge(1, bar1.barID);
// usr.addChallenge(2, bar2.barID);

// usr.updatescore();
