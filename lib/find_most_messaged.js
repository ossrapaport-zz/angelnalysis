var findMostMessaged = function(messages) {
  var currentHighest = 0;
  var mostMessaged = "No One";
  messages.forEach(function(message) {
    if (message.total > currentHighest) {
      currentHighest = message.total;
      mostMessaged = message.users[0].name;
    }
  });
  return mostMessaged;
};

module.exports = findMostMessaged;