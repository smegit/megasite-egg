'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Fun = app.model.define('fun', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    control_type: STRING(30),
    product_type: STRING(30),
    function_code: STRING(30),
    description: STRING,
    url: STRING,
    created_at: DATE,
    updated_at: DATE,
  }, {
      tableName: 'functions'
    });
  return Fun;
};
