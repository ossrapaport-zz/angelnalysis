var request = require("request");

var getMessages = function(smallCallback, requestOptions, threadID, angelID) {
  requestOptions.url = "https://api.angel.co/1/messages/" + threadID,
  request(requestOptions, function(error, response, body) {
    //Get the messages array from each thread
    var messages = body.messages;
    var messageBodies = messages.map(function(message) {
      //If the user sent the message, get that text
      if (parseInt( message.sender_id ) === parseInt( angelID )) {
        return message.body;
      }
    });
    var filteredMessageBodies = messageBodies.filter(function(body) {
      return body !== undefined;
    });
    //Once the messages are in the text array, callback time
    smallCallback(null, filteredMessageBodies);      
  });
};

module.exports = getMessages;