'use strict';

angular.module('hanabiApp')
	.controller('TablesCtrl', function($scope, db, TableDao) {
	$scope.init = function() {
		db.tx(function(tx) {
			var tableDao = new TableDao(tx);
			tableDao.findAll(function(err, data) {
				$scope.tables = data;
				$scope.$apply();
			});
		});
	};
});