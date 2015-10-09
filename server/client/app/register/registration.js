angular.module('grump.registration', [])

.controller('RegistrationController', function ($scope, $window, $http) {
  $scope.username = "";
  $scope.handle   = "";
  $scope.password = "";
  $scope.email    = "";

  $scope.register = function() {
    var user = {
      name:     $scope.username,
      handle:   $scope.handle,
      password: $scope.password,
      email:    $scope.email
    }

    var successCallback = function() {
      $window.location.href = '#/signin';
    }

    var errorCallback = function(err) {
      // indicate to the user that there was an error during registration
    }

    $http.post('./api/register', user).then(successCallback, errorCallback);
  }
});