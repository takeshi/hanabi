'use strict';

angular.module('hanabiApp')
	.controller('SystemCtrl', function($scope, $routeParams, db) {

	var system = $scope.name = $routeParams.name;
	
	$scope.createSubSystem = function(event){
		if(event.keyCode !== 13){
			return;
		}
		if($scope.subsystem.trim().length === 0){
			return;
		}


		db.execute('insert into SubSystem(system,name) values(?,?)',[system,$scope.subsystem],function(err){
			if(err){
				console.error(err);
				return;
			}
			$scope.subsystem = '';
			$scope.init();
			$scope.$apply();
		});
	};

	$scope.update = function(){
		console.log("update")
		var params = [];
		var seq = 1;
		$('ul.sortable > li').each(function(){
			var name = $(this).text().trim();
			var param = [seq++,system,name];
			params.push(param);
		});
		db.batchExecute('update SubSystem set seq=? where system=? and name=?',params,function(err,data){
			console.log(err,data);
		});
	};

	$scope.init = function() {
		db.execute('select * from SubSystem where system = ? order by seq', [system], function(err, data) {
			if (err) {
				console.error(err);
				return;
			}
			$scope.subsystems = data;
			$scope.$apply();

			$('.sortable').sortable();

		});
	};
});