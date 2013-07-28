'use strict';

angular.module('hanabiApp')
  .factory('FieldDao', function(Dao) {
  var FieldDao = function(tx) {
    Dao.apply(this, ['Field', tx]);
  }
  var p = FieldDao.prototype = new Dao();

  p.insert = function(params, callback) {
    var self = this;
    var sql = 'insert into Field values(?,?)';
    self.tx.execute(sql, params, function(err, result) {
      if (err) {
        callback(err);
        return;
      }
      self.lastInsertRowId(function(err, result) {
        callback(err, result);
      });
    });
  };
  p._batchInsert = function(fields, callback, results) {
    var self = this;
    var field = fields.pop();
    self.insert(field, function(err, data) {
      if (err) {
        callback(err);
        return;
      }
      results.push(data);
      if (fields.length === 0) {
        callback(err, results);
        return;
      }
      self._batchInsert(fields, callback, results);
    });

  };
  p.batchInsert = function(fields, callback) {
    this._batchInsert(fields, callback, []);
  };

  return FieldDao;
});