'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
    const Category = app.model.define('category', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(30),
        description: TEXT,
        parent_id: INTEGER,
        created_at: DATE,
        updated_at: DATE,
    });
    return Category;
}