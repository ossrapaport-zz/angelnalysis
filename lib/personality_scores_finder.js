var opennessObject = require("./personality_objects/openness_object.js"),
    conscientiousnessObject = require("./personality_objects/conscientiousness_object.js"),
    extraversionObject = require("./personality_objects/extraversion_object.js"),
    neuroticismObject = require("./personality_objects/neuroticism_object.js"),
    agreeablenessObject = require("./personality_objects/agreeableness_object.js");

var getPersonalityScores = function(textArray) {
  //The aplhabetized array below is for individual words
  var textString = textArray.join(" "); 
  var singlesArray = textString.replace(/[^\w\s]-[']|_/g, function ($1) { 
    return ' ' + $1 + ' ';
  })
  .replace(/[ ]+/g, ' ')
  .split(' ');
  //RegEx filterng strips punctuation from newly-formed string
  var sanitizedWordsArray = textString.replace(/[.,!-?()#$;:]/g, "").split(" ");
  //The array below is for two-word phrases
  var doubleWordArray = makeDoubleWordArray(sanitizedWordsArray); 
  //The array below is for three-word phrases
  var tripleWordArray = makeTripleWordArray(sanitizedWordsArray);

  //Get the scores for each personality type
  var agreeablenessScore = findTypeScore(agreeablenessObject, singlesArray, doubleWordArray, tripleWordArray);
  var conscientiousnessScore = findTypeScore(conscientiousnessObject, singlesArray, doubleWordArray, tripleWordArray);
  var extraversionScore = findTypeScore(extraversionObject, singlesArray, doubleWordArray, tripleWordArray);
  var neuroticismScore = findTypeScore(neuroticismObject, singlesArray, doubleWordArray, tripleWordArray);
  var opennessScore = findTypeScore(opennessObject, singlesArray, doubleWordArray, tripleWordArray);

  var personalityScoresObject = {
    agreeableness: agreeablenessScore,
    conscientiousness: conscientiousnessScore,
    extraversion: extraversionScore,
    neuroticism: neuroticismScore,
    openness: opennessScore
  };

  return personalityScoresObject;
};

//Make an array of all possible double word combinations
var makeDoubleWordArray = function(wordsArray) {
  var doubleWordArray = [];
  for (var i = 1; i < wordsArray.length; i ++) {
    doubleWordArray.push( [wordsArray[i - 1], wordsArray[i]].join(" ") );
  }
  return doubleWordArray;
};

//Make an array of all possible triple word combinations
var makeTripleWordArray = function(wordsArray) {
  var tripleWordArray = [];
  for (var i = 2; i < wordsArray.length; i ++) {
    tripleWordArray.push( [wordsArray[i - 2], wordsArray[i - 1], wordsArray[i]].join(" ") );
  }
  return tripleWordArray;
};

//Get the scores for each personality type
var findTypeScore = function(typeObject, singlesArray, doubleWordArray, tripleWordArray) {
  var sumOne = getArraySum(singlesArray, typeObject);
  var sumTwo = getArraySum(doubleWordArray, typeObject);
  var sumThree = getArraySum(tripleWordArray, typeObject);
  return sumOne + sumTwo + sumThree;
};

//Find the word sum in each array
var getArraySum = function(array, object) {
  var sum = 0;
  array.forEach(function(element) {
    if (object[element]) {    
      var wordCount = 0;
      for (var i = 0; i < array.length; i ++) {
        if (array[i] === element) {
          wordCount ++;
        }
      }
      //TODO: Sort out not multiplying by undefined 
      //console.log("Element Value:", object[element]);
      var sumToAdd = (object[element]*wordCount);
      sum += sumToAdd;
    }
  });
  return sum;
};

module.exports = getPersonalityScores;