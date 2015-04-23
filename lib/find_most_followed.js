var findMostFollowed = function(users) {
  var currentHighest = 0;
  var mostFollowed = "No One";
  var theBio = "vitam quae";
  users.forEach(function(user) {
    if (user.follower_count > currentHighest) {
      currentHighest = user.follower_count;
      mostFollowed = user.name;
      theBio = user.bio;
    }
  });
  
  return {
    name: mostFollowed,
    bio: theBio
  };
};

module.exports = findMostFollowed;