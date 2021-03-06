'use strict';

angular.module('hanabiApp')
	.controller('TableCtrl', function($scope, $routeParams, db, TableDao, FieldDao) {
	window.tableScope = $scope;
	var name = $routeParams.name;
	$scope.table = {
		name: name,
		fields: []
	};
	var fieldList = [];
	$scope.init = function() {
		db.tx(function(tx) {
			var tableDao = new TableDao(tx);
			var fieldDao = tableDao.fieldDao;
			tableDao.findField(name, function(err, fields) {
				$scope.table.fields = [];
				angular.forEach(fields, function(f) {
					$scope.table.fields.push({
						id: f.id,
						name: f.name
					});
				});
				$scope.addField();
				$scope.$apply();
			});
			fieldDao.findAll(function(err, fields) {
				fieldList.length = 0;
				angular.forEach(fields, function(f) {
					fieldList.push(f.name);
				});
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
		$scope.$apply();
		setTimeout(function() {
			console.log($("#field_" + ($scope.table.fields.length - 1)));
			$("#field_" + ($scope.table.fields.length - 1)).focus();
		}, 10);
	};

	$scope.deleteField = function(num) {
		$scope.table.fields.splice(num, 1);
	};

	$scope.update = function() {
		db.tx(function(tx) {
			var tableDao = new TableDao(tx);
			tableDao.updateFields($scope.table, function(err, result) {
				console.log(err, result);
				$scope.init();
			});
		});
	};

	$scope.updateId = function($field) {
		db.tx(function(tx) {
			var fieldDao = new FieldDao(tx);
			fieldDao.findByName($field.name, function(err, f) {
				if (f && f.length === 1) {
					$field.id = f[0].id;
				} else {
					$field.id = '';
				}
				$scope.$apply();
			});
		});
	};

});