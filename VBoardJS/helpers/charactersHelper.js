module.exports = {
  characters: [],
  neighbors: {},
  getCharacters: function(test){
    if (!test) {
      this.characters = this.standardSet;
    }
    return this.characters;
  },           // 0    1    2    3    4    5    6   7     8    9   10    11     0    1    2    3    4    5    6    7    8     0     1    2    3    4    5
  standardSet: [["y", "f", "j", "x", "o", "c", "_", "b", "z", "k", "q", "p"], ["g", "h", "v", "d", "w", "m", "u", "l", "r"], ["t", "i", "n", "a", "s", "e"]],
  getNeighbors: function(){
    if(!this.characters.length){
      this.characters = this.getCharacters();
    }
    let neighborIndex = 0;
    for(let charsetIndex in this.characters){
      for(let characterIndex in this.characters[charsetIndex]){
        this.mapNeighbors(charsetIndex, characterIndex, neighborIndex);
        neighborIndex ++;
      }
    }
    console.log('done');
    return this.neighbors;
  },
  mapNeighbors: function(index0, index1, index2){
    for(let neighborArrayValue of this.neighborArray[index2]){
      this.neighbors[this.characters[index0][index1].toString().toUpperCase()] += this.characters[neighborArrayValue[0]][neighborArrayValue[1]].toString().toUpperCase();
    }

  },
  neighborArray: [
    //outer ring
    [[0, 11], [1, 0], [0, 1], [1, 8], [1, 1]],
    [[0,0], [1,0], [1,1], [0, 2]],
    [[0, 1], [1, 1], [1, 2], [0, 3]],
    [[0, 2], [1, 2], [1, 3], [0, 4]],
    [[0, 3], [1, 3], [1, 4], [0, 5]],
    [[0, 4], [1, 3], [1, 4], [0, 6]],
    [[0, 5], [1, 4], [1, 5], [0, 7]],
    [[0, 6], [1, 5], [1, 6], [0, 8]],
    [[0, 7], [1, 5], [1, 6], [0, 9]],
    [[0, 8], [1, 6], [1, 7], [0, 10]],
    [[0, 9], [1, 7], [1, 8], [0, 11]],
    [[0, 10], [1, 8], [1, 0], [0, 0]],
    //middle ring
    [[0, 0], [0, 1], [1, 1], [2, 1], [2, 0], [2, 5], [1, 8], [0, 11]],
    [[0, 0], [0, 1], [0, 2], [1, 2], [2, 1], [2, 0], [1, 0]],
    [[1, 1], [0, 2], [0, 3], [1, 3], [2, 2], [2, 1]],
    [[1, 2], [0, 3], [0, 4], [0, 5], [1, 4], [2, 2]],
    [[2, 2], [1, 3], [0, 5], [0, 6], [1, 5], [2, 3]],
    [[2, 4], [2, 3], [1, 4], [0, 6], [0, 7], [1, 6]],
    [[1, 7], [2, 4], [1, 5], [0, 7], [0, 8], [0, 9]],
    [[0, 10], [1, 8], [2, 5], [2, 4], [1, 6], [0, 9]],
    [[0, 11], [0, 0], [1, 0], [2, 0], [2, 5], [1, 7], [0, 4]],
    //inner ring
    [[1, 0], [1, 1], [2, 1], [2, 5], [1, 8]],
    [[2, 0], [1, 1], [1, 2], [2, 2]],
    [[2, 1], [1, 2], [1, 3], [1, 4], [2, 3]],
    [[2, 4], [2, 2], [1, 4], [1, 5]],
    [[2, 5], [2, 3], [1, 5], [1, 6], [1, 7]],
    [[1, 8], [2, 0], [2, 4], [1, 7]]
  ]
};