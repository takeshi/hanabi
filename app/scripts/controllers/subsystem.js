'use strict';

angular.module('hanabiApp')
	.controller('SubsystemCtrl', function($scope, $routeParams, db) {
	var system = $scope.system = $routeParams.system;
	var subsystem = $scope.subsystem = $routeParams.name;
	$scope.concept = '';
	$scope.process = '';

	var loadConceptModel = function() {
		db.execute('select * from ConceptModel where system=? and subsystem=?', [system, subsystem], function(err, data) {
			if (err) {
				console.error(err);
				return;
			}
			$scope.concepts = data;
			$scope.$apply();
		});
	};

	var loadProcess = function() {
		db.execute('select p.name as "name",a.name as "activity" ' +
			'from Process p LEFT OUTER JOIN Activity a ON p.name=a.process And p.subsystem=a.subsystem and p.system=a.system  ' +
			'where p.system=? and p.subsystem=? ', [system, subsystem], function(err, data) {
			if (err) {
				console.error(err);
				return;
			}

			$scope.processes = [];
			var item = {};
			angular.forEach(data, function(process) {
				var p = item[process.name];
				if (!p) {
					p = {
						name: process.name,
						activities: []
					};
					item[process.name] = p;
					$scope.processes.push(p);
				}
				if (process.activity) {
					p.activities.push(process.activity);
				}
			});
			$scope.$apply();
		});
	};

	$scope.createProcess = function(event) {
		if (event.charCode !== 13) {
			return;
		}
		if ($scope.process.trim().length === 0) {
			return;
		}
		db.execute('insert into Process(name,subsystem,system) values(?,?,?)', [$scope.process, subsystem, system], function(err, data) {
			if (err) {
				console.log(err);
				return;
			}
			$scope.process = '';
			loadProcess();
		});
	};
	$scope.createActivity = function(process, event) {
		if (event.charCode !== 13) {
			return;
		}
		if (process.activity.trim().length === 0) {
			return;
		}
		db.execute('insert into Activity(name,process,subsystem,system) values(?,?,?,?)', [process.activity, process.name, subsystem, system], function(err, data) {
			if (err) {
				console.error(err);
			}
			loadProcess();
		});
	};

	$scope.init = function() {
		loadConceptModel();
		loadProcess();
	};

	$scope.createConceptModel = function($event) {
		if ($event.keyCode !== 13) {
			return;
		}
		if ($scope.concept.trim().length === 0) {
			return;
		}
		db.execute('insert into ConceptModel(name,system,subsystem) values(?,?,?)', [$scope.concept, system, subsystem], function(err, data) {
			if (err) {
				console.error(err);
				return;
			}
			$scope.concept = ""
			loadConceptModel();
		});
		console.log($event);
	};
});