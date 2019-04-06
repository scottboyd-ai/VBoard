const charHelper = require('./charactersHelper');
module.exports = {
  neighbors: charHelper.getNeighbors(),
  initNeighbors: function(){
    // this.neighbors = {
    //   A: "SNWM",
    //   B: "_MUZ",
    //   C: "ODW_",
    //   D: "VXOCWN",
    //   E: "RTSL",
    //   F: "YGHJ",
    //   G: "YFHITERP",
    //   H: "YFJVITG",
    //   I: "THVN",
    //   J: "FHVX",
    //   K: "ZULQ",
    //   L: "QRESUK",
    //   M: "SAW_BU",
    //   N: "IVDWA",
    //   O: "XDWC",
    //   P: "QRGY",
    //   Q: "KLRP",
    //   R: "PYGTELQ",
    //   S: "EAMUL",
    //   T: "GHIER",
    //   U: "LSMBZK",
    //   V: "HJXDNI",
    //   W: "NDC_MA",
    //   X: "JVDO",
    //   Y: "PGFRH",
    //   Z: "BMUK",
    //   "_": "CWMB"
    // };
  },
  getDistance: function(__this, that){
    const thisLength = __this.word.length;
    let thatLength;
    if (that.word) {
      thatLength = that.word.length;
      that = that.word.toUpperCase();
    } else{
      thatLength = that.length;
      that = that.toUpperCase();
    }

    const matrix = [];
    __this = __this.word.toUpperCase();

    // If the limit is not defined it will be calculate from this and that args.
    const limit = ((thatLength > thisLength ? thatLength : thisLength)) + 1;

    for (let i = 0; i < limit; i++) {
      matrix[i] = [i * 2];
      matrix[i].length = limit;
    }
    for (let i = 0; i < limit; i++) {
      matrix[0][i] = i * 2;
    }

    if (Math.abs(thisLength - thatLength) > (limit || 100)) {
      return limit || 100;
    }
    if (thisLength === 0) {
      return thatLength;
    }
    if (thatLength === 0) {
      return thisLength;
    }

    // Calculate matrix.
    let j, this_i, that_j, cost, min, t;
    for (let i = 1; i <= thisLength; ++i) {
      this_i = __this[i - 1];
      // Step 4
      for (j = 1; j <= thatLength; ++j) {
        // Check the jagged ld total so far
        if (i === j && matrix[i][j] > 4) return thisLength;

        that_j = that[j - 1];
        if (this_i === that_j) {
          cost = 0;
        }
        else if (this.neighbors[this_i].indexOf(that_j) !== -1) {
          cost = 1;
        }
        else {
          cost = 2;
        }
        // Calculate the minimum (much faster than Math.min(...)).
        min = matrix[i - 1][j] + 1; // Deletion.
        if ((t = matrix[i][j - 1] + 1) < min) min = t;   // Insertion.
        if ((t = matrix[i - 1][j - 1] + cost) < min) min = t;   // Substitution.

        // Update matrix.
        matrix[i][j] = (i > 1 && j > 1 && this_i === that[j - 2] && __this[i - 2] === that_j && (t = matrix[i - 2][j - 2] + cost) < min) ? t : min; // Transposition.
      }
    }

    return matrix[thisLength][thatLength];

  }
};
