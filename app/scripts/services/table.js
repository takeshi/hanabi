'use strict';

angular.module('hanabiApp')
  .factory('TableDao', function(Dao, db, FieldDao) {
  var DataModelDao = function(tx) {
    Dao.apply(this, ['DataModel', tx]);
    this.fieldDao = new FieldDao(tx);
  };
  var p = DataModelDao.prototype = new Dao();

  p.findField = function(name, callback) {
    var self = this;
    var sql = 'select * ' +
      'from Field f inner join ' +
      '(select * from DataModel d inner join DataModel_Field dmf on d.id = dmf.datamodel where d.name = ?) d ' +
      'on f.id = d.field;';
    self.tx.execute(
      sql, [name],
      callback);
  };

  p.insert = function(name, callback) {
    var self = this;
    var sql = 'insert into DataModel (id,name) values(null,?);';
    self.tx.execute(sql, [name], function(err) {
      if (err) {
        callback(err);
        return;
      }
      self.lastInsertRowId(function(err, id) {
        callback(err, id);
      });
    });
  };

  p.deleteReference = function(tableId, callback) {
    var sql = 'delete from DataModel_Field where datamodel = ?';
    this.tx.execute(sql, [tableId], callback);
  };

  p.insertReference = function(tableId, fieldId, callback) {
    var sql = 'insert into DataModel_Field(datamodel,field) values (?,?)';
    this.tx.execute(sql, [tableId, fieldId], callback);
  };

  p.insertReferences = function(tableId, fieldIds, callback) {
    var self = this;
    var fieldId = fieldIds.pop();
    console.log(fieldId, tableId);
    self.insertReference(tableId, fieldId, function(err, data) {
      if (err) {
        return;
      }
      if (fieldIds.length === 0) {
        if (callback)
          callback(null);
        return;
      }
      self.insertReferences(tableId, fieldIds, callback);
    });
  };

  p.updateReference = function(tableId, fieldIds, callback) {
    var self  = this;
    self.deleteReference(tableId, function(err) {
      if (err) {
        callback(err);
        return;
      }
      self.insertReferences(tableId, $.unique(fieldIds), callback);
    });
  };


  p.updateFields = function(table, callback) {
    var self = this;
    var update = function(tableId) {
      var ids = [];
      var insertFields = [];
      angular.forEach(table.fields, function(field) {
        if (field.id) {
          ids.push(field.id);
        } else {
          if (field.name.trim().length !== 0) {
            insertFields.push([null, field.name]);
          }
        }
      });
      if (insertFields.length !== 0) {
        self.fieldDao.batchInsert(insertFields, function(err, result) {
          self.updateReference(tableId, ids.concat(result), callback);
        });
      } else {
        self.updateReference(tableId, ids, callback);
      }
    };

    self.findByName(table.name, function(err, data) {
      if (err || data.length !== 1) {
        this.insert(table.name, function(err, id) {
          if (err) {
            return;
          }
          update(id);
        });
        return;
      }
      update(data[0].id);
    });
  };
  return DataModelDao;

});