/*
User contains a score, a bar they're currently visiting and a collection of previously visited bars
    Score will be calculated by the bars visited

Bar contains a barID, a timestamp of users last check-in, a score and a collection of challenges that the user completed
    BarID references a bar in bars.json
    Score is calculated by points for the check-in plus the sum of points each done challenge brings

Challenge contains a challengeID referencing a challenge with a description and either a score or a level of difficulty
*/
let bars = require('./bars.json').businesses;

let dummyChalls = [
    {
        'challengeID' : 1,
        'description' : 'Get a Wheat Beer!',
        'score' : 2
    },
    {
        'challengeID' : 2,
        'description' : 'Get a stranger by the counter a drink!',
        'score' : 5
    }
]

class User {
    constructor(){
        this.score = 0;
        this.currentBar = {};  //object with ID and timestamp
        this.barsVisited = [];   //collection; has Bar ID, timestamp of last ckechin and collection of completed challenges
    }
    checkIn(barID){
        let currBar
        if (usr.barsVisited.findIndex(bar => bar.barID == barID) == -1){
            currBar = new Bar(barID);
            this.barsVisited.push(currBar);
            this.score += currBar.score;
        }
        else {
            currBar = usr.barsVisited.find(bar => bar.barID == barID); // Shallow
            currBar.updateChekIn()
        }
        this.currentBar = currBar;
    }
    addChallenge(challengeID, barID){
        let bar = usr.barsVisited.find(bar => bar.barID == barID);
        bar.addChallenge(challengeID);
    }
    updatescore(){
        let score = 0;
        this.barsVisited.forEach(bar => {
            score += bar.score;
        });
        console.log(score);
    }
}

class Bar {
    constructor(barID){
        this.barID = barID;
        this.lastCheckin = Date.now();
        this.score = 5;
        this.doneChallenges = [];
    }
    updateChekIn(){
        this.lastCheckin = Date.now();
    }
    addChallenge(challengeID){
        if (!(this.doneChallenges.includes(challengeID))){
            this.doneChallenges.push(challengeID);
            return this.addScore(challengeID);
        }
    }
    addScore(challengeID){
        this.score += dummyChalls.find(el => el.challengeID == challengeID).score;
        return this.score;
    }
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