angular.module('grump.browse', [])

.controller('BrowseController', function ($scope, Files) {
  $scope.allGrumps = [];
  $scope.grumps = [];
  $scope.categories = [];
  $scope.category = "General";

  $scope.getGrumps = function(){
    return Files.getGrumps().then(function (results) {
      $scope.grumps = results;
      $scope.allGrumps = results;

      for(var i = 0; i < $scope.allGrumps.length; i++) {
        var grump = $scope.allGrumps[i];

        if($scope.categories.indexOf(grump.category) === -1) {
          $scope.categories.push(grump.category);
        }
      }

      //returning scope.grumps for testing...
      return $scope.grumps;
    });
  };

  $scope.filterGrumps = function() {
    // do something with the filter
    // will probably be doing filterng purely in view
    $scope.grumps = [];
    console.log($scope.category);

    for(var i = 0; i < $scope.allGrumps.length; i++) {
      var grump = $scope.allGrumps[i];

      if(grump.category === $scope.category) {
        $scope.grumps.push(grump);
      }
    }

    console.log($scope.grumps);
  }
});
