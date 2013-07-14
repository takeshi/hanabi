'use strict';


angular.module('hanabiApp', [])
  .config(function($routeProvider) {
  $routeProvider
    .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
    .when('/tables/:name', {
    templateUrl: 'views/table.html',
    controller: 'TableCtrl'
  })
    .when('/tables', {
    templateUrl: 'views/tables.html',
    controller: 'TablesCtrl'
  })
    .otherwise({
    redirectTo: '/'
  });
});