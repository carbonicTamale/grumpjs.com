angular.module('grump.upload', ['ngCookies'])

.controller('UploadController', function ($scope, Files, $location, $cookies) {
  $scope.doc = {
    repo : null,
    defaultCommand : null,
    description: null
  };

  $scope.submitForm = function(obj) {
    if($cookies.get('id')) {
      obj.userId = $cookies.get('id');
      obj.internal = true;
    }

    Files.submitGrump(obj)
      .then(function(result){
        //TODO: notify user of success
        $scope.doc.repo = null;
        $scope.doc.defaultCommand = null;
        $scope.doc.description = null;
        console.log(JSON.stringify(result));
        $location.url('/browse');
      })
      .catch(function (error) {   //TODO: notify user of error
        console.log(error);
        $location.url('/errorpage/?error=There%20is%20a%20problem%20with%20your%20upload%20form');
      });
  };

});
