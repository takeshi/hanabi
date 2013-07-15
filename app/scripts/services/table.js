'use strict';

angular.module('hanabiApp')
  .factory('tableDao', function(Dao, db, fieldDao) {
  var dao = new Dao('DataModel');
  dao.findField = function(name, callback) {
    var sql = 'select * ' +
      'from Field f inner join ' +
      '(select * from DataModel d inner join DataModel_Field dmf on d.id = dmf.datamodel where d.name = ?) d ' +
      'on f.id = d.field;';
    db.execute(
      sql, [name],
      callback);
  };

  dao.insert = function(name, callback) {
    var sql = 'insert into DataModel (id,name) values(null,?);';
    db.execute(sql, [name], function(err) {
      if (err) {
        callback(err);
        return;
      }
      dao.lastInsertRowId(function(err, id) {
        callback(err, id);
      });
    });
  };

  dao.deleteReference = function(tableId, callback) {
    var sql = 'delete from DataModel_Field where datamodel = ?';
    db.execute(sql, [tableId], callback);
  };

  dao.insertReference = function(tableId, fieldId, callback) {
    var sql = 'insert into DataModel_Field(datamodel,field) values (?,?)';
    db.execute(sql, [tableId, fieldId], callback);
  };

  dao.insertReferences = function(tableId, fieldIds, callback) {
    var fieldId = fieldIds.pop();
    console.log(fieldId, tableId);
    dao.insertReference(tableId, fieldId, function(err, data) {
      if (err) {
        return;
      }
      if (fieldIds.length === 0) {
        if (callback)
          callback(null);
        return;
      }
      dao.insertReferences(tableId, fieldIds, callback);
    });
  };

  dao.updateReference = function(tableId, fieldIds, callback) {
    dao.deleteReference(tableId, function(err) {
      if (err) {
        callback(err);
        return;
      }
      dao.insertReferences(tableId, $.unique(fieldIds), callback);
    });
  };


  dao.updateFields = function(table, callback) {
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
        fieldDao.batchInsert(insertFields, function(err, result) {
          dao.updateReference(tableId, ids.concat(result), callback);
        });
      } else {
        dao.updateReference(tableId, ids, callback);
      }
    };

    dao.findByName(table.name, function(err, data) {
      if (err || data.length !== 1) {
        dao.insert(table.name, function(err, id) {
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
  return dao;

});