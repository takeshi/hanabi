'use strict';

var init = false;

angular.module('hanabiApp')
  .controller('MainCtrl', function($scope, db, $http) {
  $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
  ];

  $scope.init = function() {
    if (init) {
      return;
    }
    $http.get("/db/table.sql")
      .success(function(data) {
      var sqls = data.split(";");
      var queries = [];
      angular.forEach(sqls, function(sql) {
        db.execute(sql);
      });
    }).error(function(err) {
      console.log(err);
    });
  }
});