var findMostFollowed = function(users) {
  var currentHighest = 0;
  var mostFollowed = "No One";
  users.forEach(function(user) {
    if (user.follower_count > currentHighest) {
      currentHighest = user.follower_count;
      mostFollowed = user.name;
    }
  });
  return(mostFollowed);
};

module.exports = findMostFollowed;