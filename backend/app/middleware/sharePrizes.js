//End Game and Distribute Prizes - Used for manaul override of end of week functionality (For testing purposes only)
function sharePrizes(doc, totalGains, gameName, callb) {
    awardList = [];
    if (doc) {
      let keys = Object.keys(doc);
      let len = keys.length; // expected length =100
      test = 0.0;
      let topThree = 0.0;
  
      for (let i = 0; i < len; i++) {
        let gained = 0.0;
        if ("1" === keys[i]) {
          gained = totalGains * 0.2;
          topThree += gained;
        } else if ("2" === keys[i]) {
          gained = totalGains * 0.15;
          topThree += gained;
        } else if ("3" === keys[i]) {
          gained = totalGains * 0.1;
          totalGains = totalGains - topThree - gained;
        } else {
          gained = ((len + 1 - i) * totalGains) / (((len - 3) * (len - 2)) / 2); // for remaining 97 gamer: n(n+1)/2
        }
        console.log("player rank", i);
        let gamer = JSON.parse(doc[keys[i]]);
        awardList.push({
          userName: gamer.userName,
          gained: gained,
          rank: i + 1,
          score: gamer.gain,
          gameName: gameName,
        });
      }
    }
  
    callb(awardList);
  }
  
exports.sharePrizes = sharePrizes;
