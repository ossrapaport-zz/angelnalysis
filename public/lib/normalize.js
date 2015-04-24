App.normalize = function(data, type) {
  var lowest;
  var highest;
  if (type === "Agreeableness") {
    lowest = -5.082218;
    highest = 4.086540000000001;
  } else if (type === "Conscientiousness") {
    lowest = -4.820952000000002;
    highest = 4.9125630000000005;
  } else if (type === "Extraversion") {
     lowest = -4.591362;
     highest = 7.166193999999998;
  } else if (type === "Neuroticism") {
    lowest = -5.038373999999998; 
    highest = 2.843192;
  } else if (type === "Openness") {
     lowest = -4.867211999999997;
     highest = 8.510583;
  }

  var normalizedValue = (data - lowest)/(highest - lowest);

  return normalizedValue;

};


/*

  

  

  

    
*/