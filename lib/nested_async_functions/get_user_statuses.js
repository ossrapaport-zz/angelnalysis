var request = require("request");

var getUserStatuses = function(bigCallback, requestOptions) {
  requestOptions.url = "https://api.angel.co/1/status_updates";
  request(requestOptions, function(error, response, body) {
    var userStatuses = body.status_updates;
    var statusArray = [];
    userStatuses.forEach(function(status) {
      statusArray.push(status.message);
    });
    bigCallback(null, statusArray);
    //TODO: If more than one page of results, account for it
  });
};

module.exports = getUserStatuses;