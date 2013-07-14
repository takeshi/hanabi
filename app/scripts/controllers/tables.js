'use strict';

angular.module('hanabiApp')
	.controller('TablesCtrl', function($scope, tableDao) {
	$scope.init = function() {
		tableDao.findAll(function(err, data) {
			$scope.tables = data;
			$scope.$apply();
		});
	};
});