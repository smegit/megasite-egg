'use strict';

module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;

    const Attribute = app.model.define('attribute', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(30),
        description: TEXT,
        input_type: STRING(30),
        values: STRING(30),
        sort_order: INTEGER
    });
}