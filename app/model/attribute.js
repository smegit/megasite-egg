'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, ARRAY } = app.Sequelize;

  const Attribute = app.model.define('attribute', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(30),
    description: TEXT,
    input_type: STRING(30),
    ui_type: STRING(30),
    options: ARRAY(STRING),
    created_at: DATE,
    updated_at: DATE,
  });
  return Attribute;
};
