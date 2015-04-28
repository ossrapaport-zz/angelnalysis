var getUserStatuses = function(bigCallback, requestOptions, userTextArray) {
  requestOptions.url = "https://api.angel.co/1/status_updates";
  request(requestOptions, function(error, response, body) {
    var userStatuses = body.status_updates;
    userStatuses.forEach(function(status) {
      userTextArray.push(status.message);
    });
    bigCallback(null);
    //TODO: If more than one page of results, account for it
  });
}