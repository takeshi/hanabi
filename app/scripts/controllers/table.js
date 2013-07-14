'use strict';

angular.module('hanabiApp')
	.controller('TableCtrl', function($scope, $routeParams, db, tableDao, fieldDao) {
	var name = $routeParams.name;
	$scope.table = {
		name: name,
		fields: []
	};
	var fieldList = [];
	$scope.init = function() {
		tableDao.findField(name, function(err, fields) {
			$scope.table.fields = [];
			angular.forEach(fields, function(f) {
				$scope.table.fields.push({
					id: f.id,
					name: f.name
				});
			});
			$scope.$apply();
		});
		fieldDao.findAll(function(err, fields) {
			// fieldList = [];
			angular.forEach(fields, function(f) {
				fieldList.push(f.name);
			});
		});
	};

	$scope.initField = function($field) {
		$('.fields').autocomplete({
			source: fieldList,
			select: function(event, value) {
				var fieldIndex = $(event.target).attr("data-index");
				var field = $scope.table.fields[fieldIndex];
				field.name = value.item.label;
				$scope.updateId(field);
			}
		});
	};

	$scope.addField = function() {
		$scope.table.fields.push({
			name: ''
		});
	};

	$scope.deleteField = function(num) {
		$scope.table.fields.splice(num, 1);
	};

	$scope.update = function() {
		tableDao.updateFields($scope.table, function(err, result) {
			console.log(err, result);
			$scope.init();
		});
	};

	$scope.updateId = function($field) {
		fieldDao.findByName($field.name, function(err, f) {
			if (f && f.length === 1) {
				$field.id = f[0].id;
			} else {
				$field.id = '';
			}
			$scope.$apply();
		});
	};

});