'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  const Feature = app.model.define('feature', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: TEXT,
    feature_type: STRING(30),
    short_description: TEXT,
    long_description: TEXT,
    created_at: DATE,
    updated_at: DATE,
  });
  return Feature;
};
