'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, TEXT, ARRAY } = app.Sequelize;
  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    description: TEXT,
    sorter: ARRAY(STRING),
    // parent_id: INTEGER,
    created_at: DATE,
    updated_at: DATE,
  });
  // Category.prototype.customSorter = function () {
  //   console.log('hello');
  //   return " group != {critical}";
  // }
  return Category;
};
