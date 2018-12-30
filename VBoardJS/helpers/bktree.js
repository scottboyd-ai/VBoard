const lDist = require('./LevenshteinDistanceHelper');

function BKTree(term){
  if (term instanceof Array) {
    let tree = new BKTree(term.pop());
    tree.addTerms(term);
    return tree;
  }
  this.term = term;
  this.children = {};
}

BKTree.prototype.addTerms = function(newTerms){
  let len = newTerms.length;
  for (let ii = 0; ii < len; ++ii) {
    this._addTerm(newTerms[ii]);
  }
};

BKTree.prototype._addTerm = function(newTerm){
  let dist = lDist.getDistance(this.term, newTerm);
  if ('undefined' !== typeof this.children[dist]) {
    this.children[dist]._addTerm(newTerm);
  } else {
    this.children[dist] = new BKTree(newTerm);
  }
};

BKTree.prototype.query = function(queryTerm, maxDist, k){
  maxDist = maxDist || 10;
  let localK = k || null;
  let tempResults = [];
  this._query(queryTerm, maxDist, null, tempResults);

  tempResults.sort(function(a, b){
    return (b.t.count - a.t.count);
  });

  let results = [];
  //Use this code to add all results found to the return list
  // let len = tempResults.length;
  // if (null !== localK) {
  //   len = Math.min(localK, tempResults.length);
  // }
  //Use this to set the max number of results;
  let len = 10;
  for (let ii = 0; ii < len; ++ii) {
    results.push(tempResults[ii]);
  }
  return results;
};

BKTree.prototype._matchLetters = function(queryTerm){
  let localTermWord = this.term.word.toUpperCase();
  let localQueryTerm = queryTerm.toUpperCase();
  let firstLetter = localTermWord[0] === localQueryTerm[0];
  let lastLetter = localTermWord[localTermWord.length - 1] === localQueryTerm[localQueryTerm.length - 1];
  return firstLetter && lastLetter;
};

// BKTree.prototype._matchNeighbors = function(queryTerm){
//   let localTermWord = this.term.word.toUpperCase();
//   let localQueryTerm = queryTerm.toUpperCase();
//   let firstNeighbor = lDist.neighbors[localQueryTerm[0]].includes(localTermWord[0]);
//   let lastNeighbor = lDist.neighbors[localQueryTerm[localQueryTerm.length - 1]].includes(localTermWord[localTermWord.length - 1]);
//
//   console.log('first: ' + firstNeighbor);
//   console.log('last: ' + lastNeighbor);
//   return firstNeighbor || lastNeighbor;
// };

BKTree.prototype._query = function(queryTerm, maxDist, d, results){
  // console.log('queryTerm: ' + queryTerm);
  // console.log('term: ' + this.term.word);
  let dist = lDist.getDistance(this.term, queryTerm);
  // dist += this._matchLetters(queryTerm) ? 0 : 1;
  // dist += this._matchNeighbors(queryTerm) ? -2 : 0;
  // To add a word, it must be within the acceptable LDist, as well as start with the same first letter as the query
  // And end with the same last letter as the query
  // TODO consider adding constraints for first/last letters' neighbors
  const matchTerm = this._matchLetters(queryTerm);
  // if (dist <= maxDist) {
  if (dist <= maxDist && matchTerm) {
    results.push({ t: this.term, d: dist });
  }

  if (null === d) {
    d = dist;
  }

  let min = (dist - maxDist);
  let max = (dist + maxDist);
  for (let ii = min; ii <= max; ++ii) {
    if ('undefined' !== typeof this.children[ii]) {
      this.children[ii]._query(queryTerm, maxDist, d, results);
    }
  }
};

module.exports = BKTree;
