'use strict';


angular.module('hanabiApp', [])
  .config(function($routeProvider) {
  $routeProvider
    .when('/', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .when('/systems/:system/:name', {
    templateUrl: 'views/subsystem.html',
    controller: 'SubsystemCtrl'
  })

    .when('/systems/:name', {
    templateUrl: 'views/system.html',
    controller: 'SystemCtrl'
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