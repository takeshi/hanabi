'use strict';

angular.module('hanabiApp')
  .factory('Dao', function($interpolate) {
  var Dao = function(name,tx) {
    this.name = name;
    this.tx = tx;
  };
  var p = Dao.prototype;

  p.lastInsertRowId = function(callback) {
    this.tx.execute("select last_insert_rowid() as 'id';",[], function(err, result) {
      callback(err, result[0].id);
    });
  };

  p.findAll = function(callback) {
    var exp = $interpolate('Select * from {{name}};');
    var sql = exp(this);
    this.tx.execute(sql, [], callback);
  };

  p.findByName = function(name, callback) {
    var exp = $interpolate('Select * from {{name}} t where t.name = ? ');
    var sql = exp(this);
    this.tx.execute(sql, [name], callback);
  };

  p.findById = function(id, callback) {
    var exp = $interpolate('Select * from {{name}} t where t.id = ? ');
    var sql = exp(this);
    this.tx.execute(sql, [id], callback);
  };
  return Dao;

});