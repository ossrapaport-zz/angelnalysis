var findMostMessaged = function(messages) {
  var currentHighest = 0;
  var mostMessaged = "No One";
  var theBio = "faciant beatiorem";
  messages.forEach(function(message) {
    if (message.total > currentHighest) {
      currentHighest = message.total;
      mostMessaged = message.users[0].name;
      theBio = message.users[0].bio;
    }
  });
  
  return {
      name: mostMessaged,
      bio: theBio 
  };
};

module.exports = findMostMessaged;