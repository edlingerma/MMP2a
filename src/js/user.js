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
    localStorage.setItem('myUser', JSON.stringify(this));
  }
  checkIn(barID) {
    console.log('check into ' + barID);
    if (barsData.find(bar => bar.id == barID) === undefined) {
      throw new ReferenceError(`Bar id is invalid!\tID: ${barID}`);
    } else {
      let currBar;
      if (this.barsVisited.findIndex(bar => bar.barID == barID) == -1) {
        currBar = new Bar(barID);
        this.barsVisited.push(currBar);
        this.score += currBar.score;
      } else {
        currBar = this.barsVisited.find(bar => bar.barID == barID); // Shallow
        currBar.updateChekIn();
      }
      this.currentBar = currBar;
      this.save();
    }
  }
  checkOut() {
    this.currentBar = null;
  }
  addChallenge(challengeID) {
    let bar = this.currentBar;
    if (bar == null) {
      throw new ReferenceError('User not currently checked in!');
    } else {
      bar.addChallenge(challengeID);
      this.updateScore();
      this.save();
    }
  }
  updateScore() {
    let score = 0;
    this.barsVisited.forEach(bar => {
      score += bar.updateScore();
    });
    this.score = score;
  }
}

export class Bar {
  constructor(barID, lastCheckin = Date.now()) {
    this.barID = barID;
    this.lastCheckin = lastCheckin;
    this.score = 5;
    this.doneChallenges = [];
  }
  updateChekIn() {
    this.lastCheckin = Date.now();
  }
  addChallenge(challengeID) {
    if (challs.find(chall => chall.id == challengeID) === undefined) {
      // throw new ReferenceError(`Challenge id is invalid!\tID: ${challengeID}`)
    }
    if (!this.doneChallenges.includes(challengeID)) {
      console.log('Not Included!');
      this.doneChallenges.push(challengeID);
      return this.updateScore();
    }
  }
  addScore(challengeID) {
    return challs.find(el => el.challengeID == challengeID).points;
  }
  updateScore() {
    let score = 5;
    this.doneChallenges.forEach(chall => {
      score += this.addScore(chall.challengeID);
    });
    this.score = score;
    return score;
  }
}

export function loadUser() {
  let user = null;
  let from_storage = localStorage.getItem('myUser');
  if (from_storage) {
    console.log('sths there....');
    let data = JSON.parse(from_storage);
    user = new User();
    console.log(user.barsVisited);
    data.barsVisited.forEach(b => {
      let bar = new Bar(b.barID, b.lastCheckin);
      user.barsVisited.push(bar);
      b.doneChallenges.forEach(chall => {
        console.log(`Bar: ${bar.barID}, Challenge: ${chall}`);
        bar.addChallenge(chall);
      });
    });
    user.updateScore();
    if (data.currentBar !== undefined) {
      user.checkIn(data.currentBar.barID);
      console.log('IS DEFINED');
    }
    console.log(user.barsVisited);
    console.log(data);
  } else {
    user = new User();
  }

  console.log(user);
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
