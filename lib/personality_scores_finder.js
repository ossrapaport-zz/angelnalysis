var opennessObject = require("./personality_objects/openness_object.js"),
    conscientiousnessObject = require("./personality_objects/conscientiousness_object.js"),
    extraversionObject = require("./personality_objects/extraversion-object.js"),
    neuroticismObject = require("./personality_objects/neuroticism_object.js"),
    agreeablenessObject = require("./personality_objects/agreeableness_object.js");

var getPersonalityScores = function(textArray) {
  //RegEx filterng strips punctuation from newly-formed string
  var formattedArray = textArray.join(" ").replace(/[.,!-?()#$;:]/g, "").split(" ");
  //The aplhabetized array below is for individual words
  var singleWordSortedArray = formattedArray.sort();
  //The array below is for two-word phrases
  var doubleWordArray = makeDoubleWordArray(formattedArray); 
  //The array below is for three-word phrases
  var tripleWordArray = makeTripleWordArray(formattedArray);

  var opennessScore = findOpennessScore(singleWordSortedArray, doubleWordArray, tripleWordArray);

}

var makeDoubleWordArray = function(formattedArray) {
  var doubleWordArray = [];
  for (var i = 1; i < formattedArray.length; i ++) {
    doubleWordArray.push( [formattedArray[i - 1], formattedArray[i]].join(" ") );
  }
  return doubleWordArray;
};

var makeTripleWordArray = function(formattedArray) {
  var tripleWordArray = [];
  for (var i = 2; i < formattedArray.length; i ++) {
    tripleWordArray.push( [formattedArray[i - 2], formattedArray[i - 1], formattedArray[i]].join(" ") );
  }
  return tripleWordArray;
};

//TODO: Replicate this structure for the other scores
var findOpennessScore = function(singleWordSortedArray, doubleWordArray, tripleWordArray) {
  var opennessSum = 0;

  var sumLevel1 = getArraySum(singleWordSortedArray, opennessObject, opennessSum);
  var sumLevel2 = getArraySum(doubleWordArray, opennessObject, sumLevel1);
  var sumLevel3 = getArraySum(tripleWordArray, opennessObject, sumLevel2);
  return sumLevel3;
};

var getArraySum = function(array, object, currentSum) {
  array.forEach(function(element) {
    var wordCount = 0;
    for (var i = 0; i < array.length; i ++) {
      if (array[i] === element) {
        wordCount ++;
      }
    }
    currentSum += (object[element]*wordCount);
  });
  return currentSum;
};


module.exports = getPersonalityScores;
