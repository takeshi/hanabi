'use strict';

var init = false;

angular.module('hanabiApp')
  .controller('MainCtrl', function($scope, db, $http) {

  $scope.system = ""
  $scope.createSystem = function(event) {
    if (event.keyCode !== 13) {
      return;
    }
    if ($scope.system.trim().length === 0) {
      return;
    }


    db.execute("insert into System values(?,?)", [$scope.system, null], function() {
      $scope.system = ""
      $scope.loadSystem()
      $scope.$apply();
    })
  }

  $scope.loadSystem = function() {
    db.execute("select * from System", [], function(err, data) {
      if (err) {
        console.error(err);
      }
      $scope.systems = data;
      console.log(data)
      $scope.$apply();
    });

  }

  $scope.init = function() {
    if (init) {
      return;
    }
    $http.get("/db/table.sql")
      .success(function(data) {
      db.tx(function(tx) {
        var sqls = data.split(";");
        var queries = [];
        angular.forEach(sqls, function(sql) {
          tx.execute(sql);
        });
        init = true;
      });
    }).error(function(err) {
      console.log(err);
    });
  }
});